const db = require('../orm/sequelize/models');
const { Op } = require('sequelize');
// const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/config.json')[env];
const LocationFormrepository = require('../../../application/interface/LocationFormRepository')

module.exports = class extends LocationFormrepository {
    constructor(database = db) {
        super();
        this.models = database.LocationForm;
        this.sequelize = database.sequelize;
        if (!global.repositorybuffer) {
            global.repositorybuffer = {};
        }
        this.buffer = global.repositorybuffer
    }

    async initMemory() {
        delete global.globalLocationFormRepositoryMemory;
    }

    async insertDeals(deals, sgg_cd) {
        return await this.models[sgg_cd].bulkCreate(deals)
    }

    async deleteDeals(house_type, Year, Month, ssg_cd) {
        return await this.models[ssg_cd].destroy({
            where: {
                house_type,
                deal_year: Year,
                deal_month: Month
            }
        })
    }

    async findAll(ssg_cd) {
        return await this.models[ssg_cd].findAll();
    }

    async findOne(ormOptions, sgg_cd) {
        return await this.models[sgg_cd].findOne(ormOptions);
    }

    async findDealsYM(year, month, name, sgg_cd) {
        return await this.models[sgg_cd].findAll({
            where: {
                deal_year: year,
                deal_month: month,
                house_type: name
            },
            raw: true
        })
    }

    async findProviousDealOne(deal, sgg_cd) {
        const limit = 3
        return await this.models[sgg_cd].findOne({
            where: {
                name: deal.name,
                area: { [Op.and]: [{ [Op.gte]: Math.floor(deal.area) }, { [Op.lt]: Math.floor(deal.area) + 1 }] },
                dong: deal.dong,
                house_type: deal.house_type,
                [Op.or]: [
                    { deal_year: { [Op.lt]: deal.deal_year } }, {
                        [Op.and]: [
                            { deal_year: deal.deal_year },
                            { deal_month: { [Op.lt]: deal.deal_month } }
                        ]
                    }
                ],
                floor: (deal.floor >= 0 ? { [Op.and]: [{ [Op.gte]: (deal.floor - limit > 0 ? deal.floor - limit : 1) }, { [Op.lte]: deal.floor + limit }] } : { [Op.lt]: 0 })
            },
            order: [['deal_year', 'DESC'], ['deal_month', 'DESC'], ['deal_day', 'DESC']]
        });
    }

    async findRecentlyDealOnType(hous_type, sgg_cd) {
        return await this.models[sgg_cd].findOne({
            where: { house_type: hous_type },
            order: [['deal_year', 'DESC'], ['deal_month', 'DESC'], ['deal_day', 'DESC']]
        })
    }

    async findRecentlyDealsId(year, month, ssg_cd) {
        // 좌표기준 건물의 거래 내역중 가장 최근 거래 내역 한개만을 표시(house_type 무시)
        if (!this.buffer[ssg_cd]) {
            this.buffer[ssg_cd] = {};
        }
        if (this.buffer[ssg_cd][`${year}${month}`]) {
            const idList = this.buffer[ssg_cd][`${year}${month}`];
            const maxIdDeal = await this.findMaxOne('id', ssg_cd);
            if (idList[idList.length - 1] === maxIdDeal.id) {
                return idList;
            }
        }

        const results = await this.sequelize.query(
            `select max(id) as id 
            from (SELECT * FROM` + (config.dialect === 'sqlite' ? ` '${ssg_cd}' ` : ` ${config.database}.${ssg_cd} `) +
            `WHERE deal_year < ${year} OR (deal_year = ${year} AND deal_month <= ${month})) AS a
            group by dong,name
            order by id`,
            { type: this.sequelize.QueryTypes.SELECT })
        const idList = []
        for (const id of results) {
            idList.push(id.id);
        }
        this.buffer[ssg_cd][`${year}${month}`] = idList;
        return idList
    }

    async findDealsOfIdCoordinate(idList, coordinate, ssg_cd) {
        // 좌표기준 건물의 거래 내역중 가장 최근 거래 내역 한개만을 표시(house_type 무시)
        const table = this.models[ssg_cd];
        const results = await table.findAll({
            where: {
                id: { [Op.in]: idList },
                x: { [Op.and]: [{ [Op.gt]: coordinate.min_x }, { [Op.lt]: coordinate.max_x }] },
                y: { [Op.and]: [{ [Op.gt]: coordinate.min_y }, { [Op.lt]: coordinate.max_y }] }
            },
            order: [['provious', 'ASC']],
            raw: true
        })
        return results;
    }

    async findProviousOfRecentlyDeals(deals, ssg_cd) {
        // 좌표기준 건물의 거래 내역중 가장 최근 거래 내역 한개만을 표시(house_type 무시)
        const idList = [];
        const table = this.models[ssg_cd];

        for (const deal of deals) {
            idList.push(deal.provious);
        }
        const results = await table.findAll({
            where: {
                id: { [Op.in]: idList }
            },
            raw: true
        })
        return results;
    }

    async findMaxOne(attribute, sgg_cd) {
        return await this.models[sgg_cd].findOne({ order: [[`${attribute}`, 'DESC']] });
    }

    async findMinOne(attribute, sgg_cd) {
        const options = {
            where: {},
            order: [[`${attribute}`]]
        }
        options.where[`${attribute}`] = { [Op.gt]: 0 };
        return await this.models[sgg_cd].findOne(options);
    }

    async bulkCreate(deals, sgg_cd) {
        return await this.models[sgg_cd].bulkCreate(deals);
    }
}
