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
                const year = new Date().getFullYear();
                const month = new Date().getMonth() + 1;
                const dealsRecentIdList = await this.repository.findRecentlyDealsId(year, month, ssg_cd);
                const dealsRecent = await this.repository.findDealsOfIdCoordinate(dealsRecentIdList, coordinate, ssg_cd);
                result = result.concat(dealsRecent);
            })
            await Promise.all(promises);
            return result;
        } catch (error) {
            RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.DB_FIND_ERROR);
        }
    }

    async findProviousOfRecentlyDeals(coordinate, year, month, locationList) {
        const resultRecent = {};
        const resultProvious = {};
        let resultRecentList = [];
        let resultProviousList = [];
        try {
            const promises = locationList.map(async (info) => {
                const sgg_cd = info.sgg_cd;
                const dealsRecentIdList = await this.repository.findRecentlyDealsId(year, month, sgg_cd);
                const dealsRecent = await this.repository.findDealsOfIdCoordinate(dealsRecentIdList, coordinate, sgg_cd);
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

    async findProviousOfRecentlyDealsByLocationFixed(year, month, location, dong) {
        const sgg_cd = location.sgg_cd;
        try {
            const dealsRecentIdList = await this.repository.findRecentlyDealsId(year, month, sgg_cd);
            const dealsRecent = await this.repository.findDealsOfIdDong(dealsRecentIdList, dong, sgg_cd);

            const dealsProvious = await this.repository.findProviousOfRecentlyDeals(dealsRecent, sgg_cd);

            return { resultRecent: dealsRecent, resultProvious: dealsProvious };
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

    async findMonthlyTradingVolum(coordinate, locationList) {
        validator.coordinate(coordinate);
        const result = {};

        try {
            const promises = locationList.map(async (info) => {
                const sgg_cd = info.sgg_cd;
                const tradingVolum = await this.repository.monthlyTradingVolum(coordinate, sgg_cd);
                // console.log(sgg_cd, tradingVolum.length)
                result[sgg_cd] = tradingVolum;
            })

            await Promise.all(promises);
            // console.log(Object.keys(result));
            return result;
        } catch (error) {
            return RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.DB_FIND_ERROR);
        }
    }

    async findMonthlyTradingVolumByLocationFixed(dong, location) {
        const result = {};
        const sgg_cd = location.sgg_cd;
        try {
            const tradingVolum = await this.repository.monthlyTradingVolumByDong(dong, sgg_cd);
            result[sgg_cd] = tradingVolum;
            return result;
        } catch (error) {
            return RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.DB_FIND_ERROR);
        }
    }

    async findMonthlyTradingAmountAVG(coordinate, locationList) {
        validator.coordinate(coordinate);
        const result = {};

        try {
            const promises = locationList.map(async (info) => {
                const sgg_cd = info.sgg_cd;
                const amountAVG = await this.repository.monthlyTradingAmountAVG(coordinate, sgg_cd);
                result[sgg_cd] = amountAVG;
            })

            await Promise.all(promises);
            return result;
        } catch (error) {
            return RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.DB_FIND_ERROR);
        }
    }

    async findMonthlyTradingAmountAVGByLocationFixed(dong, location) {
        const result = {};
        const sgg_cd = location.sgg_cd;
        try {
            const amountAVG = await this.repository.monthlyTradingAmountAVGByDong(dong, sgg_cd);
            result[sgg_cd] = amountAVG;
            return result;
        } catch (error) {
            return RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.DB_FIND_ERROR);
        }
    }

    async findLocationAndDong(coordinate, locationList) {
        validator.coordinate(coordinate);
        const result = [];

        try {
            const promises = locationList.map(async (info) => {
                const sgg_cd = info.sgg_cd;
                const sgg_nm = info.sgg_nm;
                const dongList = await this.repository.findMatchedDong(coordinate, sgg_cd);
                if (dongList.length) {
                    result.push([sgg_nm]);
                    for (const dong of dongList) {
                        result.push([sgg_nm, dong.dong])
                    }
                }
            })
            await Promise.all(promises);
            result.sort();
            return result;
        } catch (error) {
            return RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.DB_FIND_ERROR);
        }
    }
}
