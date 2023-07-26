const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require("dotenv").config();
require('./Helpers/init_mongodb');
const Register = require('./Routes/user_route');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/Auth', Register);

app.listen(process.env.PORT || 3000, () => {
    console.log("Backend Server is running!");
});