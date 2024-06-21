const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
    date: Date,
    pts: Number,
    ast: Number,
    reb: Number,
    stl: Number,
    blk: Number,
    tov: Number,
    fg_pct: Number,
    ft_pct: Number,
    three_pt_pct: Number,
    min: Number
});

const dividendSchema = new mongoose.Schema({
    date: Date,
    amount: Number
});

const splitSchema = new mongoose.Schema({
    date: Date,
    factor: Number
});

const playerSchema = new mongoose.Schema({
    name: String,
    team: String,
    position: String,
    stats: [statSchema],
    stockPrice: Number,
    history: [{ date: Date, price: Number }],
    dividends: [dividendSchema],
    splits: [splitSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Player', playerSchema);
