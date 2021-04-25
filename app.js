const express = require("express");
const bodyParser = require("body-parser");
const app = express();
global.__basedir = __dirname;

app.use(bodyParser.json());

require('./src/routes/apiRoutes.js')(app);

module.exports = app;