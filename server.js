const express = require('express');
// We need both classes now
const { BlockchainNode, Block } = require('./blockchain.js');
const axios = require('axios');


const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Create a SINGLE instance of our node's state ---
const myNode = new BlockchainNode();
// -------------------------------------
// ---------------
const MINER_NODES = [
    'http://localhost:4000' // Add more if you want
];


// Endpoint to view the current state of our node (chain + pending blocks)
app.get('/node-state', (req, res) => {
    res.json(myNode);
});


/**
 * THE BLOCK PROPOSAL API
 * A client constructs a block (without a hash) and proposes it to our node.
 */
app.post('/propose-block', async (req, res) => {
    const { data } = req.body;

    if (!data) {
        return res.status(400).send('Error: A proposed block must have data.');
    }

    // Auto-generate current timestamp (in milliseconds)
    const timestamp = Date.now();

    // Get previous hash from latest block
    const latestBlock = myNode.getLatestBlock();
    const previousHash = latestBlock.hash;

    // Create a new Block
    const proposedBlock = new Block(timestamp, data, previousHash);

    // Add block to pending pool
    myNode.addProposedBlock(proposedBlock);
    for (let minerURL of MINER_NODES) {
    try {
        const response = await axios.post(`${minerURL}/receive-proposal`, proposedBlock);
        console.log(`✅ Sent to miner at ${minerURL}:`, response.data.message);
    } catch (err) {
        console.error(`❌ Failed to send to miner at ${minerURL}:`, err.message);
    }
}

    res.status(201).send({
        message: 'Block proposed successfully. Timestamp was generated automatically.',
        proposedBlock: proposedBlock
    });

});



app.listen(port, () => {
    console.log(`Blockchain node listening at http://localhost:${port}`);
    console.log('Use POST /propose-block to submit a block proposal.');
    console.log('Use GET /node-state to view the current state.');
});