const Product = require('../models/product');


const gethome= async (req,res)=>{
            const product= await Product.find();
            const productWithFixedlenght= product.map(obj => {
                const description= obj.productDescription.slice(0, 15);
                return{...obj, description} ;             
              });            
            if(product!==null){                 
                res.render('product',{
                    details:res.locals.menuItemsWithCart,
                    session:req.session.name,
                    product:productWithFixedlenght                    
                });
            }
            else{
                res.render('product',{
                    details:res.locals.menuItemsWithCart,
                    session:req.session.name,
                });
            }       
}
module.exports= {gethome};