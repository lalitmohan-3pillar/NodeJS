const mongoose = require('mongoose');

const Cart=mongoose.Schema({
    productName:String,
    productPrice:Number,
    productQty:Number,
    productUser:String    
});

module.exports = mongoose.model("Cart",Cart);