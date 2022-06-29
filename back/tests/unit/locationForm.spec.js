const LocationFormService = require('../../src/application/service/locationForm');

const CoordinateDomain = require('../../src/domain/coordinate');
const DealDomain = require('../../src/domain/deal');

describe('findIncludeArea module test', () => {
    const fakeRepository = {
        findRecentlyDeals: (coordinate, ssg_cd) => {
            const deals = [new DealDomain('내수동', '경희궁의아침3단지', '72', 200000, 2004, 2022, 1, 14, 150.48, 3, '아파트', 0, '', '중개거래', 126.972, 37.5736)];
            return deals;
        }
    }

    const locationFormService = new LocationFormService(fakeRepository);

    test('주어진 locations을 조회후 반환된 deals를 하나의 리스트로 반환하는가', async () => {
        // given
        const coordinate = new CoordinateDomain(126.9400033, 127.0079383, 37.5163848, 37.548273);
        const locationList = [{
            max_x: 126.982,
            min_x: 126.904,
            max_y: 37.5143,
            min_y: 37.4766,
            sgg_cd: 11590
        },
        {
            min_x: 126.947,
            min_y: 37.517,
            max_x: 127.015,
            max_y: 37.5549,
            sgg_cd: 11170
        },
        {
            min_x: 126.881,
            min_y: 37.5354,
            max_x: 126.962,
            max_y: 37.5871,
            sgg_cd: 11440
        }];

        // when
        const result = await locationFormService.findRecentlyDealsDistinct(coordinate, locationList);

        // then
        expect(result).toEqual([
            new DealDomain('내수동', '경희궁의아침3단지', '72', 200000, 2004, 2022, 1, 14, 150.48, 3, '아파트', 0, '', '중개거래', 126.972, 37.5736),
            new DealDomain('내수동', '경희궁의아침3단지', '72', 200000, 2004, 2022, 1, 14, 150.48, 3, '아파트', 0, '', '중개거래', 126.972, 37.5736),
            new DealDomain('내수동', '경희궁의아침3단지', '72', 200000, 2004, 2022, 1, 14, 150.48, 3, '아파트', 0, '', '중개거래', 126.972, 37.5736)
        ])
    })
});

describe('findMaxMinCoordinate module test', () => {
    const fakeRepository = {
        findMaxOne: (attribute, sgg_cd) => {
            if (attribute === 'x') {
                return { x: 127.0079383 }
            } else if (attribute === 'y') {
                return { y: 37.548273 }
            }
        },
        findMinOne: (attribute, sgg_cd) => {
            if (attribute === 'x') {
                return { x: 126.9400033 }
            } else if (attribute === 'y') {
                return { y: 37.5163848 }
            }
        }
    }
    const locationFormService = new LocationFormService(fakeRepository);

    test('해당 sgg_cd의 테이블의 coordinate 값을 포멧팅하여 반환하는가', async () => {
        // given
        const sgg_cd = 11440;

        // when
        const result = await locationFormService.findMaxMinCoordinate(sgg_cd);

        // then
        expect(result).toEqual(new CoordinateDomain(126.9400033, 127.0079383, 37.5163848, 37.548273));
    })
})
