const expressAsyncHandler = require('express-async-handler');
const Cart = require('../models/cart');
const Detail = require('../models/detail');
const Product= require('../models/product');

const getcart= expressAsyncHandler(async (req,res)=>{    
    const details= await Detail.findOne();   
    if(details!==null){ 
        if(req.session.name){
            const Carts = await Cart.find({productUser:req.session.name}).exec();  
            const outputArray = Carts.map(item => {
                const total = item.productPrice * item.productQty;
                return { ...item, total };
              });

            const totalPriceForAll = outputArray.reduce((total, item) => total + item.total, 0);        
            res.render('cart',{
                details:details,
                session:req.session.name,
                Carts:outputArray,
                totalPriceForAll:totalPriceForAll
            });
        }
        else {
            req.flash('message','Please Login')
            res.redirect(`${process.env.PREFIXPATH}/login`);
        }        
    }    
});

const addToCart= expressAsyncHandler(async(req,res)=>{   
        
    const details= await Detail.findOne();   
    if(details!==null){ 
        if(req.session.name){
            const product= await Product.findOne({productName: req.query.productName});  
            if (product) {  
                const Carts = await Cart.findOne({productUser:req.session.name,productName: req.query.productName}).exec(); 
                 if(Carts){
                            await Cart.findOneAndUpdate({productUser:req.session.name,productName: req.query.productName}, 
                            {   productQty:Carts.productQty+1
                            },
                            {new:true})
                        }
                        else{                
                            await Cart.create({
                                productName:product.productName,
                                productPrice:product.productPrice,
                                productQty:1,
                                productUser:req.session.name,
                            });
                        }
                const cartItems = await Cart.find({productUser:req.session.name}).exec();
                const outputArray = cartItems.map(item => {
                    const total = item.productPrice * item.productQty;
                    return { ...item, total };
                  });
    
                const totalPriceForAll = outputArray.reduce((total, item) => total + item.total, 0);   
                res.render('cart',{
                    details:details,
                    session:req.session.name,
                    Carts:outputArray,
                    totalPriceForAll:totalPriceForAll
                });
            }
        }
        else {
            req.flash('message','Please Login')
            res.redirect(`${process.env.PREFIXPATH}/login`);
        } 
    } 
});

const removeFromCart = expressAsyncHandler(async(req,res)=>{   
    
    const details= await Detail.findOne();   
    if(details!==null){ 
        if(req.session.name){            
                const Carts = await Cart.findOne({productUser:req.session.name,productName: req.query.productName}).exec(); 
                 if(Carts && req.query.All){
                    await Cart.findOneAndRemove({productUser:req.session.name,productName: req.query.productName})
                    }
                    else{
                        if(Carts.productQty>0){
                            await Cart.findOneAndUpdate({productUser:req.session.name,productName: req.query.productName}, 
                            {   productQty:Carts.productQty-1
                            },
                            {new:true})
                        }
                        else if(Carts.productQty==0){
                            await Cart.findOneAndRemove({productUser:req.session.name,productName: req.query.productName})
                        }
                    }
                const cartItems = await Cart.find({productUser:req.session.name}).exec();
                const outputArray = cartItems.map(item => {
                    const total = item.productPrice * item.productQty;
                    return { ...item, total };
                  });
    
                const totalPriceForAll = outputArray.reduce((total, item) => total + item.total, 0);   
                res.render('cart',{
                    details:details,
                    session:req.session.name,
                    Carts:outputArray,
                    totalPriceForAll:totalPriceForAll
                });
            }        
        else {
            req.flash('message','Please Login')
            res.redirect(`${process.env.PREFIXPATH}/login`);
        } 
    } 
});

module.exports= {getcart,addToCart,removeFromCart};