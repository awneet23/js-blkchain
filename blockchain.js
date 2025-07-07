const sha256 = require('js-sha256');
const axios = require('axios');

/**
* Defines the structure of a block.
* Notice the hash is null initially. It must be calculated by a miner/validator.
*/
class Block {
  constructor(timestamp, data, previousHash = '') {
    this.timestamp = timestamp;
    this.data = data; // The arbitrary data for this block.
    this.previousHash = previousHash;
    
    // The hash is the cryptographic fingerprint of the block.
    // It will be calculated and set during the mining/validation phase.
    this.hash = this.calculateHash(); 
  }
  
  // A helper method to calculate the hash. This will be used by validators.
  calculateHash() {
    return sha256(this.previousHash + this.timestamp + JSON.stringify(this.data));
  }
}

/**
* Represents the state of a single blockchain node.
* It manages the confirmed chain and a list of proposed blocks waiting for validation.
*/
class BlockchainNode {
  constructor() {
    // The confirmed, final chain. Starts with the Genesis Block.
    const genesisBlock = new Block(0, "Genesis Block", "0");
    genesisBlock.hash = genesisBlock.calculateHash(); // Genesis hash is known.
    this.chain = [genesisBlock];
    
    // A pool of blocks that have been proposed but not yet validated and added to the chain.
    this.pendingBlocks = [];
  }
  
  // Function to check whether a chainis valid.
  isValidChain(chain){
    if(JSON.stringify(chain[0])!==JSON.stringify(chain[0])){
      console.log("❌ Invalid: Genesis block does not match.");
      return false;
    }
    for(let i= 1; i < chain.length; i++){
      const currentBlock = chain[i];
      const previousBlock = chain[i-1];
      if(previousBlock.hash!==previousBlock.calculateHash()){
        console.error(`❌ Invalid: Hash of block ${i-1} is incorrect.`);
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        console.error(`❌ Invalid: Chain link broken at block ${i}.`);
        return false;
      }
    }
    return true;
    
  }
  
  // Function to resolve conflicts
  
  async resolveConflicts(nodes){
    let longestChain = null;
    let maxLength = this.chain.length;
    
    for(const nodeUrl of nodes){
      try{
        const response = await axios.get(`${nodeUrl}/chain`);
        const otherNodeChain = response.data.chain;
        const otherNodeChainLength = response.data.length;
      }
      catch (error) {
                console.error(`Could not connect to node at ${nodeUrl}: ${error.message}`);
            }
    }
    if (longestChain) {
            this.chain = longestChain;
            console.log(" Chain was replaced with the longest valid chain from the network.");
            return true;
        }

        console.log(" Current chain is longest, No replacement needed.");
        return false;


  }
  
  /**
  * Adds a proposed block to the list of pending blocks.
  * @param {Block} proposedBlock - The block proposed by a user or another node.
  */
  addProposedBlock(proposedBlock) {
    // In a real system, you might do a very quick, basic sanity check here
    // before even adding it to the pending pool.
    this.pendingBlocks.push(proposedBlock);
    console.log('Block proposed and added to pending pool.');
  }
  
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
}

// Export the classes for our server to use.
module.exports = { BlockchainNode, Block };