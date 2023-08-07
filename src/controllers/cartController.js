const expressAsyncHandler = require('express-async-handler');
const Cart = require('../models/cart');
const Product= require('../models/product');

const getcart= expressAsyncHandler(async (req,res)=>{    

            const Carts = await Cart.find({productUser:req.session.name}).exec();            
            const outputArray = Carts.map(item => {
                const total = item.productPrice * item.productQty;
                return { ...item, total };
              });

            const totalPriceForAll = outputArray.reduce((total, item) => total + item.total, 0);        
            res.render('cart',{
                details:res.locals.menuItemsWithCart,
                session:req.session.name,
                Carts:outputArray,
                totalPriceForAll:totalPriceForAll
            });       
});

const addToCart= expressAsyncHandler(async(req,res)=>{   

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
                if((req.path).includes('addToCartByProduct'))
                {                    
                    res.redirect(`${process.env.PREFIXPATH}`);      
                }
                else if((req.path).includes('addToCartFromCart')){
                    res.redirect(`${process.env.PREFIXPATH}/cart`)
                }
                else{
                    res.redirect(`${process.env.PREFIXPATH}/purchaseOrder`)
                }
                         
            }
        });

const removeFromCart = expressAsyncHandler(async(req,res)=>{   
           
                const Carts = await Cart.findOne({productUser:req.session.name,productName: req.query.productName}).exec(); 
                 if(Carts && req.query.All){
                    await Cart.findOneAndRemove({productUser:req.session.name,productName: req.query.productName})
                    }
                    else{
                        if(Carts.productQty>0 && Carts.productQty!=1){
                            await Cart.findOneAndUpdate({productUser:req.session.name,productName: req.query.productName}, 
                            {   productQty:Carts.productQty-1
                            },
                            {new:true})
                        }
                        else if(Carts.productQty==1){
                            await Cart.findOneAndRemove({productUser:req.session.name,productName: req.query.productName})
                        }
                    }  
                    if((req.path).includes('removeFromCart')){
                        res.redirect(`${process.env.PREFIXPATH}/cart`)
                    }
                    else{
                        res.redirect(`${process.env.PREFIXPATH}/purchaseOrder`)
                    }                           
                
});

module.exports= {getcart,addToCart,removeFromCart};