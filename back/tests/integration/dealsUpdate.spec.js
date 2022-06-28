const LocationFormRepository = require('../../src/infrastructure/database/repositories/LocationFormRepositoryMysql');
const LocationRepository = require('../../src/infrastructure/database/repositories/LocationRepositoryMysql');

const DealsUpdateService = require('../../src/application/service/dealsUpdate');

const UpdateOptionsDomain = require('../../src/domain/updateOptions');
const DealDomain = require('../../src/domain/deal');

const RESPONSE = require('../../src/config/responseState');
const apiInfo = require('../../src/config/apiInfo');
const testDb = require('../fake/database');


const fakeMapApi = (address)=>{
    return {
        state:true,
        data:{
            x:127.156,
            y:58.163
        }
    }
}
const fakeDealsApi = (url,params)=>{
    const res = [{
        '거래금액': '     200,100',
        '거래유형': '직거래',
        '건축년도': 2004,
        '년': 2022,
        '법정동': ' 내수동',
        '아파트': '경희궁의아침3단지',
        '월': 5,
        '일': 10,
        '전용면적': 174.55,
        '중개사소재지': ' ',
        '지번': 72,
        '지역코드': 11110,
        '층': 4,
        '해제사유발생일': ' ',
        '해제여부': ' '
      },
      {
        '거래금액': '     181,000',
        '거래유형': '중개거래',
        '건축년도': 2003,
        '년': 2022,
        '법정동': ' 내수동',
        '아파트': '경희궁파크팰리스',
        '월': 5,
        '일': 28,
        '전용면적': 147.62,
        '중개사소재지': '경기 의정부시, 서울 종로구',
        '지번': 95,
        '지역코드': 11110,
        '층': 7,
        '해제사유발생일': ' ',
        '해제여부': ' '
      },
      {
        '거래금액': '      35,000',
        '거래유형': '중개거래',
        '건축년도': 2003,
        '년': 2022,
        '법정동': ' 익선동',
        '아파트': '현대뜨레비앙',
        '월': 5,
        '일': 14,
        '전용면적': 46.64,
        '중개사소재지': '서울 종로구',
        '지번': 55,
        '지역코드': 11110,
        '층': 5,
        '해제사유발생일': ' ',
        '해제여부': ' '
      }
    ]
    let result = RESPONSE.SUCCESS;
    result.data=res;
    return result; 
}

describe('insertDealdata module test',()=>{

    test('api가 정상수신되었을 경우 database를 업데이트 하는가',async ()=>{
        //given
        await testDb.init();
        const locationFormRepository = new LocationFormRepository(testDb);
        const locationRepository = new LocationRepository(testDb);
        const updateOptions = new UpdateOptionsDomain(locationRepository,locationFormRepository,apiInfo.url.type1,fakeDealsApi,fakeMapApi)
        const dealUpdateServie = new DealsUpdateService(updateOptions);
        const name = apiInfo.url.type1.name[0];
        const url = apiInfo.url.type1[name];
        const sgg_cd = 11110;
        
        //업데이트할 개월이 3개월 일경우
        let check= {Year: 2022, Month:6};
        let start= {Year: 2022, Month:6};
        let end={Year: 2022, Month:8};

        //when
        await dealUpdateServie.insertDealdata(name,url,sgg_cd,start,end,check);
        const result1 = await locationFormRepository.findAll(sgg_cd)
        
        //then
        expect(result1.length).toEqual(9);

        //기존 데이터가 존재하는 달에서부터 업데이트 할 경우
        check= {Year: 2022, Month:6};
        start= {Year: 2022, Month:3};
        end={Year: 2022, Month:8};

        //when
        await dealUpdateServie.insertDealdata(name,url,sgg_cd,start,end,check);
        const result2 = await locationFormRepository.findAll(sgg_cd)

        //then
        expect(result2.length).toEqual(12);

    })
    
})

describe('update module test',()=>{
    //데이터 베이스가 비어있을 경우 업데이트를 시작할 년월을 셋팅
    const date = new Date();
    process.env.SINCE_YEAR = date.getFullYear();
    process.env.SINCE_MONTH = date.getMonth()+1;

    test('Location db에 저장되어 있는 테이블을 전부 업데이트 하는가',async()=>{
        //given
        await testDb.init();
        console.log("***********",process.SINCE_MONTH)
        const locationFormRepository = new LocationFormRepository(testDb);
        const locationRepository = new LocationRepository(testDb);
        const updateOptions = new UpdateOptionsDomain(locationRepository,locationFormRepository,apiInfo.url.type1,fakeDealsApi,fakeMapApi)
        const dealUpdateServie = new DealsUpdateService(updateOptions);
        const sgg_cd = 11170;

        //when
        await dealUpdateServie.update(sgg_cd);
        const result = await locationFormRepository.findAll(sgg_cd);

        //then
        expect(result.length).toBe(3*apiInfo.url.type1.name.length)
    })
})