const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});
const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();
const dynDb = new AWS.DynamoDB.DocumentClient();

async function getMetadata(bucket, key) {
  // Retreive the Image Id from the S3 object metadata.
  const params = {
    "Bucket": bucket,
    "Key": key
  };

  var data = await s3.headObject(params).promise();
  var metadata = (!data) ? null : data.Metadata;

  return metadata;
}

async function sendToRekogniton(bucket, key, metadata) {

  const rekognitionParams = {
    "Image": {
        "S3Object": {
            "Bucket": bucket,
            "Name": key
        }
    },
    "Attributes": ["ALL"]
  };

  var response = await rekognition.detectFaces(rekognitionParams).promise();

  var dbKeyFields = {
    TableName: "Image-mqo2zfezgjbg7drqhy5lohttae-dev",
    Key: {
      "id": metadata['imageid']
    }
  };

  var params;

  if (response.FaceDetails && response.FaceDetails.length > 0) {
    const emotions = response.FaceDetails[0].Emotions;

    params = {
      ...dbKeyFields,
      UpdateExpression: "set detectedEmotion=:e, confidence=:c, faceDetails=:d",
      ExpressionAttributeValues:{
          ":e": emotions[0].Type.toLowerCase(),
          ":c": emotions[0].Confidence,
          ":d": response.FaceDetails
      }
    };
  } else {
    params = {
      ...dbKeyFields,
      UpdateExpression: "set detectedEmotion = :e",
      ExpressionAttributeValues:{
          ":e": 'fail'
      }
    };
  }

  const dbResponse = await dynDb.update(params).promise();

  console.info("update:", dbResponse);
}

// eslint-disable-next-line
exports.handler = async (event, context) => {
  console.log('Received S3 event:', JSON.stringify(event, null, 2));

  for (let i = 0; i < event.Records.length; i++) {
    const record = event.Records[i];

    // Get the S3 object from the event record.
    const bucket = record.s3.bucket.name; //eslint-disable-line
    const key = record.s3.object.key; //eslint-disable-line
    const metadata = await getMetadata(bucket, key);
    const etag = record.s3.object.eTag;
    const datetime = new Date().toISOString();

    const hashTableParams = {
      TableName: "image-hashes",
      Item: {
        id: etag,
        createdAt: datetime
      },
      ConditionExpression: "id <> :id",
      ExpressionAttributeValues: {
        ":id" : etag
      }
    };

    console.log('Checking image hash table');

    await dynDb.put(
      hashTableParams).promise()
      .then(async () => {
        console.log('sending to Rekognition');
        await sendToRekogniton(bucket, key, metadata);
      })
      .catch(async (err) => {
        console.log(err);

        const imageParams = {
          TableName: "Image-mqo2zfezgjbg7drqhy5lohttae-dev",
          Key: {
            "id": metadata['imageid']
          },
          UpdateExpression: "set detectedEmotion = :e",
          ExpressionAttributeValues: {
            ":e": 'duplicate'
          }
        };

        console.log('Flagging duplicate');
        await dynDb.update(imageParams).promise();
      });
  }

  context.done(null, 'Successfully processed S3 event, and processed image');
};
