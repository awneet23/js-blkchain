const sha256 = require('js-sha256');

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
        this.hash = null; 
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