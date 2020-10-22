const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});
const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();
const dynDb = new AWS.DynamoDB.DocumentClient();

// eslint-disable-next-line
exports.handler = async (event, context) => {
  console.log('Received S3 event:', JSON.stringify(event, null, 2));
  for (let i = 0; i < event.Records.length; i++) {
    const record = event.Records[i];

    // Get the S3 object from the event record.
    const bucket = record.s3.bucket.name; //eslint-disable-line
    const key = record.s3.object.key; //eslint-disable-line

    // Retreive the Image Id from the S3 object metadata.
    const s3MetadataParams = {
      "Bucket": bucket,
      "Key": key
    }

    var data = await s3.headObject(s3MetadataParams).promise();
    var metadata = (!data) ? null : data.Metadata;

    if (metadata) {
      const rekognitionParams = {
        "Image": {
            "S3Object": {
                "Bucket": bucket,
                "Name": key
            }
        },
        "Attributes": ["ALL"]
      }

      var response = await rekognition.detectFaces(rekognitionParams).promise();

      var dbKeyFields = {
        TableName: "Image-mqo2zfezgjbg7drqhy5lohttae-dev",
        Key: {
          "id": metadata['imageid']
        }
      };

      var dbParams;

      if (response.FaceDetails && response.FaceDetails.length > 0) {
        const emotions = response.FaceDetails[0].Emotions;

        dbParams = {
          ...dbKeyFields,
          UpdateExpression: "set detectedEmotion=:e, confidence=:c, faceDetails=:d",
          ExpressionAttributeValues:{
              ":e": emotions[0].Type.toLowerCase(),
              ":c": emotions[0].Confidence,
              ":d": response.FaceDetails
          },
          ReturnValues:"UPDATED_NEW"
        };
      } else {
        dbParams = {
          ...dbKeyFields,
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
  }
};
