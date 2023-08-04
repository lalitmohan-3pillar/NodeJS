const mongoose = require('mongoose');

const Product=mongoose.Schema({
    productName:String,    
    productPrice:Number,
    productCategory:String,   
    productDescription:String,
    productUrl:String
   
});

module.exports = mongoose.model("Product",Product);