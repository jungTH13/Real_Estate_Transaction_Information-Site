const DealsUpdateService = require('../application/service/dealsUpdate');
const LocationService = require('../application/service/location');
const LocationFormService = require('../application/service/locationForm');

const LocationRepository = require('../infrastructure/database/repositories/LocationRepositoryMysql');
const LocationFormRepository = require('../infrastructure/database/repositories/LocationFormRepositoryMysql')

const RESPONSE = require('../config/responseState');
const { logger } = require('../config/winston');

exports.update = async (options) => {
    const dealsUpdateService = new DealsUpdateService(options);
    const locationService = new LocationService(options.locationRepository || new LocationRepository());
    const locationFormService = new LocationFormService(options.locationFormRepository || new LocationFormRepository());

    try {
        const locationList = await locationService.findAllinfo();

        for (location of locationList) {
            await dealsUpdateService.update(location.sgg_cd);
            const coordinate = await locationFormService.findMaxMinCoordinate(location.sgg_cd);
            await locationService.updateCoordinate(coordinate, location.sgg_cd);
        }
        logger.info('database update가 정상적으로 종료되었습니다.')
    } catch (error) {
        RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.CONTROLLER_ERROR_NAME('update'));
    }
}
