const mongoose = require('mongoose');
const Detail = require('../src/models/detail')

const dbconnection = async ()=>{
   await mongoose.connect(process.env.CONNECTION_STRING);
   console.log('connection success');
};

const companyDetail = async ()=>{
    const details = await Detail.find();
    //console.log("details",details);
    if(!details.length>0){
            await Detail.create({
                brandName:"Assesment",
                brandIconUrl:"/static/images/logo.png",
                links:[
                        {
                            label:"Home",
                            url:`${process.env.PREFIXPATH}`,
                            icon:''
                        },
                        {
                            label:"Orders",
                            url:`${process.env.PREFIXPATH}/orders`,
                            icon:''
                        },
                        {
                            label:"Cart",
                            url:`${process.env.PREFIXPATH}/cart`,
                            icon:"/static/images/cart.png"
                        }
                    ],
            })
        }
} 
companyDetail();

module.exports = dbconnection;
//module.exports =details;