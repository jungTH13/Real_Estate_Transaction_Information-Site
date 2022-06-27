const RESPONSE = require('../../config/responseState');
const {Op}=require('sequelize');

module.exports=class dealUpdate {
    constructor(options){
        this.Location = options.locationRepository;
        this.LocationForm = options.locationFormRepository;
        this.url = options.url;
        this.dealsApi = options.dealsApi;
        this.mapApi = options.mapApi;
    }

    async update(){
        try{
            console.log("데이터베이스 실거래정보 업데이트 시작")
            const Location=this.Location;
            const LocationFormList=await Location.findAll({attributes:['sgg_cd']});
            
            for(let LocationFormName of LocationFormList){
                let sgg_cd=LocationFormName.sgg_cd;
                
                await this.type1(sgg_cd)
                .then(async res=>await RESPONSE.errorCheckAndraise(res));

                await this.locationXYupdate(sgg_cd)
                .then(async res=>await RESPONSE.errorCheckAndraise(res));
            }
            console.log("데이터베이스 실거래정보 업데이트 완료")
            return RESPONSE.SUCCESS;
    
        }catch(error){
            return RESPONSE.tryCatchError(error,RESPONSE.DB_API_SYNC_ERROR)
        }
    }

    async type1 (sgg_cd){ //type1 에 대한 api 통신 및 테이블(sgg_cd)에 데이터 저장 함수
        const url = this.url;
        const LocationForm = this.LocationForm;
        let ACCESS_EXCEED=false;
        try{
                for(let name of url.name){
                        
                        // await LocationForm.findOne({// 가장 최근 업데이트 된 정보를 받아온다
                        //         where:{house_type: name},
                        //         order:[['deal_year','DESC'],['deal_month','DESC'],['deal_day','DESC']]
                        // },sgg_cd)
                        await LocationForm.findRecentlyDealOnType(name,sgg_cd)
                        .then(async (search)=>{
                            let check= await this.startDateSetting(search,0)
                            let start= await this.startDateSetting(search);
                            let end={
                                    Year:new Date().getFullYear(),
                                    Month:new Date().getMonth()+1,
                            };
                            
                            console.log(`'${sgg_cd}${name}'의 최신 거래정보: `,check,` / '${await this.setDEAL_YMD(start)}'부터 갱신시작`)

                            await this.insertDealdata(name,url[name],sgg_cd,start,end,check)
                            .then(res=>{
                                    if(res.state){
                                            console.log(`'${sgg_cd}${name}' 갱신완료`)
                                            return RESPONSE.SUCCESS;
                                    }else{
                                            if(res.code==RESPONSE.API_ACCESS_DENIAL.code){
                                                    ACCESS_EXCEED=true;
                                                    console.log(`'${name}'의 업데이트 강제종료`);
                                            }else{
                                                    throw res
                                            }
                                    }
                            })
                        })
                        .catch(async(error)=>{
                                await RESPONSE.errorCheckAndraise(error);
                        })
                }
                if(ACCESS_EXCEED){
                        console.log({warning:"호출횟수 초과로 일부 정보를 최신하지 못했습니다."})
                }
                return RESPONSE.SUCCESS;
        }catch(error){
                return RESPONSE.tryCatchError(error,RESPONSE.DB_API_SYNC_ERROR)
        }

    }


    async locationXYupdate(sgg_cd){
        try{
            const LocationForm = this.LocationForm;
            const Location = this.Location;

            // const max_xInfo = await LocationForm.findOne({order:[['x','DESC']]},sgg_cd);
            // const min_xInfo = await LocationForm.findOne({
            //                                                 where:{x:{[Op.gt]:0}},
            //                                                 order:[['x']]
            //                                             },sgg_cd);
            // const max_yInfo = await LocationForm.findOne({order:[['y','DESC']]},sgg_cd);
            // const min_yInfo = await LocationForm.findOne({
            //                                                 where:{y:{[Op.gt]:0}},
            //                                                 order:[['y']]
            //                                             },sgg_cd);
            await Location.XYupdate({
                min_x:await LocationForm.findMinOne('x',sgg_cd),
                max_x:await LocationForm.findMaxOne('x',sgg_cd),
                min_y:await LocationForm.findMinOne('y',sgg_cd),
                max_y:await LocationForm.findMaxOne('y',sgg_cd),
            },sgg_cd);
        }catch(error){
            return RESPONSE.tryCatchError(error,RESPONSE.DB_TABLE_UPDATE_ERROR);
        }
        
        return RESPONSE.SUCCESS;
    }


    //해당구의 코드번호와 갱신할 기간을 받아 해당 테이블의 실거래 정보를 업데이트한다.
    async insertDealdata (name,url,sgg_cd,start,end,check){

        let params={
            'serviceKey' : process.env.LOCATION_API_KEY_TYPE1,
            'LAWD_CD' : sgg_cd,
            'DEAL_YMD' : null,
        };
        
        try{
            while(end.Year>start.Year || (end.Year==start.Year&&end.Month>=start.Month)){//현재 달까지의 모든 정보를 갱신
                params['DEAL_YMD']=await this.setDEAL_YMD(start);
                await this.getProperty(url,params)
                .then(async res=>{
                    if(res.state){
                        if(res.data){
                            if(!Array.isArray(res.data)){
                                res.data=[res.data];
                            }
                            let deals=[];
                            for(const data of res.data){
                                await this.findCoordinate(await this.addressParse(name,data))
                                .then(async res=>{
                                    if(res.state){
                                        let set={};
                                        if(name=='아파트'){
                                            set.name='아파트',set.house_type='아파트';
                                        }else if(name=='오피스텔'){
                                            set.name='단지',set.house_type='오피스텔';
                                        }else if(name == '연립다세대'){
                                            set.name='연립다세대',set.house_type='연립다세대';
                                        };
                                        deals.push({
                                            dong:data['법정동'],
                                            name:data[set.name],
                                            jibun:data['지번'],
                                            deal_amount:parseInt(data['거래금액'].replace(/,/g , '')),
                                            build_year:data['건축년도'],
                                            deal_year:data['년'],
                                            deal_month:data['월'],
                                            deal_day:data['일'],
                                            area:data['전용면적'],
                                            floor:data['층'],
                                            house_type:set.house_type,
                                            cancel_deal_type:data['해제여부']=='O',
                                            cancel_deal_day:data['해제사유발생일'],
                                            req_gbn:data['거래유형'],
                                            x:res.data.x,
                                            y:res.data.y,
                                        });
                                    }else{
                                        throw res;
                                    }
                                })
                            }
                           
                            await this.dataInsertOrSwap(sgg_cd,name,start,check,deals);
                            console.log({processing:`'${sgg_cd}${name}': ${start.Year}.${start.Month} 완료`});
                        }
                    }else{
                        throw res;
                    }
                    
                })
                .catch(err=>{
                    throw err;
                })
                start=await this.addYM(start)
            }
            return RESPONSE.SUCCESS;
        }catch(error){
            return await RESPONSE.tryCatchError(error,RESPONSE.DB_API_SYNC_ERROR);
        };
    };

    //실거래 신고를 최대 3개월까지 늦츨수 있기때문에 3개월전의 데이터부터 갱신하기 위한 날짜 설정
    startDateSetting=(start,set=1) =>new Promise(res=>{//실거래 신고를 최대 3개월까지 늦츨수 있기때문에 3개월전의 데이터부터 갱신하기 위한 날짜 설정
        if (start){
            let result={}
            if(start.deal_month-set>=1){
                result.Year=start.deal_year;
                result.Month=start.deal_month-set;
            }else{
                result.Year=start.deal_year-1;
                result.Month=start.deal_month-set+12;
            }
            res(result);
        } else{
            res({
                    Year:parseInt(process.env.SINCE_YEAR),
                    Month:parseInt(process.env.SINCE_MONTH),
                });
        }
    })

    //api 통신을 통해서 거래 정보를 가져온다
    async getProperty(url,params){
        for(let i=0;i<10;i++){
            const res = await this.dealsApi(url,params);
            if(res.state){
                return res;
            }else{
                if(res.code == RESPONSE.API_ACCESS_DENIAL.code){
                    return res;
                }
                console.log({warning:`Property데이터 수신 에러 재시도(${i+1}/10)`});
                if(i==9){
                    return res;
                }
            }
        }
        return res;
    }

    //api 통신틍 통해 각 거래정보의 위치정보를 가져온다.
    async findCoordinate(address){
        for(let i=0;i<10;i++){
            const res = await this.mapApi(address)
            if(res.state){
                return res;
            }else{
                console.log({warning:`map데이터 수신 에러 재시도(${i+1}/10)`});
                if(i==9){
                    return res
                }
            }
        }
    }

    //위치 정보 검색을 위한 주소 파싱
    addressParse(name,data){
        return new Promise( res=>{
            if(name=='아파트'){
                res(data['법정동']+' '+data['지번']);
            }else if(name=='연립다세대'){
                res(data['법정동']+' '+data['지번']);
            }else if(name=='오피스텔'){
                res(data['법정동']+' '+data['지번']);
            }
        })
    }

    //데이터베이스에 생성하는 거래정보의 기간의 자료가 존재시 제거후 생성
    dataInsertOrSwap(sgg_cd,name,start,check,deals){
        return new Promise(async (resolve,reject)=>{
            const LocationForm = this.LocationForm;
            try{
                if(check.Year>start.Year || (check.Year==start.Year&&check.Month>=start.Month)){
                    
                    // await LocationForm.deleteDeals({
                    //         house_type:name,
                    //         Year:start.Year,
                    //         Month:start.Month,
                    // },sgg_cd)
                    await LocationForm.deleteDeals(name,start.Year,start.Month,sgg_cd)
                    .then(async ()=>{
                        await LocationForm.bulkCreate(deals,sgg_cd);
                    })
                }else{
                    await LocationForm.bulkCreate(deals,sgg_cd);
                }
                resolve(RESPONSE.SUCCESS);
            }catch(error){
                reject(await RESPONSE.tryCatchError(error,RESPONSE.DB_API_SYNC_ERROR));
            }
        });
    }

    //월을 하나 추가한다.
    addYM(start){
        return new Promise(res=>{
            if(start.Month+1>12){
                res({
                    Year:start.Year+1,
                    Month:1,
                })
            }else{
                res({
                    Year:start.Year,
                    Month:start.Month+1,
                })
            }
            res(start);
        })
    }

    //날자정보를 셋팅
    setDEAL_YMD=(start)=> new Promise(res=>{ //params.DEAL_YMD 타입을 맞추기 위한 함수
        if(start.Month<10){
                res(`${start.Year}0${start.Month}`);
        }else{
                res(`${start.Year}${start.Month}`);
        }
    })
}