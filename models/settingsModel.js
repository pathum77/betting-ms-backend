const mongoose = require('mongoose');
const Schema = mongoose.Schema;

exports.drawType = mongoose.model('DrawType', new Schema({
    id: {
        type: String,
    },

    name: {
        type: String,
    },

}, { timestamps: true }));

exports.place = mongoose.model('Place', new Schema({
    id: {
        type: String,
    },

    name: {
        type: String,
    },

}, { timestamps: true }));