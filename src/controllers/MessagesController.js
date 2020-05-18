const MessageModel = require('../models/MessageModel');
const DialogModel = require('../models/DialogModel');

const MessagesController = class {

    constructor(io) {
        this.io = io
    }

    index = (req, res) => {
        const dialogId = req.query.dialog;
        MessageModel.find({dialog: dialogId})
            .populate(["dialog", "user"])
            .exec((err, messages) => {
            if (err) {
                return res.status(404).json(err)
            }
            res.json(messages)
        })
    };
    create = (req,res) => {
        const userId = req.user._id;
        const PostData = {
            text: req.body.text,
            user: userId,
            dialog: req.body.dialog
        };
        const message = new MessageModel(PostData);
        message.save()
            .then(messageObj => {
                res.json(messageObj);
                DialogModel.findOneAndUpdate({_id: messageObj.dialog},
                  {last_message: messageObj.text}, (err, dialog) => {
                      if (err) {
                          return res.status(404).json({message: 'Dialog not found'})
                      }
                  })
                MessageModel.findOne({_id: messageObj._id})
                  .populate(['user'])
                  .exec((err, message) => {
                      if (err) {
                          return res.status(404).json({message: 'Message not found'})
                      }
                      this.io.emit('SERVER:NEW_MESSAGE', message)
                  })
            })
            .catch(err => res.json(err))
    };
    delete = (req,res) =>{
        const id = req.params.id;
        MessageModel.findOneAndDelete({_id: id}, (err, messageObj) =>{
            if (err) {
                return res.status(404).json({message: 'Message not found'})
            }
            res.json({message: 'Message success deleted '})
        })
    }
};

module.exports = MessagesController;