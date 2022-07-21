const { handleSync } = require("./handlerSync");
const { handleTransation } = require("./handleEvent");
const { handleBalance } = require("./handleBalance");

const blockchainHandle = async () => {
    try {
        await handleSync();
        handleTransation();
        handleBalance();
    } catch (err) {
        console.log("blockchain handle: " + err.message);
    }
};

module.exports = blockchainHandle;
