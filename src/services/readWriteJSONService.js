'use strict'
const AWS = require('aws-sdk');
const fs = require('fs');
const promises = fs.promises;
require('dotenv').config();
AWS.config.update({
    accessKeyId: process.env.ACCESSKEY,
    secretAccessKey: process.env.SECRET,
    region: process.env.REGION 
});
const s3 = new AWS.S3();

//Service class that has File read write functions
module.exports.ReadWriteJSONService = class ReadWriteJSONService {

    //Function to download the file from s3
    async downloadFromS3(file)
    {
        try
        {
            const params = {
                Bucket: process.env.INPUT_BUCKET,
                Key: file,
            }
            const { Body } = await s3.getObject(params).promise();
            var fileName = __basedir + process.env.FILE_LOCATION + ((new Date).getTime()).toString() +"_input_" + params.Key;
            await this.writeFile(fileName,Body,'utf8');
            return fileName;
        }
        catch(e)
        {
            throw new Error();
        }
    }

    //Function that writes to a file, when given filename and data.
    async writeFile(fileName,data,encoding)
    {
        try
        {
            await promises.writeFile(fileName, data,encoding);
        }
        catch(e)
        {
            throw new Error();
        }
    }

    //Write the BMI Output to a file.
    async writeOutputToFile(jsonData,file)
    {
        try
        {
            var fileName = __basedir + process.env.FILE_LOCATION + ((new Date).getTime()).toString() +"_output_" + file;
            await this.writeFile(fileName,JSON.stringify(jsonData),'utf8');
            return fileName;
        }
        catch(e)
        {
            throw new Error();
        }
    }

    //Write the output file to s3 and return the public URL.
    async writeToS3(fileName,fileKey)
    {
        try
        {
            let params = {
                Bucket: process.env.OUTPUT_BUCKET,
                Key: fileKey,
                Body: fs.createReadStream(fileName),
                ACL: 'public-read'
            };
            var response = await new AWS.S3().upload(params).promise();
            return response.Location;
        }
        catch(e)
        {
            throw new Error();
        }
    }

};