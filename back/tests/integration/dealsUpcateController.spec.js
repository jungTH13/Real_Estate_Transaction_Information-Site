const LocationFormRepository = require('../../src/infrastructure/database/repositories/LocationFormRepositoryMysql');
const LocationRepository = require('../../src/infrastructure/database/repositories/LocationRepositoryMysql');

const UpdateOptionsDomain = require('../../src/domain/updateOptions');
const CoordinateDomain = require('../../src/domain/coordinate');

const dealsUpdateController = require('../../src/controllers/dealsUpdateController')
const apiInfo = require('../../src/config/apiInfo');
const testDb = require('../fake/database');
const fakeMapApi = require('../fake/mapApi');
const fakeDealsApi = require('../fake/dealsApi');

process.env.NODE_ENV = 'test';

describe('dealsUpcateController intgration module test', () => {
    const date = new Date();
    process.env.SINCE_YEAR = date.getFullYear();
    process.env.SINCE_MONTH = date.getMonth() + 1;

    test('locationForm 테이블 데이터 생성 후, location 정보를 업데이트 하는가', async () => {
        // given
        await testDb.init();
        const locationFormRepository = new LocationFormRepository(testDb);
        const locationRepository = new LocationRepository(testDb);
        const updateOptions = new UpdateOptionsDomain(locationRepository, locationFormRepository, apiInfo.url.type1, fakeDealsApi, fakeMapApi)

        // when
        await dealsUpdateController.update(updateOptions);
        const locationList = await locationRepository.findAll();

        // then
        for (const res of locationList) {
            const result = new CoordinateDomain(res.min_x, res.max_x, res.min_y, res.max_y)
            expect(result).toEqual({
                min_x: 127.156,
                max_x: 127.156,
                min_y: 58.163,
                max_y: 58.163
            });
        }
    })
})
