const Product = require('../models/product');
const Detail = require('../models/detail');
const asyncHandler = require('express-async-handler');
var session = require('express-session')



const getproduct = asyncHandler(async(req,res)=>{ 
    const details= await Detail.findOne();          
                if(details!==null){ 
                    if(req.session.name){ 
                    res.render('add_editProduct',{
                        details:details,
                        session:req.session.name,
                        productmessage:req.flash('productmessage'),
                        successproductmessage:req.flash('successproductmessage')
                    });                 
                }            
            else {   
                req.flash('message','Please Login')            
                res.redirect(`${process.env.PREFIXPATH}/login`);
            }  
    }
});

 const editproduct= asyncHandler(async(req,res)=>{ 
    const details= await Detail.findOne(); 
    if(req.query.productName){        
        if(details!==null){ 
          if(req.session.name){ 
            const product= await Product.findOne({productName:req.query.productName});             
            if(product){                
                res.render('add_editProduct',{
                            details:details,
                            session:req.session.name,
                            product:product,                            
                            productmessage:req.flash('productmessage')
                        });   
                }              
            }            
            else {   
                    req.flash('message','Please Login')            
                    res.redirect(`${process.env.PREFIXPATH}/login`);
                 }   
        }
    }    
});

const searchProduct = asyncHandler(async(req, res) => {
    const searchTerm = req.query.term; // Get the search term from the query parameter  
    const details= await Detail.findOne();    
    if(details!==null){           
        if(req.session.name){                     
            var product = await Product.find({productName: { $regex: searchTerm, $options: 'i' } });              
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
  });

  const getproductDetail = asyncHandler(async (req,res)=>{     
    //console.log('hi')
    const details= await Detail.findOne();    
    if(details!==null){           
        if(req.session.name){    
            //console.log('hiff',req.query.productName)         
           var product= await Product.findOne({productName: req.query.productName});                    
            if(product!==null){
                //console.log('done',product)   
                res.render('productDetail',{
                    details:details,
                    session:req.session.name,
                    product:product
                });
            }
        }
        else {   
            req.flash('message','Please Login')            
            res.redirect(`${process.env.PREFIXPATH}/login`);
        }           
    }    
});

const filterProduct = asyncHandler(async (req,res)=>{     
    const details= await Detail.findOne();    
    if(details!==null){           
        if(req.session.name){ 
            var product;
            if(req.query.productCategory=='All'){
                 product= await Product.find();
            }
            else{
                 product= await Product.find({productCategory: req.query.productCategory});
            }
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
});

const deleteProduct = asyncHandler(async(req,res)=>{
    const itemName = req.params.productName; // Get the item ID from the request parameters
    const details= await Detail.findOne();    
    if(details!==null){           
        if(req.session.name){ 
            var product;
            if(itemName){
                 product= await Product.findOneAndRemove({productName: itemName}); 
                 //we can not redirect from here becuase api call via javascript fetch api               
                 res.status(200).json({ message: 'Item deleted successfully' });
                }           
        }
        else {   
            req.flash('message','Please Login')            
            res.redirect(`${process.env.PREFIXPATH}/login`);
        }           
    }    
    
});

module.exports ={getproduct,editproduct,searchProduct,getproductDetail,filterProduct,deleteProduct}