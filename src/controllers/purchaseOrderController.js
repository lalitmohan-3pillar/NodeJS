const Product = require('../models/product');
const Detail = require('../models/detail');
const Cart = require('../models/cart');
const Purchase = require('../models/purchase');
const asyncHandler = require('express-async-handler');



const purchaseOrder = asyncHandler(async(req,res)=>{ 
    const details= await Detail.findOne();   
    if(details!==null){ 
        if(req.session.name){
            if(req.query.productName){                            
                res.render('purchaseOrder',{
                    details:details,
                    session:req.session.name,
                    price:req.query.productPrice,
                    name:req.query.productName
                });
            }
            else{
                const Carts = await Cart.find({productUser:req.session.name}).exec();   
                const outputArray = Carts.map(item => {
                    const total = item.productPrice * item.productQty;
                    return { ...item, total };
                  });
    
                const totalPriceForAll = outputArray.reduce((total, item) => total + item.total, 0);                 
                res.render('purchaseOrder',{
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


const postPurchaseOrder =asyncHandler(async(req,res)=>{ 
    const details= await Detail.findOne();   
    if(details!==null){ 
        if(req.session.name){
            if(req.body.price){
                                await Purchase.create({
                                    items:[{
                                        productName: req.body.name,
                                        productPrice: req.body.price,
                                        productQty:1
                                    }],
                                    productUser:req.session.name,
                                    userAddress:req.body.address,
                                    purchaseDate:Date.now()
                                }); 
                        const purchase = await Purchase.find({productUser:req.session.name}).exec();            
                                res.render('orders',{
                                    details:details,
                                    session:req.session.name,
                                    purchase:purchase
                                });
                    }
                    else{
                        const Carts = await Cart.find({productUser:req.session.name},'productName productPrice productQty').exec();  
                        if(Carts){  
                            await Purchase.create({
                                items:Carts,
                                productUser:req.session.name,
                                userAddress:req.body.address,
                                purchaseDate:Date.now()
                            });
                            await Cart.deleteMany({productUser:req.session.name})
                        const purchase = await Purchase.find({productUser:req.session.name}).exec();            
                        res.render('orders',{
                            details:details,
                            session:req.session.name,
                            purchase:purchase
                        });
                       }
                    } 
        }
        else {
            req.flash('message','Please Login')
            res.redirect(`${process.env.PREFIXPATH}/login`);
        }        
    }    
});

module.exports ={purchaseOrder,postPurchaseOrder}