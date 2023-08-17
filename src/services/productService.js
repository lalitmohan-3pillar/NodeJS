const Product = require('../models/product');
const ProductService = {};
/**
 * A collection of ProductService functions for handling product's operations
 * @module ProductService 
 */

/**
 * This query is based on productName .
 * and return Product Info.
 * @function GetProduct
 *
 * @param {string} productName - The productname.
 *
 * @returns {object} - Product Info
 */
ProductService.getproduct = async (productName) => {

    const product = await Product.findOne({ productName: productName });
    return product;
};

module.exports = ProductService;