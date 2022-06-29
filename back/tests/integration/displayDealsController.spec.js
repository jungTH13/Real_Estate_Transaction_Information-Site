const LocationFormRepository = require('../../src/infrastructure/database/repositories/LocationFormRepositoryMysql');
const LocationRepository = require('../../src/infrastructure/database/repositories/LocationRepositoryMysql');

const UpdateOptionsDomain = require('../../src/domain/updateOptions');
const DealDomain = require('../../src/domain/deal');

const displayDealsController = require('../../src/controllers/displayDealsController');
const testDb = require('../fake/database');

describe('displayDealsController intgration module test', () => {
    test('database에서 일치하는게 없을 경우 빈 리스트를 반환하는가', async () => {
        // given
        await testDb.init();
        const locationFormRepository = new LocationFormRepository(testDb);
        const locationRepository = new LocationRepository(testDb);
        const updateOptions = new UpdateOptionsDomain(locationRepository, locationFormRepository, null, null, null);
        updateOptions.body = {
            bounds: {
                min: {
                    x: 126.904,
                    y: 37.4766
                },
                max: {
                    x: 126.982,
                    y: 37.5143
                }
            }
        };

        // when
        const result = await displayDealsController.basic(updateOptions);

        // then
        expect(result).toEqual([]);
    })

    test('database에서 일치하는 데이터가 존재시 리스트로 반환하는가', async () => {
        // given
        await testDb.init();
        // 데이터 주입
        await testDb.Location.update({
            max_x: 126.982,
            min_x: 126.904,
            max_y: 37.5143,
            min_y: 37.4766
        },
            { where: { sgg_cd: 11590 } });
        await testDb.LocationForm[11590].bulkCreate([
            new DealDomain('상도동', '포스코더샵', '512', 171000, 2007, 2022, 1, 18, 161.481, 5, '아파트', 0, '', '중개거래', 126.983, 37.4921),
            new DealDomain('신대방동', '신라스테이해링턴타워', '698', 15000, 2015, 2022, 3, 7, 20.34, 6, '오피스텔', 0, '', '직거래', 126.904, 37.4856)
        ]);

        const locationFormRepository = new LocationFormRepository(testDb);
        const locationRepository = new LocationRepository(testDb);
        const updateOptions = new UpdateOptionsDomain(locationRepository, locationFormRepository, null, null, null);
        updateOptions.body = {
            bounds: {
                min: {
                    x: 126.956869,
                    y: 37.4786424
                },
                max: {
                    x: 126.9908365,
                    y: 37.4945963
                }
            }
        };

        // when
        const result = await displayDealsController.basic(updateOptions);
        for (const deal of result) {
            delete deal.id;
        }

        // then
        expect(result).toEqual([new DealDomain('상도동', '포스코더샵', '512', 171000, 2007, 2022, 1, 18, 161.481, 5, '아파트', 0, '', '중개거래', 126.983, 37.4921)]);
    })
})
