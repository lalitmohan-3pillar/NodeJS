const Detail = require('../models/detail');
const Purchase= require('../models/purchase');

const getorders= async (req,res)=>{    
    const details= await Detail.findOne();   
    if(details!==null){ 
        if(req.session.name){
            const purchase = await Purchase.find({productUser:req.session.name}).exec();  
           
           const purchaseWithDate=purchase.map(obj=>{
                return {
                    ...obj,
                purchaseDate1:obj.purchaseDate.toLocaleDateString()+' '+obj.purchaseDate.toLocaleTimeString()
            }
            
        });
        //console.log(purchaseWithDate)
        const outputArray = purchaseWithDate.map(item => {
            var total=0;
            item._doc.items.map(val => {
                //console.log('val',val)
                total= total+val.productPrice * val.productQty;            
            })            
         return {...item,total} });
            
            res.render('orders',{
                details:details,
                session:req.session.name,
                //purchase:purchase,
                purchase:outputArray
            });
        }
        else {
            req.flash('message','Please Login')
            res.redirect(`${process.env.PREFIXPATH}/login`);
        } 
    }    
}

module.exports= {getorders};