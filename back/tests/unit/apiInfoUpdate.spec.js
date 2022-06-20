const apiInfoUpdateType1 =require('../../dbms/services/apiInfoUpdateType1');
const dotenv =require('dotenv')

dotenv.config();

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
        console.log("true")
        expect(await target(null,set2)).toEqual(result3);
    }
})