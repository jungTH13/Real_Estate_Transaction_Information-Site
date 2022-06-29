module.exports = class {
    constructor(locationRepository, locationFormRepository, url, dealsApi, mapApi) {
        this.locationRepository = locationRepository;
        this.locationFormRepository = locationFormRepository;
        this.url = url;
        this.dealsApi = dealsApi;
        this.mapApi = mapApi;
    }
}
