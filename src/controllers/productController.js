const Product = require('../models/product');
const asyncHandler = require('express-async-handler');


const getproduct = asyncHandler(async(req,res)=>{ 
                        res.render('add_editProduct',{
                        details:res.locals.menuItemsWithCart,
                        session:req.session.name,
                        productmessage:req.flash('productmessage'),
                        successproductmessage:req.flash('successproductmessage')
                    });                 
                });

const editproduct= asyncHandler(async(req,res)=>{     
    if(req.query.productName){ 
            const product= await Product.findOne({productName:req.query.productName});             
            if(product){                
                res.render('add_editProduct',{
                            details:res.locals.menuItemsWithCart,
                            product:product,
                            session:req.session.name,                            
                            productmessage:req.flash('productmessage')
                        });   
                } 
    }    
});

const searchProduct = asyncHandler(async(req, res) => {
    const searchTerm = req.query.term; // Get the search term from the query parameter  
                     
            var product = await Product.find({productName: { $regex: searchTerm, $options: 'i' } });              
            if(product!==null){
                const productWithFixedlenght= product.map(obj => {
                    const description= obj.productDescription.slice(0, 15);
                    return{...obj, description} ;             
                  });
                res.render('product',{
                    details:res.locals.menuItemsWithCart,
                    session:req.session.name,
                    product:productWithFixedlenght
                });                
            }
            else{
                res.render('product',{
                    details:res.locals.menuItemsWithCart,
                    session:req.session.name
                });
            }               
    });

  const getproductDetail = asyncHandler(async (req,res)=>{     
                
           var product= await Product.findOne({productName: req.query.productName});                    
            if(product!==null){               
                res.render('productDetail',{
                    details:res.locals.menuItemsWithCart,
                    session:req.session.name,
                    product:product
                });
            }
});

const filterProduct = asyncHandler(async (req,res)=>{   
   
            var product;
            if(req.query.productCategory=='All'){
                 product= await Product.find();
            }
            else{
                 product= await Product.find({productCategory: req.query.productCategory});
            }
            if(product!==null){
                const productWithFixedlenght= product.map(obj => {
                    const description= obj.productDescription.slice(0, 15);
                    return{...obj, description} ;             
                  });
                res.render('product',{
                    details:res.locals.menuItemsWithCart,
                    session:req.session.name,
                    product:productWithFixedlenght
                });
            }
            else{
                res.render('product',{
                    details:res.locals.menuItemsWithCart,
                    session:req.session.name
                });
            }        
});

const deleteProduct = asyncHandler(async(req,res)=>{
    const itemName = req.params.productName; // Get the item ID from the request parameters  
            var product;
            if(itemName){
                 product= await Product.findOneAndRemove({productName: itemName}); 
                 //we can not redirect from here becuase api call via javascript fetch api               
                 res.status(200).json({ message: 'Item deleted successfully' });
                }           
        });

module.exports ={getproduct,editproduct,searchProduct,getproductDetail,filterProduct,deleteProduct}