const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});
const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();

// eslint-disable-next-line
exports.handler = async (event, context) => {
  console.log('Received S3 event:', JSON.stringify(event, null, 2));
  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name; //eslint-disable-line
  const key = event.Records[0].s3.object.key; //eslint-disable-line
  console.log(`Bucket: ${bucket}`, `Key: ${key}`);

  const params = {
    "Image": {
        "S3Object": {
            "Bucket": bucket,
            "Name": key
        }
    },
    "Attributes": ["ALL"]
  }

  console.log("About to call detectFaces:", params);
  try {
    console.log("Rekognition client:", rekognition)
    var response = await rekognition.detectFaces(params).promise();

    var keys = [{ Key: "Faces", Value: `${response.FaceDetails.length}` }];

    if (response.FaceDetails.length > 0) {
      const emotions = response.FaceDetails[0].Emotions;

      keys.push({ Key: "Emotions", Value: `${emotions.length}` });

      if (emotions.length > 0) {
        keys.push({ Key: "Emotion", Value: emotions[0].Type });
        keys.push({ Key: "Confidence", Value: `${emotions[0].Confidence}` });
      }
    }

    console.info("Tagged object with:", keys);

    const imageParams = {
        Bucket: bucket,
        Key: key,
        Tagging: {
          TagSet: keys
        }
      };

    await s3.putObjectTagging(imageParams).promise();

    context.done(null, 'Successfully processed S3 event, and tagged source'); // SUCCESS with message
  }
  catch (error) {
    console.error(error);
  }
  finally {
    context.done(null, 'Finished processing S3 event');
  }
};
