'use strict'
require('dotenv').config();

const app = require("./app.js");

const port = process.env.PORT || 8080;
app.listen(port);
console.log(`🚀 app listening on port ${port}`);
       