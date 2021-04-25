const bmiCalculatorService = require("../services/bmiCalculatorService.js").BMICalculatorService;

describe("BMI Calculator Service", () => {

    it("should check if correct BMI is calculated", () => {
        var bmiObj = new bmiCalculatorService();
        var height = 175;
        var weight = 75;
        var response = bmiObj.calculateBMI(height,weight);
        expect(response).toEqual(24.49);
    });

    it("should check if correct Category and Health risk is returned", () => {
        var bmiObj = new bmiCalculatorService();
        var bmi = 24.49;
        var response = bmiObj.checkBMICategoryAndHealthRisk(bmi);
        expect(typeof response).toBe("object");
        expect(response.category).toEqual("Normal weight");
        expect(response.risk).toEqual("Low risk");
    });
});


