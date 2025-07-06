const express =require('express');
const { BlockchainNode, Block } = require('./blockchain.js');
const app = express();
const port = 5000;
const MINER_NODES = [
    'http://localhost:4000' // Add more if you want
];
const BlockChain = new BlockchainNode();


class State{
  data = 10; // initial state variable

  // State Function
  executeFunction(block){
   this.data = block.data
  }
}

let st = new State();



// API for receiving data and creating blocks
app.post('/sendBlockData', async (req, res) => {
    const { data } = req.body;

    if (!data) {
        return res.status(400).send('Error: A proposed block must have data.');
    }

    
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


// API for receiving data by miner
app.post('/receive-proposal', async (req, res) => {
    const { timestamp, data, previousHash } = req.body;

    if (!timestamp || !data || !previousHash) {
        return res.status(400).send('❌ Missing required block fields.');
    }

    console.log('⛏️ Received block proposal:');
    console.log({ timestamp, data, previousHash });
    const previousblockhash = BlockChain.getLatestBlock().hash;
    
    // verifying 
    if(previousblockhash === previousHash){
      console.log('Block verified');
      // creating the block
      const newBlock = new Block(timestamp, data, previousHash);
      BlockChain.chain.push(newBlock);
      st.executeFunction(newBlock);
    }

    res.send({
        message: 'Block received by miner at 4000.',
        
    });
});

















app.listen(port, () => {
    console.log(`Blockchain node listening at http://localhost:${port}`);
    console.log('Use POST /propose-block to submit a block proposal.');
    console.log('Use GET /node-state to view the current state.');
});