/**  
 * gas station : buy ETH with credit card system 
*/

/** 
 * api/newRequest(req,res) : make new request
 * req params
 * @param {Number} buyAmount - eth amount
 * @param {String} currency - JPY,USD,EUR
 * @param {String} successUrl - redirect url when payment success
 * @param {String} cancelUrl - redirect url when payment cancel
 * return session
*/
/** 
 * api/complete payment(req,res) : complete payment webhook from stripe
 * req params
 * @param {Object} rawBody
 * @param {String} tripe-signature 
 * return status
*/

/**
 * out side requirement
 * contracts/index.js
 *   provider: "../../contracts" - rpc provider
 */