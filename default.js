require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
    if (token) {
      try {
        return jwt.verify(token, process.env.SECRET );
      } catch (err) {
        // if there's a problem with the token, return error
        return { error: true, msg: "Session invalid" };
      }
    }
};

module.exports = { verifyToken }