const Cart = require('../models/cart');
const Purchase = require('../models/purchase');
const asyncHandler = require('express-async-handler');
const User= require('../models/user')

const purchaseOrder = asyncHandler(async(req,res)=>{   
    const user = await User.findOne({username: req.session.username});
            if(req.query.productName){                            
                res.render('purchaseOrder',{
                    details:res.locals.menuItemsWithCart,
                    session:req.session.name,
                    price:req.query.productPrice,
                    name:req.query.productName,
                    address:user.shippingAddress
                });
            }
            else{
                const Carts = await Cart.find({productUser:req.session.username}).exec();   
                const outputArray = Carts.map(item => {
                    const total = item.productPrice * item.productQty;
                    return { ...item, total };
                  });
    
                const totalPriceForAll = outputArray.reduce((total, item) => total + item.total, 0);                 
                res.render('purchaseOrder',{
                    details:res.locals.menuItemsWithCart,
                    session:req.session.name,
                    Carts:outputArray,
                    totalPriceForAll:totalPriceForAll,
                    address:user.shippingAddress
                });
            }        
});


const postPurchaseOrder =asyncHandler(async(req,res)=>{   
            if(req.body.price){
                                await Purchase.create({
                                    items:[{
                                        productName: req.body.name,
                                        productPrice: req.body.price,
                                        productQty:1
                                    }],
                                    productUser:req.session.username,
                                    userAddress:req.body.address,
                                    purchaseDate:Date.now()
                                }); 
                    }
                    else{
                        const Carts = await Cart.find({productUser:req.session.username},
                                                    'productName productPrice productQty').exec();  
                        if(Carts){  
                            await Purchase.create({
                                items:Carts,
                                productUser:req.session.username,
                                userAddress:req.body.address,
                                purchaseDate:Date.now()
                            });
                            await Cart.deleteMany({productUser:req.session.username})                        
                       }
                    }
                    res.redirect(`${process.env.PREFIXPATH}/orders`);    
});

module.exports ={purchaseOrder,postPurchaseOrder}