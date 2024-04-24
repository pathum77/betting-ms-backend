const mongoose = require('mongoose');
const Schema = mongoose.Schema;

exports.user = mongoose.model('User', new Schema({
    id: {
        type: String,
    },

    firstName: {
        type: String,
    },

    lastName: {
        type: String,
    },

    role: {
        type: String,
    },

    username: {
        type: String,
    },

    password: {
        type: String,
    },

}, { timestamps: true }));