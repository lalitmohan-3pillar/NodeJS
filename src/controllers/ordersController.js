const Purchase= require('../models/purchase');

const getorders= async (req,res)=>{    

        const purchase = await Purchase.find({productUser:req.session.name}).exec(); 
           const purchaseWithDate=purchase.map(obj=>{
                return {
                    ...obj,
                purchaseDate1:obj.purchaseDate.toLocaleDateString()+' '+obj.purchaseDate.toLocaleTimeString()
            }            
        });        
        const outputArray = purchaseWithDate.map(item => {
            var total=0;
            item._doc.items.map(val => {               
                total= total+val.productPrice * val.productQty;            
            })            
         return {...item,total} });
            
            res.render('orders',{
                details:res.locals.menuItemsWithCart,
                session:req.session.name,
                purchase:outputArray
            });
        };

module.exports= {getorders};