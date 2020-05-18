const mongoose = require('mongoose');
const validator = require('validator');
const hashingPassword = require('../utils/hashingPassword');

const User = mongoose.Schema({
   email: {
      type: String,
      required: 'email is required',
      validate: [ validator.isEmail, 'invalid email' ],
      unique: true
   },
   fullname: {
      type: String,
      required: 'fullname is required'
   },
   password: {
      type: String,
      required: 'password is required'
   },
   confirm: {
      type: Boolean,
      default: false
   },
   avatar: String,
   confirm_hash: String,
   last_seen: {
      type: Date,
      default: new Date()
   }
}, {timestamps: true});

User.pre('save', function (next) {
   if (!this.isModified('password')) return next;

   hashingPassword(this.password).then(password => {
      this.password = String(password);
      next()
   })
       .catch(err => {
          next(err)
       })
});


User.path('email').validate(async (value) => {
   const emailCount = await mongoose.models.User.countDocuments({email: value });
   return !emailCount;
}, 'Email already exists');

module.exports = mongoose.model('User', User);