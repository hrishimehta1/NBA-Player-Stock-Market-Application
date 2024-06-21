const express = require('express');
const { updatePlayerData } = require('../services/playerService');
const Player = require('../models/Player');
const router = express.Router();

router.post('/update', async (req, res) => {
    const { playerName } = req.body;
    try {
        const player = await updatePlayerData(playerName);
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/players', async (req, res) => {
    try {
        const players = await Player.find();
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/players/:id', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
