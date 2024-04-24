const mongoose = require('mongoose');
const Schema = mongoose.Schema;

exports.draw = mongoose.model('Draw', new Schema({

    id: {
        type: String,
    },

    date: {
        type: String,
    },

    typeId: {
        type: String,
    },

    placeId: {
        type: String,
    },

    numbers: {
        type: String,
    }

}, { timestamps: true }));