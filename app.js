const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require("dotenv").config();
require('./Helpers/init_mongodb');
const path = require('path');
const cookieParser = require('cookie-parser');
const Register = require('./Routes/user_route');
const Admin = require('./Routes/admin_route');
const Product = require('./Routes/product_route');
const Blog = require('./Routes/blog_route');
const morgan = require('morgan');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(Register);
app.use(Admin);
app.use(Product);
app.use(Blog);
app.use(cookieParser());
app.use(morgan('dev'));

app.listen(process.env.PORT || 3000, () => {
    console.log("Backend Server is running!");
});