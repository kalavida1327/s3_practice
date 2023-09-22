// 

const AWS = require('aws-sdk');

const BUCKET = 'serverless-s4-bucket'; // Replace with your S3 bucket name
const s3 = new AWS.S3();

module.exports.handle = async (event) => {
  try {
    // Extract the filename from the query parameters
    const { filename } = event.queryStringParameters;

    // Specify the S3 getObject parameters
    const params = {
      Bucket: BUCKET,
      Key: filename,
    };

    // Retrieve the object from S3
    const { Body } = await s3.getObject(params).promise();

    // Convert the document to base64 encoding
    const documentBase64 = Body.toString('base64');

    // Set appropriate response headers
    const responseHeaders = {
      'Content-Type': 'application/octet-stream', // Change the content type as needed
      'Content-Disposition': `attachment; filename="${filename}"`,
    };

    return {
      statusCode: 200,
      headers: responseHeaders,
      isBase64Encoded: true,
      body: documentBase64,
    };
  } catch (err) {
    console.error('Error:', err);

    // Handle errors appropriately
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};
