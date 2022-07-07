const db = require('../orm/sequelize/models');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../../../config/config.json')[env];
const LocationFormrepository = require('../../../application/interface/LocationFormRepository')

module.exports = class extends LocationFormrepository {
    constructor(database = db) {
        super();
        this.models = database.LocationForm;
        this.sequelize = database.sequelize;
        if (!global.globalLocationFormRepositoryMemory) {
            global.globalLocationFormRepositoryMemory = {
                findRecentlyDeals: {},
                findProviousOfRecentlyDeals: {}
            };
        }
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
                            { deal_month: { [Op.lte]: deal.deal_month } },
                            { deal_day: { [Op.lt]: deal.deal_day } }
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

    async findRecentlyDeals(coordinate, ssg_cd) {
        // 좌표기준 건물의 거래 내역중 가장 최근 거래 내역 한개만을 표시(house_type 무시)
        if (!globalLocationFormRepositoryMemory.findRecentlyDeals[ssg_cd]) {
            const table = this.models[ssg_cd];
            const results = await table.findAll({
                where: {
                    id: { [Op.in]: [Sequelize.literal('select max(id) as id from' + (config.dialect === 'sqlite' ? ` '${ssg_cd}' ` : ` ${config.database}.${ssg_cd} `) + 'group by dong,name')] }
                    // x: { [Op.and]: [{ [Op.gt]: coordinate.min_x }, { [Op.lt]: coordinate.max_x }] },
                    // y: { [Op.and]: [{ [Op.gt]: coordinate.min_y }, { [Op.lt]: coordinate.max_y }] }
                },
                raw: true
            })

            globalLocationFormRepositoryMemory.findRecentlyDeals[ssg_cd] = results;
        }

        const search = [];
        for (const deal of globalLocationFormRepositoryMemory.findRecentlyDeals[ssg_cd]) {
            if (deal.x > coordinate.min_x && deal.x < coordinate.max_x && deal.y > coordinate.min_y && deal.y < coordinate.max_y) {
                search.push(deal);
            }
        }
        console.log(`${ssg_cd}: `, search.length);
        return search;
    }

    async findProviousOfRecentlyDeals(coordinate, ssg_cd) {
        // 좌표기준 건물의 거래 내역중 가장 최근 거래 내역 한개만을 표시(house_type 무시)

        if (!globalLocationFormRepositoryMemory.findProviousOfRecentlyDeals[ssg_cd]) {
            const results = await this.sequelize.query(
                `select AA.*,BB.max_id
                from projectdev.${ssg_cd} as AA
                inner join
                    (select max(id) as s_max_id, max_id
                    from
                        (select a.*,b.id as max_id
                        from projectdev.${ssg_cd} as a
                        inner join
                            (select *
                            from projectdev.${ssg_cd}
                            where id in 
                                (SELECT max(id)
                                FROM projectdev.${ssg_cd}
                                group by dong,name)) as b
                        on a.dong = b.dong and a.name = b.name
                        where a.id != b.id and a.area = b.area and ((b.floor > 0 and a.floor > 0) and (a.floor >= b.floor-3 and a.floor <= b.floor+3) or (b.floor < 0 and a.floor < 0)))as s
                    group by max_id) as BB
                on AA.id = BB.s_max_id
                order by max_id`, { type: this.sequelize.QueryTypes.SELECT })

            globalLocationFormRepositoryMemory.findProviousOfRecentlyDeals[ssg_cd] = results;
        }

        const search = [];
        for (const deal of globalLocationFormRepositoryMemory.findProviousOfRecentlyDeals[ssg_cd]) {
            if (deal.x > coordinate.min_x && deal.x < coordinate.max_x && deal.y > coordinate.min_y && deal.y < coordinate.max_y) {
                search.push(deal);
            }
        }
        console.log(`${ssg_cd}: `, search.length);
        return search;
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
