'use strict'
const Joi = require('joi');

module.exports.BMICalculatorMiddleware = class BMICalculatorMiddleware
{
    //Check if required fields are present
    async validateRequest(req,res,next) {
        var body = req.body;
        //Validation of the incoming request body
        const bmiSchema = Joi.object().keys({ 
            useLocalFile: Joi.boolean().required().label("Use Local File"),
            file: Joi.string().required().label("File Name"),
            uploadToS3: Joi.boolean().required().label("Upload to S3")
        });
        const result = bmiSchema.validate(body);
        if(result.hasOwnProperty("error"))
        {
            //Validation exception
            res.status(422).send(result);
        }
        else
        {
            next();
        }
    }
}