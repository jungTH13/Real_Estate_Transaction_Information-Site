const RESPONSE =require('../../config/responseState');
const db_controller = require('../../dbms/db_controller');

const searchRecentDeal = async(coordinate)=>{
    try{
        const locationList =  await db_controller.searchAll('Location');
        let result=[];
        const promises = locationList.map(async (L) =>{
            if((L.min_x<=coordinate.min_x &&L.max_x>=coordinate.min_x) ||
                (L.min_x<=coordinate.max_x &&L.max_x>=coordinate.max_x)){

                    if((L.min_y<=coordinate.min_y&&L.max_y>=coordinate.min_y) ||
                        (L.min_y<=coordinate.max_y&&L.max_y>=coordinate.max_y)){
                            //해당 테이블에서 포함되는 거래정보를 찾고 리스트에 넣는다
                   
                            await db_controller.searchRecentlyDealByCoordinate(L.sgg_cd,coordinate)
                            .then((res)=>{
                                if(res){
                                    result=result.concat(res);
                                }
                            })
                            
                    }
            }
        })
        await Promise.all(promises);
        let res = RESPONSE.SUCCESS;
        res.data=result;
        return res;

    } catch(error){
        return RESPONSE.tryCatchError(error,RESPONSE.DB_SELECT_ERROR)
    }
}

module.exports={searchRecentDeal};