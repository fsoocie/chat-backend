const UserModel = require('../models/UserModel');
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const createJWTToken = require('../utils/createJWTToken');

const UserController = class {

  constructor(io) {
    this.io = io
  }

  me = (req, res) => {
    const id = req.user._id;
    UserModel.findById(id, (err, user) => {
      if (err) {
        return res.status(404).json({message: 'User not found'})
      }
      res.json(user)
    })
  };
  index = (req, res) => {
    const id = req.params.id;
    UserModel.findById(id, (err, user) => {
      if (err) {
        return res.status(404).json({message: 'User not found'})
      }
      res.json(user)
    });
  };
  create = (req, res) => {
    const PostData = {
      email: req.body.email,
      fullname: req.body.fullname,
      password: req.body.password,
      confirm_hash: createJWTToken(req.body.email)
    };
    const user = new UserModel(PostData);
    user.save()
      .then(obj => {
        res.json({
          status: 'success',
          user: obj
        })
      })
      .catch(err => res.json({
        status: 'error',
        message: err
      }));
  };
  delete = (req, res) => {
    const id = req.params.id;
    UserModel.findOneAndDelete({"_id": id}, (err, user) => {
      if (err) {
        return res.status(404).json({message: 'User not found'})
      }
      res.json(user)
    })
  };
  verify = (req, res) => {
    const token = req.query.token;
    UserModel.findOne({confirm_hash: token, confirm: false}).exec((err, user) => {
      if (err || user === null) {
        return res.status(404).json(
          {
            status: 'error',
            message: 'Wrong verify-token or User already confirmed'
          })
      } else {
        UserModel.updateOne({confirm_hash: token}, {confirm: true}).then(() => {
          res.json({
            status: 'success',
            message: 'Пользователь подтвержден',
            data: user
          })
        })
          .catch(err => {
            throw err
          })

      }
    })
  };
  login = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()})
    }
    const PostData = {
      email: req.body.email,
      password: req.body.password,
    };
    UserModel.findOne({email: PostData.email}).exec((err, user) => {
        if (err || user === null) {
          return res.status(404).json(
            {
              status: 'error',
              message: 'Incorrect email or password'
            })
        }
        if (bcrypt.compareSync(PostData.password, user.password)) {
          const token = createJWTToken(user);
          res.json({
            status: 'success',
            token,
          });
        } else {
          res.json({
            status: 'error',
            message: 'Incorrect password or email',
          });
        }
      }
    )
  }
};


module.exports = UserController;