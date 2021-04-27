'use strict'

const globals = require('../config/globals');
const bmiCalculatorService = require("../services/bmiCalculatorService.js").BMICalculatorService;
const readWriteJSONService = require("../services/readWriteJSONService.js").ReadWriteJSONService;

//Controller to calculate the BMI.
module.exports.BMICalculatorController = class BMICalculatorController {
    
    async calculateBMI(req,res)
    {
        try
        {
            var body = req.body;
            var useLocalFile = body.useLocalFile;
            var file = body.file;
            var uploadToS3 = body.uploadToS3;
            
            var readWriteObj = new readWriteJSONService();
            var bmiObj = new bmiCalculatorService();
            var fileName;
            //Flag to check if input file is present locally.
            if(useLocalFile)
            {
                fileName = file;
            }
            else
            {
                //Else download life from s3.
                fileName = await readWriteObj.downloadFromS3(file);
            }
            //Parse the data and calculate the BMI.
            var jsonData = await bmiObj.parseFile(fileName);
            //Write the output to a file.
            var outputFilePath = await readWriteObj.writeOutputToFile(jsonData,file);
            //Flag to check whether the output file has to be uploaded on s3
            if(uploadToS3)
            {
                var s3URL = await readWriteObj.writeToS3(outputFilePath,file);
                res.status(200).send({
                    success: 1,
                    message : s3URL
                });
                
            }
            else
            {
                res.status(200).send({
                    success: 1,
                    message : outputFilePath
                });
            }
        }
        catch(e)
        {
            res.status(500).send({
                success: 0,
                message : globals.GENERAL_EXCEPTION
            });
        }
    }

};