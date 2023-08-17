const Cart = require('../models/cart');
const CartService = {};
/**
 * A collection of CartService functions for handling cart's operations
 * @module CartService 
 */

/**
 * This query is based on username .
 * and return Cart Info.
 * @function GetcartByUser
 *
 * @param {string} productUser - The username.
 *
 * @returns {object} - cart Info
 */
CartService.getcartByUser = async (productUser) => {

    const Carts = await Cart.find({ productUser: productUser}).exec();
    return Carts;
};


/**
 * This query is based on username and productName.
 * and return Cart Info.
 * @function GetcartByUserAndProduct
 *
 * @param {string} productUser - The userName.
 * @param {string} productName - The productName.
 *
 * @returns {object} - cart Info
 */
CartService.getcartByUserAndProduct = async (productUser,productName) => {

    const Carts = await Cart.findOne({ productUser: productUser, productName: productName }).exec();
    return Carts;
};

/**
 * This query is based on product's current qty into cart , username and productName.
 * 
 * @function incrementCartQuantity
 * 
 * @param {number} productQty -  product's current qty into cart.
 * @param {string} productUser - The userName.
 * @param {string} productName - The productName.
 *
 */
CartService.incrementCartQuantity = async (currentQty,productUser,productName) => {

    await Cart.findOneAndUpdate({ productUser: productUser, productName: productName },
        {
            productQty: currentQty + 1
        },
        { new: true })
};

/**
 * This query is based on username , productName and product's price .
 * 
 * @function addToCart
 *  
 * @param {string} productUser - The userName.
 * @param {string} productName - The productName.
 * @param {number} productPrice -  product's price.
 *
 */
CartService.addToCart = async (productUser,productName,productPrice) => {    
            await Cart.create({
                productName: productName,
                productPrice: productPrice,
                productQty: 1,
                productUser: productUser,
            });        
};

/**
 * This query is based on product's current qty into cart , username and productName.
 * 
 * @function decrementCartQuantity
 * 
 * @param {number} productQty -  product's current qty into cart.
 * @param {string} productUser - The userName.
 * @param {string} productName - The productName.
 *
 */
CartService.decrementCartQuantity = async (currentQty,productUser,productName) => {

    await Cart.findOneAndUpdate({ productUser: productUser, productName: productName },
        {
            productQty: currentQty - 1
        },
        { new: true })
};

/**
 * This query is based on username and productName.
 * 
 * @function removeAllFromCart
 * 
 * @param {string} productUser - The userName.
 * @param {string} productName - The productName.
 *
 */
CartService.removeAllFromCart = async (productUser,productName) => {

    await Cart.findOneAndRemove({ productUser: productUser, productName: productName });
};

module.exports = CartService;