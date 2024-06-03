const mongoose = require('mongoose');
const Schema = mongoose.Schema;

exports.bet = mongoose.model('Bet', new Schema({

    date: {
        type: String,
    },

    drawDate: {
        type: String,
    },

    userId: {
        type: String,
    },

    drawTypeId: {
        type: String,
    },

    betData: {
        type: Object,
    }

}, { timestamps: true }));