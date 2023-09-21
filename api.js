const multipart = require('aws-lambda-multipart-parser');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const queryString = require('querystring'); // Import the queryString module

const BUCKET_NAME = 'serverless-s4-bucket';

const APIGatewayProxyHandler = async (event) => {
  try {
    console.log('--------Received event:', JSON.stringify(event, null, 2));
if ( event.body) {
  // Decode the base64 body if needed
  const decodedBody = Buffer.from(event.body, 'base64').toString('utf-8');
  console.log('Decoded body:', decodedBody);
}

const formData = multipart.parse(decodedBody);

console.log('----------Parsed formData:', formData);

    // Access the uploaded file and other fields from the formData object
    const { fields, files } = formData; // Use 'fields' and 'files' instead of 'file'
    const tags = { filename: fields.filename }; // Use 'fields.filename'

    await s3
      .putObject({
        Bucket: BUCKET_NAME,
        Key: fields.filename,
        Body: Buffer.from(files.content, 'base64'), // Convert content to a buffer
        Tagging: queryString.encode(tags),
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ description: 'file created', result: 'ok' }),
    };

  } catch (error) {
    // Handle errors
    console.error("------error---------",error);
    return {
      statusCode: 409,
      body: JSON.stringify({
        description: 'something went wrong',
        result: 'error',
      }),
    };
  }
};

module.exports = {
  APIGatewayProxyHandler,
};
