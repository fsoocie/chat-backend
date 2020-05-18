const mongoose = require('mongoose');

const Message = mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    dialog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dialog',
        required: true
    },
    unread: {
        type:Boolean,
        default: false
    }
}, {timestamps: true});

module.exports = mongoose.model('Message', Message)