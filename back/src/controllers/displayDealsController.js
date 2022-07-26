const LocationService = require('../application/service/location');
const LocationFormService = require('../application/service/locationForm');

const RESPONSE = require('../config/responseState');

exports.RecentlyDeals = async (options) => {
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
        return await locationFormService.findRecentlyDealsDistinct(coordinate, locationList);
    } catch (error) {
        RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.CONTROLLER_ERROR_NAME('RecentlyDeals'))
    }
}

exports.ProviousOfRecentlyDeals = async (options) => {
    const locationService = new LocationService(options.locationRepository);
    const locationFormService = new LocationFormService(options.locationFormRepository);
    const coordinate = {
        min_x: options.body.bounds.min.x,
        min_y: options.body.bounds.min.y,
        max_x: options.body.bounds.max.x,
        max_y: options.body.bounds.max.y
    }
    const Zoom = options.body.Zoom;
    const year = options.body.year || new Date().getFullYear();
    const month = options.body.month || new Date().getMonth() + 1;

    try {
        const locationList = await locationService.findIncluedArea(coordinate, Zoom);
        return await locationFormService.findProviousOfRecentlyDeals(coordinate, year, month, locationList);
    } catch (error) {
        RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.CONTROLLER_ERROR_NAME('ProviousOfRecentlyDeals'))
    }
}
