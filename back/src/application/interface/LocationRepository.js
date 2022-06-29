module.exports = class Location {
    async findAll() {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async findOne(sgg_cd) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async XYupdate(coordinate, sgg_cd) {
        // coordinate = {min_x,min_y,max_x,max_y}
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }
}
