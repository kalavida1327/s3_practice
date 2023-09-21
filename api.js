const AWS = require('aws-sdk');
const { Console } = require('console');
const parseMultipart = require('parse-multipart');

const BUCKET = 'serverless-s4-bucket';

const s3 = new AWS.S3();


function extractFile(event) {
  const boundary = parseMultipart.getBoundary(event.headers['content-type']);
  const parts = parseMultipart.Parse(
    Buffer.from(event.body, 'base64'),
    boundary
  );
  console.log('--------parts', parts);
  const [{ filename, data }] = parts;

  return {
    filename,
    data,
  };
}
module.exports.handle = async (event) => {
  try {
    const { filename, data } = extractFile(event);
    console.log('---------data', data);
    await s3
      .putObject({
        Bucket: BUCKET,
        Key: filename,
        ACL: 'public-read',
        Body: data,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        link: `https://${BUCKET}.s3.amazonaws.com/${filename}`,
      }),
    };
  } catch (err) {
    console.log('error-----', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.stack }),
    };
  }
};


