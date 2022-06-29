const DealsUpdate = require('../../src/application/service/dealsUpdate')
const UpdateOptionsDomain = require('../../src/domain/updateOptions');
const DealDomain = require('../../src/domain/deal');

describe('dealsUpdate의 module test', () => {
    const updateOptions = new UpdateOptionsDomain(null, null, null, null, null);
    const dealUpdateService = new DealsUpdate(updateOptions);

    test('API의 날짜 파라미터 서식 변환', async () => {
        const target = dealUpdateService.setDEAL_YMD;
        const params = {
            Year: 2022,
            Month: 6
        };

        expect(await target(params)).toBe('202206');
    })

    test('Month의 값을 다음달로 설정', async () => {
        const target = dealUpdateService.addYM;
        const params = {
            Year: 2022,
            Month: 12
        };
        const result = {
            Year: 2023,
            Month: 1
        }

        expect(await target(params)).toEqual(result);
    })

    test('최신 실거래 날짜를 기준으로 갱신 시작 월 재설정', async () => {
        const target = dealUpdateService.startDateSetting;
        const params = {
            deal_year: 2021,
            deal_month: 6
        }
        const set1 = 3; const set2 = 6;

        const result1 = {
            Year: 2021,
            Month: 3
        };
        const result2 = {
            Year: 2020,
            Month: 12
        };
        const result3 = {
            Year: parseInt(process.env.SINCE_YEAR),
            Month: parseInt(process.env.SINCE_MONTH)
        }

        expect(await target(params, set1)).toEqual(result1);
        expect(await target(params, set2)).toEqual(result2);

        if (process.env.SINCE_YEAR) {
            expect(await target(null, set2)).toEqual(result3);
        }
    })

    test('테이블에 기존 데이터 존재시 제거후 업로드 하는가', async () => {
        // given
        const sgg_cd = 11110;
        const house_type = '아파트';
        const check1 = { Year: 2020, Month: 6 };
        const check2 = { Year: 2021, Month: 1 };
        const start = { Year: 2020, Month: 6 };
        deals = [new DealDomain('내수동', '경희궁의아침3단지', '72', 200000, 2004, 2022, 1, 14, 150.48, 3, '아파트', 0, '', '중개거래', 126.972, 37.5736)];
        const result = ['deleteDeals', 'bulkCreate', 'deleteDeals', 'bulkCreate']
        const set = []
        const locationFormRepository = {
            deleteDeals: async (name, Year, Month, sgg_cd) => {
                set.push('deleteDeals')
            },
            bulkCreate: async (deals, sgg_cd) => {
                set.push('bulkCreate')
            }
        }
        const updateOptions = new UpdateOptionsDomain(null, locationFormRepository, null, null, null);
        const dealUpdateService = new DealsUpdate(updateOptions);

        // when
        await dealUpdateService.dataInsertOrSwap(sgg_cd, house_type, start, check1, deals);
        await dealUpdateService.dataInsertOrSwap(sgg_cd, house_type, start, check2, deals);

        // then
        expect(set).toEqual(result);
    })

    test('테이블에 데이터를 업로드 하는가', async () => {
        // given
        const sgg_cd = 11110;
        const house_type = '아파트';
        const check = { Year: 2020, Month: 5 };
        const start = { Year: 2020, Month: 6 };
        const deals = [new DealDomain('내수동', '경희궁의아침3단지', '72', 200000, 2004, 2022, 1, 14, 150.48, 3, '아파트', 0, '', '중개거래', 126.972, 37.5736)];
        const result = ['bulkCreate']
        const set = []
        const locationFormRepository = {
            deleteDeals: async (name, Year, Month, sgg_cd) => {
                set.push('deleteDeals')
            },
            bulkCreate: async (deals, sgg_cd) => {
                set.push('bulkCreate')
            }
        }
        const updateOptions = new UpdateOptionsDomain(null, locationFormRepository, null, null, null);
        const dealUpdateService = new DealsUpdate(updateOptions);

        // when
        await dealUpdateService.dataInsertOrSwap(sgg_cd, house_type, start, check, deals);

        // then
        expect(set).toEqual(result);
    })
})

describe('dealsUpdate의 mapApi module test', () => {
    test('api 통신 성공시 정상적인 반환값을 반환하는가', async () => {
        const result = {
            state: true,
            data: {
                x: 0,
                y: 0
            }
        }
        const mapApi = async (address) => {
            return result
        }
        const updateOptions = new UpdateOptionsDomain(null, null, null, null, mapApi);
        const dealUpdateService = new DealsUpdate(updateOptions);

        expect(await dealUpdateService.findCoordinate('testcheck')).toEqual(result)
    })

    test('api 통신 실패시 10회까지 재시도 후 결과값을 반환하는가', async () => {
        const result = {
            state: false,
            data: {
                x: 0,
                y: 0
            }
        }
        let count = 0;
        const mapApi = async (address) => {
            if (++count > 10) {
                throw new Error('재시도 허용횟수를 초과!');
            }
            return result;
        }
        const updateOptions = new UpdateOptionsDomain(null, null, null, null, mapApi);
        const dealUpdateService = new DealsUpdate(updateOptions);

        expect(await dealUpdateService.findCoordinate('testcheck')).toEqual(result)
        expect(count).toBe(10)
    })
})

describe('dealsUpdate의 dealsApi module test', () => {
    test('api 통신 성공시 정상적인 반환값을 반환하는가', async () => {
        const result = {
            state: true,
            data: 'testcheck empty'
        }
        const dealsApi = async (url, params) => {
            return result
        }
        const updateOptions = new UpdateOptionsDomain(null, null, null, dealsApi, null);
        const dealUpdateService = new DealsUpdate(updateOptions);

        expect(await dealUpdateService.getProperty('testcheck url', 'params')).toEqual(result)
    })

    test('api 통신 실패시 10회까지 재시도 후 결과값을 반환하는가', async () => {
        const result = {
            state: false,
            data: 'testcheck empty'
        }
        let count = 0;
        const dealsApi = async (address) => {
            if (++count > 10) {
                throw new Error('재시도 허용횟수를 초과!')
            }
            return result
        }
        const updateOptions = new UpdateOptionsDomain(null, null, null, dealsApi, null);
        const dealUpdateService = new DealsUpdate(updateOptions);

        expect(await dealUpdateService.getProperty('testcheck url', 'params')).toEqual(result)
        expect(count).toBe(10)
    })
})
