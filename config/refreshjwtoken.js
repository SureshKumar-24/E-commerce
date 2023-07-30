const jwt = require('jsonwebtoken');
require("dotenv").config();

const refreshToken = (payload) => {
    return jwt.sign({ payload }, process.env.REFRESH_TOKEN, { expiresIn: '365d' });
}

module.exports = { refreshToken };