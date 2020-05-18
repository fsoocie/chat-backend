const DialogModel = require('../models/DialogModel');
const MessageModel = require('../models/MessageModel')

const DialogController = class {

  constructor(io) {
    this.io = io
  }

  index = (req, res) => {
    const authorId = req.user._id;
    DialogModel.find({"author": authorId})
      .populate(["author", "partner"])
      .exec((err, arr) => {
        if (err) {
          return res.status(404).json({message: 'Dialogs not found'})
        }
        res.json(arr)
      })
  };
  create = (req, res) => {
    const PostData = {
      author: req.user._id,
      partner: req.body.partner,
      last_message: req.body.text
    };
    const dialog = new DialogModel(PostData);
    dialog.save()
      .then(dialogObj => {
        const message = new MessageModel({
          dialog: dialogObj._id,
          user: req.user._id,
          text: req.body.text
        });
        message.save()
          .then(messageObj => {
            res.json(dialogObj);
            this.io.emit('SERVER:ADD_NEW_DIALOG');
          })
          .catch(e => res.json(e))

      })
      .catch(e => res.json(e))
  };
  delete = (req, res) => {
    const dialogId = req.params.id;
    DialogModel.findOneAndDelete({'_id': dialogId}, (err, dialog) => {
      if (err) {
        return res.status(404).json({message: 'Dialog not found'})
      }
      res.json(dialog)
    })
  }
};

module.exports = DialogController;