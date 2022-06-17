const axios = require('axios');
const dotenv =require('dotenv');
const propertyApi = require('../../api_services/propertyApi');
const locationForm = require('../../models/locationForm');
const {url} = require("../../config/apiInfo");

const RESPONSE = require('../../config/responseState');
const {setDEAL_YMD,startDateSetting,insertDealdata}= require('../services/apiInfoUpdateType1')
dotenv.config();




const type1= async (LocationForm,sgg_cd,type='type1')=>{ //type1 에 대한 api 통신 및 테이블(sgg_cd)에 데이터 저장 함수
        const urlType1 = url[type];
        let ACCESS_EXCEED=false;
        try{
                for(let name of urlType1.name){
                        
                        await LocationForm.findOne({// 가장 최근 업데이트 된 정보를 받아온다
                                where:{house_type: name},
                                order:[['deal_year','DESC'],['deal_month','DESC'],['deal_day','DESC']]
                        })
                        .then(async(search)=>{
                                let check=await startDateSetting(search,0);
                                let start=await startDateSetting(search);
                                let end={
                                        Year:new Date().getFullYear(),
                                        Month:new Date().getMonth()+1,
                                };
                                
                                console.log(`'${sgg_cd}${name}'의 최신 거래정보: `,check,` / '${await setDEAL_YMD(start)}'부터 갱신시작`)
                                
                                await insertDealdata(LocationForm,name,urlType1[name],sgg_cd,start,end,check)
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



module.exports={type1};