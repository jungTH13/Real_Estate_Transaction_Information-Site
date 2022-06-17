const RESPONSE =require('../../config/responseState');

module.exports=async (Location,db,LocationForm = require('../../models/locationForm'))=>{

    const list= await Location.findAll();
    try{
        if(list){
            list.forEach((L)=>{
                const LocationSpot = LocationForm(L.sgg_cd);
                LocationSpot.init(db.sequelize);
                db.LocationForm[L.sgg_cd]=LocationSpot;
            });
        };
        return RESPONSE.SUCCESS;
    }catch (error){
        let err = RESPONSE.DB_CREATE_ERROR;
        err.info=error;
        console.error(err);
        return err;
    }
};