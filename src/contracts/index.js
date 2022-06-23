require("dotenv").config();
const { ethers } = require("ethers");
const Abis = require("./contracts/abis.json");
const Addresses = require("./contracts/addresses.json");
const { provider, supportChainId } = require("./providers");
const { Contract, Provider, setMulticallAddress } = require("ethers-multicall");

const multicallAddress = process.env.MULTIADDRESS;
setMulticallAddress(supportChainId, multicallAddress);

const marketplaceContract = new ethers.Contract(
    Addresses.Marketplace,
    Abis.Marketplace,
    provider
);

const marketplaceContract_m = new Contract(
    Addresses.Marketplace,
    Abis.Marketplace
);

const multicallProvider = new Provider(provider, supportChainId);

const getNFTContract = (address) => {
    return new ethers.Contract(address, Abis.NFT, provider);
};

const getNFTContract_m = (address) => {
    return new Contract(address, Abis.NFT, provider);
};

module.exports = {
    provider,
    multicallProvider,
    marketplaceContract,
    marketplaceContract_m,
    getNFTContract,
    getNFTContract_m,
};
