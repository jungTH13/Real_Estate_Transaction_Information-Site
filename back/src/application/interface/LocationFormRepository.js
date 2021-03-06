module.exports = class {
    async insertDeals(deals, sgg_cd) {
        // deals = [domain.deal, ...]
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async deleteDeals(house_type, Year, Month, ssg_cd) {
        // options = {Year,Month,hous_type}
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async findAll(ssg_cd) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async findOne(ormOptions, sgg_cd) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async findDealsYM(year, month, name, sgg_cd) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async findProviousDealOne(deal, sgg_cd) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async findRecentlyDealOnType(hous_type, sgg_cd) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async findRecentlyDealsId(year, month, ssg_cd) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async findDealsOfId(idList, ssg_cd) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async findDealsOfIdCoordinate(idList, coordinate, ssg_cd) {
        // coordinate = {min_x,min_y,max_x,max_y}
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async findDealsOfIdDong(idList, dong, ssg_cd) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async findMaxOne(attribute, sgg_cd) {
        // only [int,float] type attribute is available
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async findMinOne(attribute, sgg_cd) {
        // only [int,float] type attribute is available
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async bulkCreate(deals, ssg_cd) {
        // deals = [deal,deal, ...]
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async monthlyTradingVolum(coordinate, sgg_cd) {
        // coordinate = {min_x,min_y,max_x,max_y}
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async monthlyTradingVolumByDong(dong, sgg_cd) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async monthlyTradingAmountAVG(coordinate, sgg_cd) {
        // coordinate = {min_x,min_y,max_x,max_y}
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async monthlyTradingAmountAVGByDong(coordinate, sgg_cd) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async findMatchedDong(coordinate, sgg_cd) {
        // coordinate = {min_x,min_y,max_x,max_y}
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    async findDealInfo(dong, name, sgg_cd) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }
}
