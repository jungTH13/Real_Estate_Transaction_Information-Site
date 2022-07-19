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

    async findDealsOfIdDong(idList, dong, ssg_cd) {
        // 좌표기준 건물의 거래 내역중 가장 최근 거래 내역 한개만을 표시(house_type 무시)
        const table = this.models[ssg_cd];
        const options = {
            where: {
                id: { [Op.in]: idList }
            },
            order: [['provious', 'ASC']],
            raw: true
        }

        if (dong) {
            options.where.dong = dong;
        }
        const results = await table.findAll(options)
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

    async monthlyTradingVolum(coordinate, sgg_cd) {
        return await this.models[sgg_cd].findAll({
            attributes: ['dong', 'deal_year', 'deal_month', [this.sequelize.fn('COUNT', this.sequelize.col('house_type')), 'count'],
                [this.sequelize.literal('COUNT(case when house_type=\'아파트\' then 1 end)'), '아파트'],
                [this.sequelize.literal('COUNT(case when house_type=\'연립다세대\' then 1 end)'), '연립다세대'],
                [this.sequelize.literal('COUNT(case when house_type=\'오피스텔\' then 1 end)'), '오피스텔']
            ],
            where: {
                x: { [Op.and]: [{ [Op.gt]: coordinate.min_x }, { [Op.lt]: coordinate.max_x }] },
                y: { [Op.and]: [{ [Op.gt]: coordinate.min_y }, { [Op.lt]: coordinate.max_y }] }
            },
            group: ['dong', 'deal_year', 'deal_month'],
            order: ['dong', 'deal_year', 'deal_month'],
            raw: true
        })
    }

    async monthlyTradingVolumByDong(dong, sgg_cd) {
        const options = {
            attributes: ['dong', 'deal_year', 'deal_month', [this.sequelize.fn('COUNT', this.sequelize.col('house_type')), 'count'],
                [this.sequelize.literal('COUNT(case when house_type=\'아파트\' then 1 end)'), '아파트'],
                [this.sequelize.literal('COUNT(case when house_type=\'연립다세대\' then 1 end)'), '연립다세대'],
                [this.sequelize.literal('COUNT(case when house_type=\'오피스텔\' then 1 end)'), '오피스텔']
            ],
            where: {},
            group: ['dong', 'deal_year', 'deal_month'],
            order: ['dong', 'deal_year', 'deal_month'],
            raw: true
        }
        if (dong) {
            options.where.dong = dong;
        }
        return await this.models[sgg_cd].findAll(options)
    }

    async monthlyTradingAmountAVG(coordinate, sgg_cd) {
        return await this.models[sgg_cd].findAll({
            attributes: ['dong', 'deal_year', 'deal_month',
                [this.sequelize.literal('SUM(case when house_type=\'아파트\' then deal_amount end)'), '아파트amount'],
                [this.sequelize.literal('sum(case when house_type=\'아파트\' then area end)'), '아파트area'],
                [this.sequelize.literal('SUM(case when house_type=\'연립다세대\' then deal_amount end)'), '연립다세대amount'],
                [this.sequelize.literal('sum(case when house_type=\'연립다세대\' then area end)'), '연립다세대area'],
                [this.sequelize.literal('SUM(case when house_type=\'오피스텔\' then deal_amount end)'), '오피스텔amount'],
                [this.sequelize.literal('sum(case when house_type=\'오피스텔\' then area end)'), '오피스텔area']
            ],
            where: {
                x: { [Op.and]: [{ [Op.gt]: coordinate.min_x }, { [Op.lt]: coordinate.max_x }] },
                y: { [Op.and]: [{ [Op.gt]: coordinate.min_y }, { [Op.lt]: coordinate.max_y }] }
            },
            group: ['dong', 'deal_year', 'deal_month'],
            order: ['dong', 'deal_year', 'deal_month'],
            raw: true
        })
    }

    async monthlyTradingAmountAVGByDong(dong, sgg_cd) {
        const options = {
            attributes: ['dong', 'deal_year', 'deal_month',
                [this.sequelize.literal('SUM(case when house_type=\'아파트\' then deal_amount end)'), '아파트amount'],
                [this.sequelize.literal('sum(case when house_type=\'아파트\' then area end)'), '아파트area'],
                [this.sequelize.literal('SUM(case when house_type=\'연립다세대\' then deal_amount end)'), '연립다세대amount'],
                [this.sequelize.literal('sum(case when house_type=\'연립다세대\' then area end)'), '연립다세대area'],
                [this.sequelize.literal('SUM(case when house_type=\'오피스텔\' then deal_amount end)'), '오피스텔amount'],
                [this.sequelize.literal('sum(case when house_type=\'오피스텔\' then area end)'), '오피스텔area']
            ],
            where: {},
            group: ['dong', 'deal_year', 'deal_month'],
            order: ['dong', 'deal_year', 'deal_month'],
            raw: true
        }
        if (dong) {
            options.where.dong = dong;
        }
        return await this.models[sgg_cd].findAll(options)
    }

    async findMatchedDong(coordinate, sgg_cd) {
        return await this.models[sgg_cd].findAll({
            attribute: ['dong'],
            where: {
                x: { [Op.and]: [{ [Op.gt]: coordinate.min_x }, { [Op.lt]: coordinate.max_x }] },
                y: { [Op.and]: [{ [Op.gt]: coordinate.min_y }, { [Op.lt]: coordinate.max_y }] }
            },
            group: ['dong'],
            order: ['dong']
        })
    }

    async findDealInfo(dong, name, sgg_cd) {
        return await this.models[sgg_cd].findAll({
            where: {
                name,
                dong
            },
            order: [['deal_year', 'DESC'], ['deal_month', 'DESC'], ['deal_day', 'DESC']]
        })
    }
}
