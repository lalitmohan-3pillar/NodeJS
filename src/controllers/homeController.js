const Detail = require('../models/detail');
const Product = require('../models/product');


const gethome= async (req,res)=>{     
    const details= await Detail.findOne();    
    if(details!==null){           
        if(req.session.name){ 
            const product= await Product.find();  
            if(product!==null){                 
                res.render('product',{
                    details:details,
                    session:req.session.name,
                    product:product
                });
            }
            else{
                res.render('product',{
                    details:details,
                    session:req.session.name
                });
            }
        }
        else {   
            req.flash('message','Please Login')            
            res.redirect(`${process.env.PREFIXPATH}/login`);
        }           
    }    
}

module.exports= {gethome};