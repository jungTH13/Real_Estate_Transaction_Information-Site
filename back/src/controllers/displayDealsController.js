const LocationService = require('../application/service/location');
const LocationFormService = require('../application/service/locationForm');

const LocationRepository = require('../infrastructure/database/repositories/LocationRepositoryMysql');
const LocationFormRepository = require('../infrastructure/database/repositories/LocationFormRepositoryMysql')

exports.basic = async (options) => {
    const locationService = new LocationService(options.locationRepository || new LocationRepository());
    const locationFormService = new LocationFormService(options.locationFormRepository || new LocationFormRepository());
    const coordinate = {
        min_x: options.body.bounds.min.x,
        min_y: options.body.bounds.min.y,
        max_x: options.body.bounds.max.x,
        max_y: options.body.bounds.max.y
    }

    try {
        const locationList = await locationService.findIncluedArea(coordinate);
        return await locationFormService.findRecentlyDealsDistinct(coordinate, locationList)
    } catch (error) {
        console.log(error)
    }
}
