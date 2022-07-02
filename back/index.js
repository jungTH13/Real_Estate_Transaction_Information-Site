const dotenv = require('dotenv');

dotenv.config();

const dealsUpdateController = require('./src/controllers/dealsUpdateController');
const db = require('./src/infrastructure/database/orm/sequelize/models');
const expressServer = require('./src/infrastructure/express');
const apiInfo = require('./src/config/apiInfo')
const dealsApi = require('./src/infrastructure/api/dealsApi')
const mapApi = require('./src/infrastructure/api/mapAPI');
const LocationRepository = require('./src/infrastructure/database/repositories/LocationRepositoryMysql');
const LocationFormRepository = require('./src/infrastructure/database/repositories/LocationFormRepositoryMysql');
const UpdateOptionsDomain = require('./src/domain/updateOptions');
const { logger } = require('./src/config/winston')

const app = async () => {
    await db.init()

    const locationRepository = new LocationRepository(db);
    const locationFormRepository = new LocationFormRepository(db);

    const updateOptions = new UpdateOptionsDomain(
        locationRepository,
        locationFormRepository,
        apiInfo.url.type1,
        dealsApi.type1,
        mapApi.naver
    );

    await expressServer(process.env.PORT || 7000, updateOptions);

    if (process.env.UPDATE === 'true') {
        dealsUpdateController.update(updateOptions)
            .catch(() => {
                logger.error('database update가 비정상적으로 종료되었습니다.');
            })
    }
}

app();
