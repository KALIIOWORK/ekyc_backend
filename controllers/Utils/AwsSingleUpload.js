const AWS = require('aws-sdk');
const awsConfig = require('../../config/aws-s3');


module.exports = {

    upload: async (file, fileName) => {
        console.log(file)
        console.log(fileName)
        console.log(process.env.BUCKET_NAME)

        const s3 = new AWS.S3(awsConfig);

        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileName,
            Body: file,
            //ACL: 'public-read'
        }
        const result = await s3.upload(params).promise();
        return result.Location;
    }
}