const bmiController = require("../controllers/bmiCalculatorController.js").BMICalculatorController;
const bmiMiddleware = require("../middleware/bmiCalculatorMiddleware.js").BMICalculatorMiddleware;

module.exports = (app) => {
    var bmiControllerObj = new bmiController();
    var bmiMiddlewareObj = new bmiMiddleware();
    
    //To get the museum visitors basis on date.
    app.post(`/api/calculateBMI/`,
        bmiMiddlewareObj.validateRequest,
        bmiControllerObj.calculateBMI,
    );
};