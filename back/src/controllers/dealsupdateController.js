
const RESPONSE =require('../config/responseState');

const DealsUpdateService = require('../application/service/dealsUpdate');
const LocationService = require('../application/service/location');
const LocationFormService = require('../application/service/locationForm');

const LocationRepository = require('../infrastructure/database/repositories/LocationRepositoryMysql');
const LocationFormRepository = require('../infrastructure/database/repositories/LocationFormRepositoryMysql')

exports.update = async (options)=>{
    
    const dealsUpdateService = new DealsUpdateService(options);
    const locationService= new LocationService(new LocationRepository());
    const locationFormService= new LocationFormService(new LocationFormRepository());
    
    try{
        const locationList = await locationService.findAllinfo();

        for(location of locationList){
            await dealsUpdateService.update(location.sgg_cd);
            const coordinate = await locationFormService.findMaxMinCoordinate(location.sgg_cd);
            await locationService.updateCoordinate(coordinate,location.sgg_cd);
        }
    }catch(error){
        console.log(error)
    }
}