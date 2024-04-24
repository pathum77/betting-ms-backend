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

    amount: {
        type: Number,
    },

    numbers: {
        type: String,
    }

}, { timestamps: true }));