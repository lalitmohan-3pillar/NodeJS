const mongoose = require('mongoose');

const Detail=mongoose.Schema({
    brandName:String,
    brandIconUrl:String,
    links:[{
        label:String,
        url:String,
        icon:String
    }],
});

module.exports = mongoose.model("Detail",Detail);