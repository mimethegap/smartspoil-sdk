// SmartSpoil Blockchain Logger (Node.js + Web3.js)
// Logs freshness scores to a smart contract on Ethereum-compatible blockchain

const Web3 = require('web3');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Connect to Ethereum node (Infura, Alchemy, local Ganache, etc.)
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'));

// Replace with your deployed smart contract address and ABI
const contractAddress = '0xYourSmartContractAddress';
const abi = [ /* ABI JSON goes here */ ];

const account = '0xYourWalletAddress'; // Must hold ETH and have access to private key
const privateKey = 'your_private_key'; // Securely load from env file or secrets manager

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
