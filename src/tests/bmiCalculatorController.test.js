const request = require("supertest");
const app = require("../../app.js");

//Tests related to BMICalculator controller
describe("BMI Calculator Controller", () => {

    it("should check when correct file name is passed.", async () => {
        var useLocalFile = true;
        var fileName = "test.json";
        var uploadToS3 = true;
        var response = await request(app)
        .post(`/api/calculateBMI`)
        .set("Content-Type", "application/json")
        .send({
          "useLocalFile" : useLocalFile,
          "file" : fileName,
          "uploadToS3" : uploadToS3
        });
        expect(response.statusCode).toBe(200);
        expect(typeof response.body).toBe("object");
        expect(response.body.success).toBe(1);
        expect(response.body.message).toEqual(
          expect.stringContaining("https")
        );
    });
    
    it("should check when incorrect file name is passed.", async () => {
        var useLocalFile = true;
        var fileName = "nosuchfile.json";
        var uploadToS3 = false;
        var response = await request(app)
        .post(`/api/calculateBMI`)
        .set("Content-Type", "application/json")
        .send({
          "useLocalFile" : useLocalFile,
          "file" : fileName,
          "uploadToS3" : uploadToS3
        });
        expect(response.statusCode).toBe(500);
        expect(typeof response.body).toBe("object");
        expect(response.body.success).toBe(0);
        expect(response.body.message).toEqual("Exception Occurred!");
    });

    it("should check when correct file name is passed and upload to S3 is False.", async () => {
      var useLocalFile = true;
      var fileName = "test.json";
      var uploadToS3 = false;
      var response = await request(app)
        .post(`/api/calculateBMI`)
        .set("Content-Type", "application/json")
        .send({
          "useLocalFile" : useLocalFile,
          "file" : fileName,
          "uploadToS3" : uploadToS3
      });
      expect(response.statusCode).toBe(200);
      expect(typeof response.body).toBe("object");
      expect(response.body.success).toBe(1);
      expect(response.body.message).toEqual(
        expect.stringContaining("_output_test.json")
      );
    });
});


