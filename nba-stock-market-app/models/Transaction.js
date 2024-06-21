const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    shares: Number,
    price: Number,
    type: { type: String, enum: ['buy', 'sell'] },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
