const express = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Player = require('../models/Player');
const router = express.Router();

router.post('/buy', async (req, res) => {
    const { userId, playerId, shares } = req.body;
    try {
        const player = await Player.findById(playerId);
        const user = await User.findById(userId);
        const price = player.stockPrice;

        const transaction = new Transaction({ user: userId, player: playerId, shares, price, type: 'buy' });
        await transaction.save();

        const portfolioEntry = user.portfolio.find(entry => entry.player.toString() === playerId);
        if (portfolioEntry) {
            portfolioEntry.shares += shares;
        } else {
            user.portfolio.push({ player: playerId, shares });
        }
        await user.save();

        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/sell', async (req, res) => {
    const { userId, playerId, shares } = req.body;
    try {
        const player = await Player.findById(playerId);
        const user = await User.findById(userId);
        const price = player.stockPrice;

        const portfolioEntry = user.portfolio.find(entry => entry.player.toString() === playerId);
        if (!portfolioEntry || portfolioEntry.shares < shares) {
            return res.status(400).json({ message: 'Not enough shares to sell' });
        }

        const transaction = new Transaction({ user: userId, player: playerId, shares, price, type: 'sell' });
        await transaction.save();

        portfolioEntry.shares -= shares;
        if (portfolioEntry.shares === 0) {
            user.portfolio = user.portfolio.filter(entry => entry.player.toString() !== playerId);
        }
        await user.save();

        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/dividend', async (req, res) => {
    const { playerId, amount } = req.body;
    try {
        const player = await Player.findById(playerId);
        player.dividends.push({ date: new Date(), amount });
        await player.save();
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/split', async (req, res) => {
    const { playerId, factor } = req.body;
    try {
        const player = await Player.findById(playerId);
        player.splits.push({ date: new Date(), factor });
        player.stockPrice /= factor;
        await player.save();
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
