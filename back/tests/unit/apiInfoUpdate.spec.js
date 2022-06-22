const apiInfoUpdateType1 =require('../../dbms/services/apiInfoUpdateType1');
const dotenv =require('dotenv')
const RESPONSE = require('../../config/responseState')

dotenv.config();
process.env.NODE_ENV='test'

const db_controller= require('../../dbms/db_controller');


test('API의 날짜 파라미터 서식 변환',async()=>{
    const target = apiInfoUpdateType1.setDEAL_YMD;
    const params = {
        Year: 2022,
        Month: 6,
    };
    
    expect( await target(params)).toBe('202206');
})

test('Month의 값을 다음달로 설정',async()=>{
    const target = apiInfoUpdateType1.addYMD;
    const params = {
        Year: 2022,
        Month: 12,
    };
    const result = {
        Year: 2023,
        Month: 1,
    }

    expect( await target(params)).toEqual(result);
})

test('최신 실거래 날짜를 기준으로 갱신 시작 월 재설정',async()=>{
    const target = apiInfoUpdateType1.startDateSetting;
    const params = {
        deal_year: 2021,
        deal_month: 6,
    }
    const set1=3, set2=6;

    const result1 = {
        Year: 2021,
        Month: 3,
    },
    result2 = {
        Year: 2020,
        Month: 12,
    },
    result3 = {
        Year: process.env.SINCE_YEAR,
        Month: process.env.SINCE_MONTH,
    }

    expect(await target(params,set1)).toEqual(result1);
    expect(await target(params,set2)).toEqual(result2);

    if(process.env.SINCE_YEAR){
        expect(await target(null,set2)).toEqual(result3);
    }
})

test('Location 테이블의 좌표정보 정상적 최신화 여부 확인',async()=>{
    await db_controller.start();
})

test('주소에 따라 좌표 주소를 정상적으로 출력하는지 확인',async ()=>{
    //result1 : 정상적으로 검색이 가능한 주소인 경우
    //result2 : 정상적으로 검색이 불가능한 주소인 경우
    const target = apiInfoUpdateType1.findCoordinate;
    const address1 = '신림동',address2 = '동보렉스 7차 2035';
    const result1 =RESPONSE.SUCCESS,result2=RESPONSE.SUCCESS_NO_DATA;
    result1.data = {
        x:126.927075,
        y:37.487426,
    }
    result2.data = {
        x:0,
        y:0,
    }
    
    expect(await target(address1)).toEqual(result1);
    expect(await target(address2)).toEqual(result2);
})