const Detail = require('../models/detail');
const MenuDetailService ={};

MenuDetailService.Detail= async()=>{
    const detail = await Detail.findOne(); 

    return detail;
}

module.exports = MenuDetailService;