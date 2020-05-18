const bcrypt = require('bcrypt');

const hashingPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) reject(err);
            resolve(hash)
        })
    })
};

module.exports = hashingPassword;