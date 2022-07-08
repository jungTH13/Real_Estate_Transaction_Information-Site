const CoordinateDomain = require('../../domain/coordinate');
const RESPONSE = require('../../config/responseState');
const validator = require('./common/validator');

module.exports = class {
    constructor(repository) {
        this.repository = repository;
    }

    async findRecentlyDealsDistinct(coordinate, locationList) {
        try {
            validator.coordinate(coordinate);
            let result = [];

            const promises = locationList.map(async (info) => {
                const ssg_cd = info.sgg_cd;
                const deals = await this.repository.findRecentlyDeals(coordinate, ssg_cd)
                result = result.concat(deals);
            })
            await Promise.all(promises);
            return result;
        } catch (error) {
            RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.DB_FIND_ERROR);
        }
    }

    async findProviousOfRecentlyDeals(coordinate, locationList) {
        const resultRecent = {};
        const resultProvious = {};
        let resultRecentList = [];
        let resultProviousList = [];
        try {
            const promises = locationList.map(async (info) => {
                const sgg_cd = info.sgg_cd;
                const dealsRecent = await this.repository.findRecentlyDeals(coordinate, sgg_cd)
                resultRecent[sgg_cd] = dealsRecent;

                const dealsProvious = await this.repository.findProviousOfRecentlyDeals(dealsRecent, sgg_cd)
                resultProvious[sgg_cd] = dealsProvious;
            })
            await Promise.all(promises);

            for (const info of locationList) {
                resultRecentList = resultRecentList.concat(resultRecent[info.sgg_cd]);
                resultProviousList = resultProviousList.concat(resultProvious[info.sgg_cd]);
            }

            return { resultRecent: resultRecentList, resultProvious: resultProviousList };
        } catch (error) {
            RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.DB_FIND_ERROR);
        }
    }

    async findMaxMinCoordinate(sgg_cd) {
        try {
            const max_x = await this.repository.findMaxOne('x', sgg_cd);
            const min_x = await this.repository.findMinOne('x', sgg_cd);
            const max_y = await this.repository.findMaxOne('y', sgg_cd);
            const min_y = await this.repository.findMinOne('y', sgg_cd);
            if (max_x) {
                return new CoordinateDomain(min_x.x, max_x.x, min_y.y, max_y.y);
            }
            return new CoordinateDomain(min_x, max_x, min_y, max_y);
        } catch (error) {
            return RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.DB_FIND_ERROR_NAME(sgg_cd));
        }
    }
}
