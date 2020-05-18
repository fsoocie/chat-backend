const verifyJWTToken = require('../utils/verifyJWTToken');

const checkAuth = (req, res, next) => {
    if(req.path === '/user/login' || req.path === '/user/register' || req.path === '/user/verify'){
        return next()
    }
    verifyJWTToken(req.headers.token).then(user => {
        req.user = user.data._doc;
        next()
    }).catch(err => {
        res.json({message: 'Invalid token'})
    });

};

module.exports = checkAuth;