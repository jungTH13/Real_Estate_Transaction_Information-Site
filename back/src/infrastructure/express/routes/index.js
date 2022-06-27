const express =require('express')
const displayDealsController = require('../../../controllers/displayDealsController');

const router = express.Router()


router.post('/deal',async(req,res,next)=>{

    const result = await displayDealsController.basic({
        body:req.body.mapState
    })
    console.log("검색된 자료수:",result.length)
    res.json({status:200,data:result});
})

module.exports=router;