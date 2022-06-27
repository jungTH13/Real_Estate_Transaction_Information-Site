const {Op} = require('sequelize')
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.json')[env];

module.exports=class{

    constructor(repository){
        this.repository=repository;
    }

    async findRecentlyDealsDistinct(coordinate,locationList){
        let result = [];

        let promises=locationList.map(async (info)=>{
            let ssg_cd=info.sgg_cd;
            result = result.concat(await this.repository.findRecentlyDeals(coordinate,ssg_cd));
            
            // await this.repository.findAll({
            //     where:{
            //         id:{[Op.in]:[Sequelize.literal(`select max(id) as id from`+` ${config.database}.${ssg_cd} `+`group by dong,name`)]},
            //         x:{[Op.and]:[{[Op.gt]:coordinate.min_x},{[Op.lt]:coordinate.max_x}]},
            //         y:{[Op.and]:[{[Op.gt]:coordinate.min_y},{[Op.lt]:coordinate.max_y}]}
            //     },
            //     raw:true
            // },ssg_cd).then((res)=>{
            //     result = result.concat(res);
            // })
        })
        await Promise.all(promises);
        return result;
    }
}