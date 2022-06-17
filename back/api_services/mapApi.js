const axios = require('axios');
const dotenv =require('dotenv');
const RESPONSE = require('../config/responseState')

dotenv.config();

const naver = (text)=> new Promise(res =>{
    client_id = process.env.NAVER_API_MAP_ID;
    client_secret = process.env.NAVER_API_MAP_SECRET;
    url = process.env.NAVER_API_MAP_URL;
    const headers={
        'X-NCP-APIGW-API-KEY-ID':client_id,
        'X-NCP-APIGW-API-KEY':client_secret,
    }
    const params={
        'query':text,
    }

    res( axios(url,{headers,params})
            .then((res)=>{
                //console.log("naver\n",res)
                if(res.status==200){
                    if(res.data.meta.totalCount!=0){
                        let result=RESPONSE.SUCCESS;
                        result.data={
                            x:res.data.addresses[0].x,
                            y:res.data.addresses[0].y,
                        }
                        return result;
                    }else{
                        let result=RESPONSE.SUCCESS_NO_DATA;
                        result.data={
                            x:0,
                            y:0,
                        }
                        return result;
                    };
                }else{
                    let err=RESPONSE.API_RESPONSE_ERROR;
                    err.info = res;
                    return err;
                };
                
            })
            .catch((error)=>{
                let err = RESPONSE.API_ERROR;
                err.info = error;
                console.log(err);
                return err;
            }));
});

module.exports={naver};