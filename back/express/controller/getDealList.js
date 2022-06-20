const RESPONSE =require('../../config/responseState');
const {searchRecentDeal}=require('../services/searchDealList')
const validators=require('../validators')

const getRecentDealList = async(mapState)=>{
    //유효성 검사
    let valid=validators.mapState(mapState);

    if(valid.state){
        const coordinate={
            min_x: mapState.bounds.min.x,
            max_x: mapState.bounds.max.x,
            min_y: mapState.bounds.min.y,
            max_y: mapState.bounds.max.y
        }
        if(coordinate.min_x<coordinate.max_x && coordinate.min_y<coordinate.max_y){
            console.log("controller:getRecentDealList 실행")
            let result = await searchRecentDeal(coordinate);
            console.log(coordinate);
            return result;
        } else{
            return RESPONSE.VALIDATE_TYPE_ERROR;
        }
    }else{
        return valid;
    }
    
};

module.exports={getRecentDealList};