const express =require('express')
const {getRecentDealList} = require('../controller/getDealList')

const router = express.Router()


router.post('/deal',async(req,res,next)=>{
    if(req.body.mapState){
        let result = await getRecentDealList(req.body.mapState);
        console.log(result.length);
        res.json({status:200,data:result});
    }
    else{
        res.json({status:500});
    }
    
})


module.exports=router;