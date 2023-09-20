const multipart = require('aws-lambda-multipart-parser');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const BUCKET_NAME = 'your-s3-bucket-name';

const APIGatewayProxyHandler = async (event) => {
  try {
    const formData = multipart.parse(event, true); // Set the second argument to true to parse JSON fields

    // Access the uploaded file and other fields from the formData object
    const { file, fields } = formData;
    const tags = { filename: file?.filename };

    await s3
      .putObject({
        Bucket: BUCKET_NAME,
        Key: fields.filename || file.filename,
        Body: Buffer.from(file.content, 'base64'), // Convert content to a buffer
        Tagging: queryString.encode(tags),
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ description: 'file created', result: 'ok' }),
    };
  } catch (error) {
    // Handle errors
    console.error(error);
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
