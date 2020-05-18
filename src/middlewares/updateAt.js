const UserModel = require('../models/UserModel')


const updateAt = (req, res, next) => {
    if(req.path === '/user/login' || req.path === '/user/register' || req.path === '/user/verify'){
        return next()
    }
    UserModel.findOneAndUpdate({_id: req.user._id},
        {last_seen: new Date()}, ((err, user) => {
        })
        );
    next()
};

module.exports = updateAt;