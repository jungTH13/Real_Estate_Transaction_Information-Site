const validator = require('./common/validator');
const RESPONSE = require('../../config/responseState');

module.exports = class {
    constructor(repository) {
        this.repository = repository;
    }

    async findIncluedArea(coordinate) {
        try {
            validator.coordinate(coordinate);
            const locationList = await this.repository.findAll();
            const result = [];
            for (const L of locationList) {
                if (
                    (L.max_x >= coordinate.min_x && L.min_y <= coordinate.max_y) &&
                    (L.min_x <= coordinate.max_x && L.max_y >= coordinate.min_y)) {
                    result.push(L);
                }
            }
            return result;
        } catch (error) {
            return RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.DB_FIND_ERROR);
        }
    }

    async updateCoordinate(coordinate, sgg_cd) {
        try {
            return await this.repository.XYupdate(coordinate, sgg_cd);
        } catch (error) {
            RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.DB_TABLE_UPDATE_ERROR);
        }
    }

    async findAllinfo() {
        try {
            return await this.repository.findAll();
        } catch (error) {
            RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.DB_FIND_ERROR);
        }
    }

    async findOneByName(location) {
        try {
            return await this.repository.findOneByName(location);
        } catch (error) {
            RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.DB_FIND_ERROR);
        }
    }
}
