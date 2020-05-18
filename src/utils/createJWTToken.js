const jwt = require('jsonwebtoken');
const {reduce} = require('lodash');
require('dotenv').config();


const createJWTToken = (user) => {

    
    let token = jwt.sign(
        {data: reduce(user, (result, value, key) => {
            if (key !== 'password') {
                result[key]=value
            }
            return result
        },{})},
        process.env.SECRET_KEY || '',
        {
            expiresIn: '7 days',
            algorithm: 'HS256',
        });
    return token
};

module.exports = createJWTToken;