const createLocationTable = require('./createLocationTable');
const locationInsert = require('./locationInsert');
const RESPONSE =require('../../config/responseState');
const insertDeal = require('./insertDeal');
const {locationXYupdate}=require('../services/apiInfoUpdateType1')
const dbBase=require('../../models')
const apiInfo = require('../../config/apiInfo');
const {selectAll, selectRecentlyDeal} =require('../services/searchDatabase');

const sync = (db=dbBase)=> {
    return new Promise((resolve,reject)=>{
                db.sequelize.sync({alter:false})
                .then(()=>{
                    //console.log("데이터베이스 동기화");
                    resolve(RESPONSE.SUCCESS);
                })
                .catch((error)=>{
                    err=RESPONSE.DB_ERROR;
                    err.message=error;
                    console.error(err);
                    reject(err);
                })
            }
        )
};

const start=async(db=dbBase)=>{
    let result = await sync(db);
    const locations = apiInfo.locationInfo;

    if(result.state){
        result = await locationInsert(locations);

        if(result.state){
            console.log("Location 지역정보 삽입 완료")
            result = await createLocationTable(db.Location,db);

            if(result.state){
                console.log("Location 지역에 따른 테이블 생성 완료")
                await sync(db);
                result.db=db;
            }
        }
    }
    return result;
}

const update=async(db=dbBase)=>{
    try{
        console.log("데이터베이스 실거래정보 업데이트 시작")
        Location=db.Location;
        LocationFormList=await Location.findAll({attributes:['sgg_cd']});

        for(LocationFormName of LocationFormList){
            let sgg_cd=LocationFormName.sgg_cd;

            await insertDeal.type1(db.LocationForm[sgg_cd],sgg_cd)
            .then(async res=>await RESPONSE.errorCheckAndraise(res));

            await locationXYupdate(Location,db.LocationForm[sgg_cd],sgg_cd)
            .then(async res=>await RESPONSE.errorCheckAndraise(res));
        }
        console.log("데이터베이스 실거래정보 업데이트 완료")
        return RESPONSE.SUCCESS;

    }catch(error){
        return RESPONSE.tryCatchError(error,RESPONSE.DB_API_SYNC_ERROR)
    }
    
}

const searchAll=async(name,db=dbBase)=>{
    if(name=='Location')
        return await selectAll(db.Location);
    else if(db.LocationForm[name]){
        return await selectAll(db.LocationForm[name]);
    }else{
        console.error(RESPONSE.DB_TABLE_SELECT_ERROR);
        return;
    }
}

const searchRecentlyDealByCoordinate=async(name,coordinate,db=dbBase)=>{
    if(db.LocationForm[name] ){
        return await selectRecentlyDeal(db.LocationForm[name],coordinate);
    }else{
        console.error(RESPONSE.DB_TABLE_SELECT_ERROR);
        return;
    }
}


module.exports={sync,start,update,searchAll,searchRecentlyDealByCoordinate};