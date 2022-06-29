const CoordinateDomain = require('../../domain/coordinate');

module.exports=class{

    constructor(repository){
        this.repository=repository;
    }

    async findRecentlyDealsDistinct(coordinate,locationList){
        let result = [];

        let promises=locationList.map(async (info)=>{
            let ssg_cd=info.sgg_cd;
            const deals = await this.repository.findRecentlyDeals(coordinate,ssg_cd)
            result = result.concat(deals);
            
        })
        await Promise.all(promises);
        return result;
    }

    async findMaxMinCoordinate(sgg_cd){
        const max_x = await this.repository.findMaxOne('x',sgg_cd);
        const min_x = await this.repository.findMinOne('x',sgg_cd);
        const max_y = await this.repository.findMaxOne('y',sgg_cd);
        const min_y = await this.repository.findMinOne('y',sgg_cd);

        return new CoordinateDomain(min_x.x,max_x.x,min_y.y,max_y.y);
    }
}