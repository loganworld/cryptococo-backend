
const Abis = require("./contracts/treasury-abis.json");
const Addresses = require("./contracts/treasury-addresses.json");
const { provider } = require("../../contracts");

const adminPrivateKey = process.env.AdminPrivateKey;
const adminWallet = new ethers.Wallet(adminPrivateKey, provider);

const TreasuryContract = new ethers.Contract(
    Addresses.treasury,
    Abis.treasury,
    adminWallet
);
module.exports = { TreasuryContract ,provider}