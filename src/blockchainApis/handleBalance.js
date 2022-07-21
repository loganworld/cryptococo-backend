require("dotenv").config();
const cron = require("node-cron");

const handleBalance = async () => {
    const handleStart = async () => {};

    var time = 15;
    cron.schedule(`*/${time} * * * * *`, () => {
        console.log(`running a check balance handle every ${time} second`);
        handleStart();
    });
};

module.exports = { handleBalance };
