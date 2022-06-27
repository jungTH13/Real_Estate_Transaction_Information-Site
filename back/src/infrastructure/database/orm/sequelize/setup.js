const RESPONSE =require('../../../../config/responseState');

exports.insertLocationFormTableInfo=async (Location,locations)=>{
    //location 테이블의 지역리스트 update
    try{
        const promises = locations.map(async (L) => {
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

        await Promise.all(promises);

        return RESPONSE.SUCCESS;
    } catch(error){
        let err = RESPONSE.DB_INSERT_ERROR("location");
        err.info=error;
        console.error(err);
        return err;
    }
}

exports.createLocationFormTable=async(db,LocationForm)=>{
    //location 테이블에 있는 지역구 테이블을 생성
    const Location = db.Location;
    const list= await Location.findAll();
    try{
        if(list){
            const promises = list.map((L)=>{
                const LocationSpot = LocationForm(L.sgg_cd);
                LocationSpot.init(db.sequelize);
                db.LocationForm[L.sgg_cd]=LocationSpot;
            });
            Promise.all(promises);
        };
        return RESPONSE.SUCCESS;
    }catch (error){
        let err = RESPONSE.DB_CREATE_ERROR;
        err.info=error;
        console.error(err);
        return err;
    }
}