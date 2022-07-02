const RESPONSE = require('../../config/responseState');
const { logger } = require('../../config/winston')
const util = require('util')
const DealDomain = require('../../domain/deal');

module.exports = class dealUpdate {
    constructor(options) {
        this.LocationForm = options.locationFormRepository;
        this.url = options.url;
        this.dealsApi = options.dealsApi;
        this.mapApi = options.mapApi;
    }

    async update(sgg_cd) { // type1 에 대한 api 통신 및 테이블(sgg_cd)에 데이터 저장 함수
        const url = this.url;
        const LocationForm = this.LocationForm;
        let ACCESS_EXCEED = false;
        try {
            for (const name of url.name) {
                const search = await LocationForm.findRecentlyDealOnType(name, sgg_cd)

                const dateParams = await this.updateDateParamsSetting(search, 1);
                logger.info(`'${sgg_cd}${name}'의 최신 거래정보: ` + util.format('%o', dateParams.check) + ` / '${await this.setDEAL_YMD(dateParams.start)}'부터 갱신시작`)

                const res = await this.insertDealdata(name, url[name], sgg_cd, dateParams);

                if (res.status) {
                    logger.info(`'${sgg_cd}${name}' 갱신완료`);
                    continue;
                }
                if (res.code === RESPONSE.API_ACCESS_DENIAL.code) {
                    ACCESS_EXCEED = true;
                    logger.warn(`'${sgg_cd}${name}'의 업데이트 강제종료`);
                } else {
                    console.log('***', res)
                    throw res;
                }
            }

            if (ACCESS_EXCEED) {
                logger.warn('호출횟수 초과로 일부 정보를 최신하지 못했습니다.');
            }
            return RESPONSE.SUCCESS;
        } catch (error) {
            RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.DB_API_SYNC_ERROR);
        }
    }

    // 해당구의 코드번호와 갱신할 기간을 받아 해당 테이블의 실거래 정보를 업데이트한다.
    async insertDealdata(name, url, sgg_cd, dateParams) {
        let start = dateParams.start;
        const check = dateParams.check;
        const end = dateParams.end;
        const params = {
            serviceKey: process.env.LOCATION_API_KEY_TYPE1,
            LAWD_CD: sgg_cd,
            DEAL_YMD: null
        };
        try {
            while (end.Year > start.Year || (end.Year === start.Year && end.Month >= start.Month)) { // 현재 달까지의 모든 정보를 갱신
                params.DEAL_YMD = await this.setDEAL_YMD(start);
                const deals = [];

                const res = await this.getProperty(url, params);
                if (!res.status && res.code === RESPONSE.API_ACCESS_DENIAL.code) {
                    return res;
                }
                if (!res.data) {
                    res.data = [];
                }
                if (!Array.isArray(res.data)) {
                    res.data = [res.data];
                }

                for (const data of res.data) {
                    const res = await this.findCoordinate(await this.addressParse(name, data));

                    deals.push(new DealDomain(data['법정동'], (data['단지'] || data['연립다세대'] || data['아파트']), data['지번'], parseInt(data['거래금액'].replace(/,/g, '')), data['건축년도'], data['년'], data['월'], data['일'], data['전용면적'], data['층'], name, (data['해제여부'] === 'O'), data['해제사유발생일'], data['거래유형'], res.data.x, res.data.y));
                }
                await this.dataInsertOrSwap(sgg_cd, name, start, check, deals);
                logger.info(`'${sgg_cd}${name}': ${start.Year}.${start.Month} 완료`);

                start = await this.addYM(start);
            }
            return RESPONSE.SUCCESS;
        } catch (error) {
            RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.DB_API_SYNC_ERROR);
        };
    };

    updateDateParamsSetting = async (deal, set = 3) => {
        return {
            check: await this.DateSetting(deal, 0),
            start: await this.DateSetting(deal, set),
            end: {
                Year: new Date().getFullYear(),
                Month: new Date().getMonth() + 1
            }
        }
    }

    // 실거래 신고를 최대 3개월까지 늦츨수 있기때문에 3개월전의 데이터부터 갱신하기 위한 날짜 설정
    DateSetting = (start, set = 0) => new Promise((resolve, reject) => { // 실거래 신고를 최대 3개월까지 늦츨수 있기때문에 3개월전의 데이터부터 갱신하기 위한 날짜 설정
        if (start) {
            const result = {}
            if (start.deal_month - set >= 1) {
                result.Year = start.deal_year;
                result.Month = start.deal_month - set;
            } else {
                result.Year = start.deal_year - 1;
                result.Month = start.deal_month - set + 12;
            }
            resolve(result);
        }

        resolve({
            Year: parseInt(process.env.SINCE_YEAR),
            Month: parseInt(process.env.SINCE_MONTH)
        });
    })

    // api 통신을 통해서 거래 정보를 가져온다
    async getProperty(url, params) {
        for (let i = 0; i < 10; i++) {
            const res = await this.dealsApi(url, params);
            if (res.status) {
                return res;
            }
            if (res.code === RESPONSE.API_ACCESS_DENIAL.code) {
                return res;
            }
            logger.warn(`Property데이터 수신 에러 재시도(${i + 1}/10)`);
            if (i === 9) {
                throw new Error('getProperty의 정상적인 데이터 수신에 실패했습니다.');
            }
        }
    }

    // api 통신틍 통해 각 거래정보의 위치정보를 가져온다.
    async findCoordinate(address) {
        for (let i = 0; i < 10; i++) {
            const res = await this.mapApi(address)
            if (res.status) {
                return res;
            }
            logger.warn(`map데이터 수신 에러 재시도(${i + 1}/10)`);
            if (i === 9) {
                throw new Error('findCoordinate의 정상적인 데이터 수신에 실패했습니다.');
            }
        }
    }

    // 위치 정보 검색을 위한 주소 파싱
    addressParse(name, data) {
        return new Promise((resolve, reject) => {
            if (name === '아파트') {
                resolve(data['법정동'] + ' ' + data['지번']);
            } else if (name === '연립다세대') {
                resolve(data['법정동'] + ' ' + data['지번']);
            } else if (name === '오피스텔') {
                resolve(data['법정동'] + ' ' + data['지번']);
            }
        })
    }

    // 데이터베이스에 생성하는 거래정보의 기간의 자료가 존재시 제거후 생성
    dataInsertOrSwap(sgg_cd, name, start, check, deals) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            const LocationForm = this.LocationForm;
            try {
                if (check.Year > start.Year || (check.Year === start.Year && check.Month >= start.Month)) {
                    // await LocationForm.deleteDeals({
                    //         house_type:name,
                    //         Year:start.Year,
                    //         Month:start.Month,
                    // },sgg_cd)
                    await LocationForm.deleteDeals(name, start.Year, start.Month, sgg_cd)
                        .then(async () => {
                            await LocationForm.bulkCreate(deals, sgg_cd);
                        })
                } else {
                    await LocationForm.bulkCreate(deals, sgg_cd);
                }
                resolve(RESPONSE.SUCCESS);
            } catch (error) {
                reject(await RESPONSE.tryCatchError(error, RESPONSE.DB_API_SYNC_ERROR));
            }
        });
    }

    // 월을 하나 추가한다.
    addYM(start) {
        return new Promise((resolve, reject) => {
            if (start.Month + 1 > 12) {
                resolve({
                    Year: start.Year + 1,
                    Month: 1
                })
            } else {
                resolve({
                    Year: start.Year,
                    Month: start.Month + 1
                })
            }
            resolve(start);
        })
    }

    // 날자정보를 셋팅
    setDEAL_YMD = (start) => new Promise((resolve, reject) => { // params.DEAL_YMD 타입을 맞추기 위한 함수
        if (start.Month < 10) {
            resolve(`${start.Year}0${start.Month}`);
        } else {
            resolve(`${start.Year}${start.Month}`);
        }
    })
}
