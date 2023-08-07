const User = require('../models/user');
const Detail = require('../models/detail');
const asyncHandler = require('express-async-handler');
var session = require('express-session')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const cookie = require('cookie')

const createUser = asyncHandler(async(req,res)=>{ 
    const {name,email,username,password,confirmpassword}=req.body;
    if(!name || !email || !username || !password || !confirmpassword)
    {       
        //res.status(400);
        req.flash('message','All fields are mandatory')
        res.redirect(`${process.env.PREFIXPATH}/register`);
        //throw new Error('All fields are mandatory');
    }
    if(password !== confirmpassword)
    {       
        //res.status(400);
        req.flash('message','password and confirmpassword not matched')
        res.redirect(`${process.env.PREFIXPATH}/register`);  
    }
    else
    {
        const user= await User.findOne({username: req.body.username});  
        if (user && user.username===req.body.username) {
            req.flash('message',`User with username '${user.username}' already persent.`)            
            res.redirect(`${process.env.PREFIXPATH}/register`);
        }
        else{  
             //Hash Password
             const hashPassword = await bcrypt.hash(password,10);             

            await User.create({
                name:name,
                email:email,
                username:username,
                password:hashPassword,
                confirmpassword:password,
                shippingAddress:''
            });
           
            req.flash('success-message','User created successfully')            
            res.redirect(`${process.env.PREFIXPATH}/login`);
        }
    }  
})

const loginUser = asyncHandler(async(req,res)=>{
     
    if(!req.body.username || !req.body.password)
    {
        req.flash('message','Username and password both fields are mandatory')        
        res.redirect(`${process.env.PREFIXPATH}/login`);        
    }    
    else{
        const user = await User.findOne({username: req.body.username});
    if (user) {           
        const details= await Detail.findOne(); 
            if(await bcrypt.compare(req.body.password,user.password)){       
                
                const accessToken = jwt.sign(
                    {
                        user:{
                            username: user.name,
                            email: user.email,
                            id: user._id
                        },
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn:"15m"}
                );
                
                if(details!==null){                     
                    session=req.session;
                    session.name=user.name;
                    session.username=user.username;
                    session.email=user.email;
                    session.jwt=accessToken;
                     if(req.body.remember)
                     {
                        cookie.username=req.body.username;
                        cookie.password=req.body.password;                                  
                     }
                     else{
                        cookie.username='';
                        cookie.password='';                           
                     }                    
                    res.redirect(`${process.env.PREFIXPATH}`);                 
                }                 
            }
            else
            {                
                req.flash('message','Invalid Password')  
                res.redirect(`${process.env.PREFIXPATH}/login`);
            }
    }
    else {
        req.flash('message','Invalid username or password')        
        res.redirect(`${process.env.PREFIXPATH}/login`);
    }
}
});

const getlogin =async (req,res)=>{    
    const details= await Detail.findOne();
    console.log('details',details)
    if(details!==null){   
         if(cookie.username !='') {   
                res.render('login',{ 
                    details: details, 
                    mymessages: req.flash('message'),
                    success_message: req.flash('success-message'),
                    posturl:`${process.env.PREFIXPATH}/login`,
                    username:cookie.username,
                    password:cookie.password 
                }); 
        }else{
            res.render('login',{ 
                details: details, 
                mymessages: req.flash('message'),
                success_message: req.flash('success-message'),
                posturl:`${process.env.PREFIXPATH}/login`,
            });      
    }   
 }
};

const getregister = async (req,res)=>{ 
    const details= await Detail.findOne();   
    if(details!==null){ 
       res.render('register',{
            details:details, 
            mymessages: req.flash('message'), 
            posturl:`${process.env.PREFIXPATH}/register`
    });
    }   
}

const logout = async (req,res)=>{ 
    const details= await Detail.findOne();   
    if(details!==null){   
        req.session.destroy((err)=>{
            if(err)
            console.log(err);
        }) 
        if(cookie) {    
                    res.render('login',{
                    details:details,
                    posturl:`${process.env.PREFIXPATH}/login`,
                    username:cookie.username,
                    password:cookie.password  });  
                  }else
                  {   
                    res.render('login',{
                    details:details,
                    posturl:`${process.env.PREFIXPATH}/login` });  
                  }  
    }   
}

const profile = async (req,res)=>{     
    const user = await User.findOne({username: req.session.username});
    //console.log(user)
       res.render('userProfile',{
            details:res.locals.menuItemsWithCart,
            UserInfo:user,
            session:req.session.name,
            changeprofile:req.flash('profileChange'),
            messages:req.flash('messages')
            
    });
}

const changeProfile = asyncHandler(async(req,res)=>{ 
            const {name,email,shippingAddress}=req.body;           
            if(!name || !email || !shippingAddress)
            { 
                req.flash('messages','All fields are mandatory')
                res.redirect(`${process.env.PREFIXPATH}/profile`);
            }
            else{    
                await User.findOneAndUpdate({username: req.session.username}, 
                    {   name:name,email:email,shippingAddress:shippingAddress
                    },
                    {new:true})

                req.flash('profileChange','Profile Changed successfully') ;                          
                res.redirect(`${process.env.PREFIXPATH}/profile`); 
            }     
});


module.exports ={createUser,loginUser,getlogin,getregister,logout,profile,changeProfile}