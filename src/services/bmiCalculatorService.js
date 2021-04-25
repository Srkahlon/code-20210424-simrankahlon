'use strict'
const globals = require('../config/globals');
const fs = require('fs');
const  JSONStream = require('JSONStream');
require('dotenv').config();

module.exports.BMICalculatorService = class BMICalculatorService {
    
    //Parse the Input File and calculate the BMI
    async parseFile(fileName)
    {
        try
        {
            //Check if given file exists.
            var checkIfFileExists = this.checkFile(fileName);
            var data = await this.readFile(fileName);
            return data;
        }
        catch(e)
        {
            throw new Error();
        }
    }

    //Function to read the file data
    async readFile(fileName)
    {
        return new Promise(function(resolve,reject){
            var fetchData = [];
            var overWeightCount = 0;
            var bmiService = new BMICalculatorService();
            var bmi;
            var bmiCategoryAndRisk;
            fs.createReadStream(fileName,{flags: 'r', encoding: 'utf-8'})
                .pipe(JSONStream.parse('*'))
                .on('data', (row) => {
                    //Calculate BMI of each data row
                    bmi = bmiService.calculateBMI(row.HeightCm,row.WeightKg);
                    //Find Category and Risk basis on BMI
                    bmiCategoryAndRisk = bmiService.checkBMICategoryAndHealthRisk(bmi);
                    row["BMI"] = bmi;
                    row["BMI_Category"] = bmiCategoryAndRisk["category"];
                    row["BMI_Health_Risk"] = bmiCategoryAndRisk["risk"];
                    //If overweight, increse the overweight count by 1.
                    if(globals.OverWeight_Category.includes(row["BMI_Category"]))
                    {
                        overWeightCount++;
                    }
                    fetchData.push(row);
                })
                .on('end', () => {
                    //Format the response
                    var response = {
                        "Overweight_Count" : overWeightCount,
                        "BMI_Details" : fetchData
                    }
                    resolve(response);
                })
                .on('error', reject);
        })
    }

    //Function to calculate the BMI
    calculateBMI(height,weight)
    {
        try
        {
            var heightInM = parseFloat(height)/100;
            var bmi = parseFloat(weight)/(heightInM*heightInM);
            bmi = this.round(bmi,2);
            return bmi;
        }
        catch(e)
        {
            throw new Error();
        }
    }

    round(value, decimals) {
        try
        {
            return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
        }
        catch(e)
        {
            throw new Error();
        }
    }

    //Function to get the category and health risk
    checkBMICategoryAndHealthRisk(bmi)
    {
        try
        {
            if(bmi <= 18.49)
            {
                return globals.case1;
            }
            else if(bmi >= 18.5 && bmi <= 24.99)
            {
                return globals.case2;
            }
            else if(bmi >= 25 && bmi <= 29.99)
            {
                return globals.case3;
            }
            else if(bmi >= 30 && bmi <= 34.99)
            {
                return globals.case4;
            }
            else if(bmi >= 35 && bmi <= 39.99)
            {
                return globals.case5;
            }
            else
            {
                return globals.case6;
            }
        }
        catch(e)
        {
            throw new Error();
        }
    }

    //Check if file exists, at the given location.
    checkFile(location)
	{
        if(!location || !fs.existsSync(location))
		{
			throw new Error();
		}
		else
		{
			return location;
		}
	}
};