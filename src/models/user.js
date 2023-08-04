const mongoose = require('mongoose');

const User = mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name must be entered']
    },
    email:{
        type:String,
        required:[true,'Email must be entered']
    },
    username:{
        type:String,
        required:[true,'User Name must be entered']
    },
    password:{
        type:String,
        required:[true,'Password must be entered']
    },
    confirmpassword:{
        type:String,
        required:[true,'Confirm Password must be entered']
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("user",User)