// SmartSpoil Blockchain Logger (Node.js + Web3.js)
// Logs freshness scores to a smart contract on Ethereum-compatible blockchain

// Web3 v4 exposes the Web3 class as a named export
const { Web3 } = require('web3');
const express = require('express');

const app = express();
// Express has built-in JSON parsing support
app.use(express.json());

// Connect to Ethereum node (Infura, Alchemy, local Ganache, etc.)
// Provider URL can be configured via the PROVIDER_URL environment variable
const providerUrl = process.env.PROVIDER_URL || 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID';
const web3 = new Web3(providerUrl);

if (providerUrl.includes('YOUR_INFURA_PROJECT_ID')) {
    console.error('Please set PROVIDER_URL to a valid Ethereum RPC endpoint.');
    process.exit(1);
}

// Replace with your deployed smart contract address and ABI
const contractAddress = process.env.CONTRACT_ADDRESS || '0xYourSmartContractAddress';
const abi = [ /* ABI JSON goes here */ ];

const account = process.env.WALLET_ADDRESS || '0xYourWalletAddress'; // Must hold ETH and have access to private key
const privateKey = process.env.PRIVATE_KEY || 'your_private_key'; // Securely load from env file or secrets manager

if (contractAddress.startsWith('0xYour') || account.startsWith('0xYour') || privateKey === 'your_private_key') {
    console.error('Please configure CONTRACT_ADDRESS, WALLET_ADDRESS, and PRIVATE_KEY environment variables.');
    process.exit(1);
}

const freshnessContract = new web3.eth.Contract(abi, contractAddress);

// Endpoint to receive freshness data and log to chain
app.post('/log-freshness', async (req, res) => {
    const { freshness, temp, humidity, productId } = req.body;

    const encoded = freshnessContract.methods.logFreshness(productId, freshness, temp, humidity).encodeABI();

    const tx = {
        to: contractAddress,
        gas: 200000,
        data: encoded
    };

    try {
        const signed = await web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
        res.json({ status: 'Logged to blockchain', txHash: receipt.transactionHash });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Blockchain logging failed' });
    }
});

app.listen(4000, () => console.log('Blockchain Logger running on port 4000'));
