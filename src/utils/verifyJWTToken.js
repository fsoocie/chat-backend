const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWTToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET_KEY, (err, user) =>{
      if (err || !user) {
        reject(err)
      }
      resolve(user)
    }
  )
})};

module.exports = verifyJWTToken;