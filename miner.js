// miner.js
const express = require('express');
const axios = require('axios');
const { Block } = require('./blockchain.js');

const app = express();
const port = 4000;

app.use(express.json());

// This is where the miner receives proposed blocks
app.post('/receive-proposal', async (req, res) => {
    const { timestamp, data, previousHash } = req.body;

    if (!timestamp || !data || !previousHash) {
        return res.status(400).send('❌ Missing required block fields.');
    }

    console.log('⛏️ Received block proposal:');
    console.log({ timestamp, data, previousHash });

    // Simulate "mining" by calculating hash (no real Proof of Work here)


    res.send({
        message: 'Block received by miner at 4000.',
        
    });
});

app.listen(port, () => {
    console.log(`⛏️ Miner listening at http://localhost:${port}`);
});
