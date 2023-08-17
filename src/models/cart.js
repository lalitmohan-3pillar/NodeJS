const mongoose = require('mongoose');
const Cart=mongoose.Schema({
    productName:String,
    productPrice:Number,
    productQty:Number,
    productUser:String
},
{
    timestamps:true
});

module.exports = mongoose.model("Cart",Cart);