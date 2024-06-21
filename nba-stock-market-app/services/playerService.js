const axios = require('axios');
const Player = require('../models/Player');
const tf = require('@tensorflow/tfjs-node');

async function fetchPlayerStats(playerName) {
    const apiUrl = `https://www.balldontlie.io/api/v1/players?search=${playerName}`;
    const response = await axios.get(apiUrl);
    const playerData = response.data.data[0];
    const statsUrl = `https://www.balldontlie.io/api/v1/stats?player_ids[]=${playerData.id}`;
    const statsResponse = await axios.get(statsUrl);
    const playerStats = statsResponse.data.data;

    return { playerData, playerStats };
}

function preprocessData(stats) {
    const inputs = [];
    const labels = [];
    for (let i = 0; i < stats.length - 1; i++) {
        inputs.push([stats[i].pts, stats[i].ast, stats[i].reb, stats[i].stl, stats[i].blk]);
        labels.push(stats[i + 1].pts);
    }
    return { inputs: tf.tensor2d(inputs), labels: tf.tensor2d(labels, [labels.length, 1]) };
}

async function trainModel(inputs, labels) {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [5] }));
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

    await model.fit(inputs, labels, { epochs: 100 });
    return model;
}

function calculateStockPrice(predictedPerformance) {
    return predictedPerformance * 0.3; // Simplified for brevity
}

async function updatePlayerData(playerName) {
    const { playerData, playerStats } = await fetchPlayerStats(playerName);
    const { inputs, labels } = preprocessData(playerStats);
    const model = await trainModel(inputs, labels);
    const predictedPerformance = model.predict(inputs.slice([-1]));
    const stockPrice = calculateStockPrice(predictedPerformance.dataSync()[0]);

    const player = await Player.findOneAndUpdate(
        { name: playerData.first_name + ' ' + playerData.last_name },
        {
            name: playerData.first_name + ' ' + playerData.last_name,
            team: playerData.team.full_name,
            position: playerData.position,
            stats: playerStats,
            stockPrice,
            $push: { history: { date: new Date(), price: stockPrice } }
        },
        { new: true, upsert: true }
    );
    return player;
}

module.exports = { fetchPlayerStats, updatePlayerData };
