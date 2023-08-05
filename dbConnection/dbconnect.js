const mongoose = require('mongoose');
const Detail = require('../src/models/detail')

const dbconnection = async ()=>{
   await mongoose.connect(process.env.CONNECTION_STRING);
   console.log('connection success but');
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
                            url:`${process.env.PREFIXPATH}`
                        },
                        {
                            label:"Orders",
                            url:`${process.env.PREFIXPATH}/orders`
                        },
                        {
                            label:"Cart",
                            url:`${process.env.PREFIXPATH}/cart`
                        }
                    ],
            })
        }
} 
companyDetail();

module.exports = dbconnection;
//module.exports =details;