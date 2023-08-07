const express = require('express');
const Product = require('../models/product');
const routes= express.Router();
const {createUser,loginUser,getlogin,getregister,logout,profile,changeProfile}= require('../controllers/userController');
const {gethome}= require('../controllers/homeController');
const { getorders } = require('../controllers/ordersController');
const { getcart,addToCart,removeFromCart } = require('../controllers/cartController');
const { getproduct,editproduct,searchProduct,getproductDetail,filterProduct,deleteProduct } 
            = require('../controllers/productController');
const {purchaseOrder,postPurchaseOrder}    = require('../controllers/purchaseOrderController');
const {validateToken} = require('../../middleware/validateTokenHandler');

routes.route('/').get(validateToken,gethome); //private route

routes.route('/search').get(validateToken,searchProduct);//private route

routes.route('/filterProduct').get(validateToken,filterProduct);//private route

routes.route('/NotAuthorized').get((req,res)=>{
    res.render('NotAuthorized')
});

routes.route('/').post(loginUser)

routes.route('/orders').get(getorders);

routes.route('/cart').get(getcart);

routes.route('/login').get(getlogin);
routes.route('/login').post(loginUser)

routes.route('/register').get(getregister);
routes.route('/register').post(createUser)

routes.route('/logout').get(logout);
routes.route('/profile').get(profile)
routes.route('/profile').post(changeProfile)

routes.route('/addproduct').get(getproduct);
routes.route('/editProduct').get(editproduct);


var multer  = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/product')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })


routes.post('/addproduct', upload.single('productUrl'), async(req,res)=>{ 
    const {productName,productPrice,productCategory,productDescription}=req.body;
    var productUrl=req.file;
    
    if(!productName || !productPrice || (productCategory=='0') || !productDescription || !productUrl)
    {        
                  
        req.flash('productmessage','All fields are mandatory')
        res.redirect(`${process.env.PREFIXPATH}/addProduct`);        
    }    
    else
     {        
        const product= await Product.findOne({productName: req.body.productName});  
        if (product && product.productName===req.body.productName) {
            req.flash('productmessage',`Product with name '${product.productName}' already persent.`)            
            res.redirect(`${process.env.PREFIXPATH}/addProduct`);
        }
        else{  
            productUrl=(req.file.destination).replace('./','/').replace('public','static').concat('/',req.file.originalname);
            await Product.create({
                productName,productPrice,productCategory,productDescription,productUrl
            });
            req.flash('successproductmessage','Product Added successfully')            
            res.redirect(`${process.env.PREFIXPATH}/addProduct`);
        }
    }  
});

routes.post('/editProduct/:productName', upload.single('productUrl'), async(req,res)=>{ 
    const {productName,productPrice,productCategory,productDescription,_id}=req.body;
    var productUrl=req.file;    
    if(!productName || !productPrice || (productCategory=='0') || !productDescription || !productUrl )
    {        
        req.flash('productmessage','All fields are mandatory')
        res.redirect(`${process.env.PREFIXPATH}/editProduct?productName=${req.params.productName}`);        
    }    
    else
     {        
        
     productUrl=(req.file.destination).replace('./','/').replace('public','static').concat('/',req.file.originalname); 
     
     const existingProduct = await Product.findOne({ 
        productName: productName
     });        
        if (existingProduct && existingProduct._id.toString() !== _id ) {
            return res.status(400).json({ error: 'Product name already exists.' });
            //req.flash('productmessage','Product name already exists.')            
            //res.redirect(`${process.env.PREFIXPATH}/editProduct?productName=${req.params.productName}`);
            }
        else{             
        
            await Product.findOneAndUpdate({productName: req.params.productName}, 
                                        {   productName,
                                            productPrice,
                                            productCategory,
                                            productDescription,
                                            productUrl,
                                        },
                                        {new:true})
            .then(updatedProduct => {
                if (updatedProduct) {
                        console.log('Product updated successfully:');
                      //console.log('Product updated successfully:', updatedProduct);
                    } else {
                        console.log('Product not found');
                    }
              })
              .catch(error => {
                console.error('Error while updating product:', error);
              });            
            req.flash('success-productmessage','Product Added successfully')            
            res.redirect(`${process.env.PREFIXPATH}`);
        } 
        
    }  
});

routes.route('/productDetail').get(getproductDetail);

routes.route('/delete/:productName').delete(deleteProduct);

routes.route('/addToCartByProduct').get(addToCart);
routes.route('/addToCartFromCart').get(addToCart);
routes.route('/addToCartFromPO').get(addToCart);

routes.route('/removeFromCart').get(removeFromCart);
routes.route('/removeFromOrder').get(removeFromCart);

routes.route('/purchaseOrder').get(purchaseOrder);

routes.route('/purchaseOrder').post(postPurchaseOrder);

module.exports = routes;

