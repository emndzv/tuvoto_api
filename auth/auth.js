const jwt = require("jwt-simple");
const dotenv = require("dotenv");

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

exports.encode = (payload) => {
  return jwt.encode(payload, jwtSecret);
};

exports.decode = (token) => {
  return jwt.decode(token, jwtSecret);
};