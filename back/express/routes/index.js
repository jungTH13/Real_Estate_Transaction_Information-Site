const express =require('express')
const {getRecentDealList} = require('../controller/getDealList')

const router = express.Router()


router.post('/deal',async(req,res,next)=>{
    if(req.body.mapState){
        let result = await getRecentDealList(req.body.mapState);
        if(result.state){
            console.log(result.data.length);
            res.json({status:200,data:result.data});
        }else{
            if(result.code>=5000 && result.code< 6000){
                console.log("[validator] ",result);
            }
            res.status(500);
            res.json({status:500});
        }
    }
    else{
        console.log("[POST]'/deal'요청에서 mapState 정보가 존재하지 안습니다.")
        res.status(500);
        res.json({status:500});
    }
    
})


module.exports=router;