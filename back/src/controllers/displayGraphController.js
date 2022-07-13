const LocationService = require('../application/service/location');
const LocationFormService = require('../application/service/locationForm');

const RESPONSE = require('../config/responseState');

exports.monthlyTradingVolum = async (options) => {
    const locationService = new LocationService(options.locationRepository);
    const locationFormService = new LocationFormService(options.locationFormRepository);
    const coordinate = {
        min_x: options.body.bounds.min.x,
        min_y: options.body.bounds.min.y,
        max_x: options.body.bounds.max.x,
        max_y: options.body.bounds.max.y
    }

    try {
        const locationList = await locationService.findIncluedArea(coordinate);
        return await locationFormService.findMonthlyTradingVolum(coordinate, locationList);
    } catch (error) {
        RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.CONTROLLER_ERROR_NAME('monthlyTradingVolum'))
    }
}

exports.monthlyTradingAmountAVG = async (options) => {
    const locationService = new LocationService(options.locationRepository);
    const locationFormService = new LocationFormService(options.locationFormRepository);
    const coordinate = {
        min_x: options.body.bounds.min.x,
        min_y: options.body.bounds.min.y,
        max_x: options.body.bounds.max.x,
        max_y: options.body.bounds.max.y
    }

    try {
        const locationList = await locationService.findIncluedArea(coordinate);
        return await locationFormService.findMonthlyTradingAmountAVG(coordinate, locationList);
    } catch (error) {
        RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.CONTROLLER_ERROR_NAME('monthlyTradingAmountAVG'))
    }
}
