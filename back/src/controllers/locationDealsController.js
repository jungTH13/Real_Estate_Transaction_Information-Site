const LocationService = require('../application/service/location');
const LocationFormService = require('../application/service/locationForm');

const RESPONSE = require('../config/responseState');

exports.searchLocationAndDong = async (options) => {
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
        return await locationFormService.findLocationAndDong(coordinate, locationList);
    } catch (error) {
        RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.CONTROLLER_ERROR_NAME('searchLocationAndDong'))
    }
}

exports.ProviousOfRecentlyDeals = async (options) => {
    const locationService = new LocationService(options.locationRepository);
    const locationFormService = new LocationFormService(options.locationFormRepository);
    const locationName = options.body.location[0];
    const locationDong = options.body.location[1];
    const year = options.body.year || new Date().getFullYear();
    const month = options.body.month || new Date().getMonth() + 1;
    try {
        const location = await locationService.findOneByName(locationName);
        return await locationFormService.findProviousOfRecentlyDealsByLocationFixed(year, month, location, locationDong);
    } catch (error) {
        RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.CONTROLLER_ERROR_NAME('ProviousOfRecentlyDeals'))
    }
}

exports.monthlyTradingVolum = async (options) => {
    const locationService = new LocationService(options.locationRepository);
    const locationFormService = new LocationFormService(options.locationFormRepository);
    const locationName = options.body.location[0];
    const locationDong = options.body.location[1];
    try {
        const location = await locationService.findOneByName(locationName);
        return await locationFormService.findMonthlyTradingVolumByLocationFixed(locationDong, location);
    } catch (error) {
        RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.CONTROLLER_ERROR_NAME('monthlyTradingVolum'))
    }
}

exports.monthlyTradingAmountAVG = async (options) => {
    const locationService = new LocationService(options.locationRepository);
    const locationFormService = new LocationFormService(options.locationFormRepository);
    const locationName = options.body.location[0];
    const locationDong = options.body.location[1];
    try {
        const location = await locationService.findOneByName(locationName);
        return await locationFormService.findMonthlyTradingAmountAVGByLocationFixed(locationDong, location);
    } catch (error) {
        RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.CONTROLLER_ERROR_NAME('monthlyTradingAmountAVG'))
    }
}

exports.selectDealInfo = async (options) => {
    const locationService = new LocationService(options.locationRepository);
    const locationFormService = new LocationFormService(options.locationFormRepository);
    const locationName = options.body.location[0];
    const locationDong = options.body.location[1];
    const dealName = options.body.location[2];
    try {
        const location = await locationService.findOneByName(locationName);
        return await locationFormService.findDealInfo(locationDong, dealName, location);
    } catch (error) {
        RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.CONTROLLER_ERROR_NAME('selectDealInfo'))
    }
}
