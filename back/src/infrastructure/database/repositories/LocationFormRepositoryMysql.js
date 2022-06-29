const db = require('../orm/sequelize/models');
const {Op}=require('sequelize');
const Sequelize = require('sequelize');
const RESPONSE = require('../../../config/responseState')
const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/config.json')[env];
const LocationFormrepository = require('../../../application/interface/LocationFormRepository')

module.exports = class extends LocationFormrepository{
    constructor(database=db){
        super();
        this.models = database.LocationForm;
    }

    async insertDeals(deals,sgg_cd){
        await this.models[sgg_cd].bulkCreate(deals)
        .then(()=>{
            return RESPONSE.SUCCESS;
        })
    }

    async deleteDeals(house_type,Year,Month,ssg_cd){
        await this.models[ssg_cd].destroy({
            where:{
                house_type : house_type,
                deal_year : Year,
                deal_month : Month,
            }
        })
        .then(()=>{
            return RESPONSE.SUCCESS;
        })
    }

    async findAll(ssg_cd){
        return await this.models[ssg_cd].findAll();
    }

    async findOne(ormOptions,sgg_cd){
        return await this.models[sgg_cd].findOne(ormOptions);
    }

    async findRecentlyDealOnType(hous_type,sgg_cd){
        return await this.models[sgg_cd].findOne({
            where:{house_type: hous_type},
            order:[['deal_year','DESC'],['deal_month','DESC'],['deal_day','DESC']]
        })
    }

    async findRecentlyDeals(coordinate,ssg_cd){
        //좌표기준 건물의 거래 내역중 가장 최근 거래 내역 한개만을 표시(house_type 무시)
        const table = this.models[ssg_cd];
        return await table.findAll({
            where:{
                id:{[Op.in]:[Sequelize.literal(`select max(id) as id from`+(config.dialect == 'sqlite'?` '${ssg_cd}' ` :` ${config.database}.${ssg_cd} `)+`group by dong,name`)]},
                x:{[Op.and]:[{[Op.gt]:coordinate.min_x},{[Op.lt]:coordinate.max_x}]},
                y:{[Op.and]:[{[Op.gt]:coordinate.min_y},{[Op.lt]:coordinate.max_y}]}
            },
                    raw:true
                })
    }

    async findMaxOne(attribute,sgg_cd){
        return await this.models[sgg_cd].findOne({order:[[`${attribute}`,'DESC']]});
    }

    async findMinOne(attribute,sgg_cd){
        let options = {
            where:{},
            order:[[`${attribute}`]]
        }
        options.where[`${attribute}`]={[Op.gt]:0};
        return await this.models[sgg_cd].findOne(options);
    }

    async bulkCreate(deals,sgg_cd){
        return await this.models[sgg_cd].bulkCreate(deals);
    }
}