const asyncHandler = require('express-async-handler')
const jwt= require('jsonwebtoken')

const validateToken = asyncHandler (async (req,res,next)=>{
    if(req.session.name){
        let token;
        let authHeader = token= req.session.jwt; // you can save in cookie as well
        if(authHeader){
            //console.log('hi',authHeader)
            jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,decoded)=>{
                if(err){
                    //console.log('hi')
                    res.redirect(`${process.env.PREFIXPATH}/NotAuthorized`)
                    //throw new Error("User is not Authorized OR token expired.")
                }
                else{
                    req.user = decoded.user;
                    //console.log('hiii',req.user)
                    next();
                }
            });
            if(!token){
                throw new Error("User is not Authorized.")
            }
        }
    }
    else {
        req.flash('message','Please Login')
        res.redirect(`${process.env.PREFIXPATH}/login`);
    } 
});

module.exports= {validateToken};