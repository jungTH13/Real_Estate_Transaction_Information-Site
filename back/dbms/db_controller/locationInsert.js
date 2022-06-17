const Location=require('../../models/location');
const RESPONSE =require('../../config/responseState');


module.exports=async (locations)=>{//location 테이블의 지역리스트 update

    try{
        locations.forEach(async (L) => {
            await Location.findOrCreate({
                where: {sgg_cd : L.sgg_cd},
                defaults:{
                    location: L.location,
                    sgg_nm: L.sgg_nm,
                    url: L.url,
                    key_type: L.key_type,
                }
            })
        });
    } catch(error){
        let err = RESPONSE.DB_INSERT_ERROR("location");
        err.info=error;
        console.error(err);
        return err;
    }

    return RESPONSE.SUCCESS;
}