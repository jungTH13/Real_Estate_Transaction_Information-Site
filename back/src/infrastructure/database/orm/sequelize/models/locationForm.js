const Sequelize = require('sequelize');

module.exports = (sgg_cd) => {
    return class LocationForm extends Sequelize.Model {
        static init(sequelize) {
            return super.init({
                dong: {
                    type: Sequelize.STRING(20),
                    allowNull: false
                },
                name: {
                    type: Sequelize.STRING(30),
                    allowNull: false
                },
                jibun: {
                    type: Sequelize.STRING(10),
                    allowNull: false,
                    defaultValue: 'unknown'
                },
                deal_amount: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                build_year: {
                    type: Sequelize.INTEGER,
                    allowNull: true
                },
                deal_year: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                deal_month: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                deal_day: {
                    type: Sequelize.INTEGER,
                    allowNull: false

                },
                area: {
                    type: Sequelize.FLOAT,
                    allowNull: true
                },
                floor: {
                    type: Sequelize.FLOAT,
                    allowNull: true
                },
                house_type: {
                    type: Sequelize.STRING(10),
                    allowNull: false
                },
                cancel_deal_type: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                },
                cancel_deal_day: {
                    type: Sequelize.STRING(20),
                    allowNull: true
                },
                req_gbn: {
                    type: Sequelize.STRING(10),
                    allowNull: true
                },
                x: {
                    type: Sequelize.DOUBLE(),
                    allowNull: false

                },
                y: {
                    type: Sequelize.DOUBLE(),
                    allowNull: false
                },
                provious: {
                    type: Sequelize.INTEGER,
                    allowNull: true
                }
            }, {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: `${sgg_cd}`,
                tableName: `${sgg_cd}`,
                charset: 'utf8',
                collate: 'utf8_general_ci'
            });
        }
    }
}
