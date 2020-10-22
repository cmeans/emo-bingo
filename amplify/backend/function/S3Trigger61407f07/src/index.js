const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});
const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();
const dynDb = new AWS.DynamoDB.DocumentClient();

// eslint-disable-next-line
exports.handler = async (event, context) => {
  console.log('Received S3 event:', JSON.stringify(event, null, 2));
  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name; //eslint-disable-line
  const key = event.Records[0].s3.object.key; //eslint-disable-line
  // console.log(`Bucket: ${bucket}`, `Key: ${key}`);

  const params = {
    "Image": {
        "S3Object": {
            "Bucket": bucket,
            "Name": key
        }
    },
    "Attributes": ["ALL"]
  }

  const mdParams = {
    "Bucket": bucket,
    "Key": key
  }

  // console.log('About to retreive S3 image metadata:');

  var data = await s3.headObject(mdParams).promise();
  var metadata = (!data) ? null : data.Metadata;
  // console.log('Metadata:', metadata);

  // console.log("About to call detectFaces:", params);
  try {
    // console.log("Rekognition client:", rekognition)
    var response = await rekognition.detectFaces(params).promise();

    // var keys = [{ Key: "Faces", Value: `${response.FaceDetails.length}` }];

    var dbParams;

    if (response.FaceDetails.length > 0) {
      // console.log("FaceDetails:", response.FaceDetails);

      const emotions = response.FaceDetails[0].Emotions;

      // keys.push({ Key: "Emotions", Value: `${emotions.length}` });

      // console.log("Emotions:", emotions);

      // if (emotions.length > 0) {
      //   keys.push({ Key: "Emotion", Value: emotions[0].Type });
      //   keys.push({ Key: "Confidence", Value: `${emotions[0].Confidence}` });
      // }
      dbParams = {
        TableName: "Image-mqo2zfezgjbg7drqhy5lohttae-dev",
        Key:{
            "id": metadata['imageid']
        },
        UpdateExpression: "set detectedEmotion=:e, confidence=:c, faceDetails=:d",
        ExpressionAttributeValues:{
            ":e": emotions[0].Type,
            ":c": emotions[0].Confidence,
            ":d": response.FaceDetails
        },
        ReturnValues:"UPDATED_NEW"
      };
    } else {
      dbParams = {
        TableName: "Image-mqo2zfezgjbg7drqhy5lohttae-dev",
        Key:{
            "id": metadata['imageid']
        },
        UpdateExpression: "set detectedEmotion = :e",
        ExpressionAttributeValues:{
            ":e": 'fail'
        },
        ReturnValues:"UPDATED_NEW"
      };
    }

    const dbResponse = await dynDb.update(dbParams).promise();

    console.info("dbUpdate:", dbResponse);

    context.done(null, 'Successfully processed S3 event, and tagged source'); // SUCCESS with message
  }
  catch (error) {
    console.error(error);
  }
  finally {
    context.done(null, 'Finished processing S3 event');
  }
};
