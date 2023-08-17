const expressAsyncHandler = require('express-async-handler');
const CartService = require('../services/cartService');
const ProductService = require('../services/productService');
/**
 * This controller is handling request for Cart's operation
 * @module CartController
 */

/** 
 * This is for load cart details
 * @function GetCart
 * @api {get} /assessment/cart  load the cart page
 * @apiName getcart
 *
 **/
const getcart = expressAsyncHandler(async (req, res) => {

    const Carts = await CartService.getcartByUser(req.session.username);
    const outputArray = Carts.map(item => {
        const total = item.productPrice * item.productQty;
        return { ...item, total };
    });

    const totalPriceForAll = outputArray.reduce((total, item) => total + item.total, 0);
    res.render('cart', {
        details: res.locals.menuItemsWithCart,
        session: req.session.name,
        Carts: outputArray,
        totalPriceForAll: totalPriceForAll
    });
});

/**
 * This is post method for addToCart 
 * @api {post} /assessment/addToCartByProduct  or   /assessment/addToCartFromCart
 * @apiName addToCart
 * @function AddToCart
 * @param {string} productName -product Name 
 * @param {string} productUser -productUser session for the user
 *
 **/
const addToCart = expressAsyncHandler(async (req, res) => {

    const product = await ProductService.getproduct(req.query.productName);
    if (product) {
        const Carts = await CartService.getcartByUserAndProduct(req.session.username,req.query.productName);
        if (Carts) {
            await CartService.incrementCartQuantity(Carts.productQty,req.session.username,req.query.productName);                
        }
        else {
            await CartService.addToCart(req.session.username,product.productName,product.productPrice);                
        }
        if ((req.path).includes('addToCartByProduct')) {
            res.redirect(`${process.env.PREFIXPATH}`);
        }
        else if ((req.path).includes('addToCartFromCart')) {
            res.redirect(`${process.env.PREFIXPATH}/cart`)
        }
        else {
            res.redirect(`${process.env.PREFIXPATH}/purchaseOrder`)
        }

    }
});

/**
 * This is post method for removeFromCart 
 * @api {post} /assessment/removeFromCart  
 * @apiName removeFromCart
 * @function RemoveFromCart
 * @param {string} productName -product Name 
 * @param {string} productUser -productUser session for the user
 *
 **/
const removeFromCart = expressAsyncHandler(async (req, res) => {

    const Carts = await CartService.getcartByUserAndProduct(req.session.username,req.query.productName);
    if (Carts && req.query.All) {
        await CartService.removeAllFromCart(req.session.username, req.query.productName);
    }
    else {
        if (Carts.productQty > 0 && Carts.productQty != 1) {
            await CartService.decrementCartQuantity(Carts.productQty,req.session.username,req.query.productName);
        }
        else if (Carts.productQty == 1) {
            await CartService.removeAllFromCart(req.session.username, req.query.productName);
        }
    }
    if ((req.path).includes('removeFromCart')) {
        res.redirect(`${process.env.PREFIXPATH}/cart`)
    }
    else {
        res.redirect(`${process.env.PREFIXPATH}/purchaseOrder`)
    }

});

module.exports = { getcart, addToCart, removeFromCart };