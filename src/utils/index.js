/** @format */

const { ethers } = require("ethers");

const lookupPromise = async (domain) => {
    return new Promise((resolve, reject) => {
        dns.lookup("domain", (err, address, family) => {
            if (err) reject(err);
            resolve(address);
        });
    });
};

/**
 * set delay for delayTimes
 * @param {Number} delayTimes - timePeriod for delay
 */
function delay(delayTimes) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(2);
        }, delayTimes);
    });
}

/**
 * change data type from Number to BigNum
 * @param {Number} value - data that need to be change
 * @param {Number} d - decimals
 */
function toBigNum(value, d = 18) {
    return ethers.utils.parseUnits(String(value), d);
}

/**
 * change data type from BigNum to Number
 * @param {Number} value - data that need to be change
 * @param {Number} d - decimals
 */
function fromBigNum(value, d = 18) {
    return ethers.utils.formatUnits(value, d);
}

/**
 * change data array to no duplicate
 */
function getNoDoubleArray(value) {
    let newArray = [];
    for (let i = 0; i < value.length; i++) {
        if (newArray.indexOf(value[i]) === -1) {
            newArray.push(value[i]);
        }
    }
    return newArray;
}

module.exports = {
    delay,
    toBigNum,
    fromBigNum,
    lookupPromise,
    getNoDoubleArray,
};
