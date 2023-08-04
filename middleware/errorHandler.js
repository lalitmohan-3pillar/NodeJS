const { constant } = require("../src/constant");

const errorHandler =(err,req,res,next)=>{
    const statusCode =res.statusCode ? res.statusCode : 500;

    switch (statusCode) {
        case constant.VALIDATION_ERROR:
            res.json({
                Title :"validation error",
                message: err.message ,
                stackTrace : err.stack
            })
            break;
        case constant.NOT_FOUND:
            res.json({
                Title :"Not found",
                message: err.message ,
                stackTrace : err.stack
            })
            break;
        default:
            res.json({
                Title :"Something went wrong",
                message: err.message ,
                stackTrace : err.stack
            })
            break;
    }
    
};

module.exports = errorHandler;