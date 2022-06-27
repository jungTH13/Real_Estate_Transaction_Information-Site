const DealsUpdate = require('../application/service/dealsUpdate');
const RESPONSE =require('../config/responseState');


exports.update = async (options)=>{
    
    const dealUpdate = new DealsUpdate(options);
    
    try{
        console.log(await dealUpdate.update());
        return RESPONSE.SUCCESS;
    }catch{

    }
}