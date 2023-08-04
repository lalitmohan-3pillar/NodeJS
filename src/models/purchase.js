const mongoose = require('mongoose');

const Purchase=mongoose.Schema({
    items:[{
        productName:String,
        productPrice:Number,
        productQty:Number,
    }],   
    productUser:String,
    userAddress:String,
    purchaseDate:Date    
});

module.exports = mongoose.model("Purchase",Purchase);