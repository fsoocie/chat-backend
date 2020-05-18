const mongoose = require('mongoose');

const Dialog = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    last_message: {
        type: String,
        ref: 'Message'
    }
}, {timestamps: true});

module.exports = mongoose.model('Dialog', Dialog);