'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';//
const config = require('../../../../../config/config.json')[env];
const { insertLocationFormTableInfo, createLocationFormTable } = require('../setup')
const apiInfo = require('../../../../../config/apiInfo');
const { logger } = require('../../../../../config/winston');

console.log(env);
config.logging = (msg) => logger.verbose(msg);
const sequelize = new Sequelize(config.database, config.username, process.env.DATABASE_SECRET, config);
process.env.DATABASENAME = config.database;

const User = require('./user');
const Location = require('./location');
const LocationForm = require('./locationForm');

const db = {};

User.init(sequelize);
Location.init(sequelize);

db.User = User;
db.Location = Location;
db.LocationForm = {};
db.sequelize = sequelize;
db.init = async () => {
    await sequelize.sync()
        .then(async () => {
            const locations = apiInfo.locationInfo;

            await insertLocationFormTableInfo(db.Location, locations);
            await createLocationFormTable(db, LocationForm);
            await sequelize.sync();
            logger.info('데이터베이스 초기화 완료');
        })
        .catch((error) => {
            logger.error('데이터베이스 초기화중 오류발생');
            logger.error(`${error}`);
            process.exit(1);
        })
};

module.exports = db;
