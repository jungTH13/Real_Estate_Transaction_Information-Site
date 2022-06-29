const { Sequelize } = require('sequelize');

const User = require('../../src/infrastructure/database/orm/sequelize/models/user');
const Location = require('../../src/infrastructure/database/orm/sequelize/models/location');
const LocationForm = require('../../src/infrastructure/database/orm/sequelize/models/locationForm');
const {insertLocationFormTableInfo,createLocationFormTable} = require('../../src/infrastructure/database/orm/sequelize/setup')
const apiInfo = require('../../src/config/apiInfo');
const db = {};

const sequelize = new Sequelize('sqlite::memory:');

User.init(sequelize);
Location.init(sequelize);

db.User=User;
db.Location=Location;
db.LocationForm={};
db.sequelize = sequelize;

db.init=async ()=>{
    await sequelize.sync()
    .then(async()=>{
        const locations = apiInfo.locationInfo;

        await insertLocationFormTableInfo(db.Location,locations);
        await createLocationFormTable(db,LocationForm);
        await sequelize.sync();
        console.log("데이터베이스 초기화 완료")
    })
    .catch(error=>{
        console.log(error);
        console.log("데이터베이스 초기화중 오류발생");
        process.exit(1);
    })
    
};

module.exports = db;