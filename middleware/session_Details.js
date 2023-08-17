const Detail = require('../src/models/detail');
const Cart = require('../src/models/cart');
const customMiddleware = async(req, res, next) => {
    
    // Exclude the login route from middleware checks because otherwise it get into deadlock
    if ((req.path === '/assessment/login') || (req.path === '/assessment/register')) {
        return next();
      }
    else
    { 
        // Check session variable here
        if (!req.session.name) {
        // Redirect or handle unauthorized access        
        return (
                req.flash('message','Please Login') ,           
                res.redirect(`${process.env.PREFIXPATH}/login`)                
            )
        }
        // Set menu details here
      res.locals.menuItems= await Detail.findOne(); 
      
      // Set cart item count here
      var Carts = await Cart.find({productUser:req.session.username}).exec();    

      res.locals.menuItemsWithCart={...res.locals.menuItems,cartCount:Carts.length}      
    
      next(); // Move to the next middleware or route handler
    }
  
    
  };
  
  module.exports = customMiddleware;