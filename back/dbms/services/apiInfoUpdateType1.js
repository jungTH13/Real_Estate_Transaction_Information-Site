const propertyApi =require('../../api_services/propertyApi');
const mapApi = require('../../api_services/mapApi');
const RESPONSE =require('../../config/responseState');
const {Op}=require('sequelize')


exports.setDEAL_YMD=(start)=> new Promise(res=>{ //params.DEAL_YMD 타입을 맞추기 위한 함수
    if(start.Month<10){
            res(`${start.Year}0${start.Month}`);
    }else{
            res(`${start.Year}${start.Month}`);
    }
})

exports.addYMD=(start)=>new Promise(res=>{
    if(start.Month+1>12){
        start.Year++;
        start.Month=1;
    }else{
        start.Month++;
    }
    res(start);
})

exports.startDateSetting=(start,set=1) =>new Promise(res=>{//실거래 신고를 최대 3개월까지 늦츨수 있기때문에 3개월전의 데이터부터 갱신하기 위한 날짜 설정
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
                Year:process.env.SINCE_YEAR,
                Month:process.env.SINCE_MONTH,
            });
    }
})

exports.locationXYupdate=async (Location,LocationForm,sgg_cd)=>{
    const max_xInfo = await LocationForm.findOne({order:[['x','DESC']]})
    const min_xInfo = await LocationForm.findOne({
                                                    where:{x:{[Op.gt]:0}},
                                                    order:[['x']]
                                                })
    const max_yInfo = await LocationForm.findOne({order:[['y','DESC']]})
    const min_yInfo = await LocationForm.findOne({
                                                    where:{y:{[Op.gt]:0}},
                                                    order:[['y']]
                                                })
    if(max_xInfo){
        await Location.update({
            min_x:min_xInfo.x,
            max_x:max_xInfo.x,
            min_y:min_yInfo.y,
            max_y:max_yInfo.y,
        },
        {where:{sgg_cd}})
    }
    return RESPONSE.SUCCESS;
}

exports.findCoordinate=async(address)=>{
    for(i=0;i<10;i++){
        const res = await mapApi.naver(address)
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

exports.getProperty=async (url,params)=>{
    for(i=0;i<10;i++){
        const res = await propertyApi.type1(url,params);
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

exports.addressParse=(name,data)=> new Promise( res=>{
    if(name=='아파트'){
        res(data['법정동']+' '+data['지번']);
    }else if(name=='연립다세대'){
        res(data['법정동']+' '+data['지번']);
    }else if(name=='오피스텔'){
        res(data['법정동']+' '+data['지번']);
    }
})

exports.dataInsertOrSwap=(LocationForm,name,start,check,deals)=> new Promise(async (resolve,reject)=>{
    try{
        if(check.Year>start.Year || (check.Year==start.Year&&check.Month>=start.Month)){
            await LocationForm.destroy({
                where:{
                    house_type:name,
                    deal_year:start.Year,
                    deal_month:start.Month,
                }
            })
            .then(async ()=>{
                await LocationForm.bulkCreate(deals);
            })
        }else{
            await LocationForm.bulkCreate(deals);
        }
        resolve(RESPONSE.SUCCESS);
    }catch(error){
        reject(await RESPONSE.tryCatchError(error,RESPONSE.DB_API_SYNC_ERROR));
    }

});

//해당구의 코드번호와 갱신할 기간을 받아 해당 테이블의 실거래 정보를 업데이트한다.
exports.insertDealdata= async (LocationForm,name,url,sgg_cd,start,end,check)=>{
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
                        await this.dataInsertOrSwap(LocationForm,name,start,check,deals);
                        console.log({processing:`'${sgg_cd}${name}': ${start.Year}.${start.Month} 완료`});
                    }
                }else{
                    throw res;
                }
                
            })
            .catch(err=>{
                throw err;
            })
            start=await this.addYMD(start)
        }
        return RESPONSE.SUCCESS;
    }catch(error){
        return await RESPONSE.tryCatchError(error,RESPONSE.DB_API_SYNC_ERROR);
    };
};