module.exports={
    tryCatchError:(error,ERROR_TYPE)=>new Promise(res=>{
        if(error.state != null){
            res(error);
        }else{
            let err=ERROR_TYPE;
            err.info=error;
            console.error(err);
            res(err);
        }
    }),
    errorCheckAndraise:(res)=>new Promise((resolve,reject)=>{
        if(res==null){
            throw "반환값이 없습니다.";
        }else if(res.state){
            resolve(res);
        }else{
            throw res;
        }
    }),

    SUCCESS:{
        state:true,
        code:200,
    },
    SUCCESS_NO_DATA:{
        state:true,
        code:201,
        message:"수신된 정보가 없습니다."
    },

    ROUTE_ERROR:{
        state:false,
        code:1000,
    },
    ROUTE_NOT_FIND:{
        state:false,
        code:1001,
        message:"페이지를 찾을 수 없습니다."
    },



    LOGIN_ERROR:{
        state:false,
        code:2000,
    },
    LOGIN_PASSWORD_AUTH_FAIL:{
        state:false,
        code:2002,
        message:"비밀번호가 일치하지 않습니다."
    },
    LOGIN_USER_NOT_FIND:{
        state:false,
        code:2001,
        message:"가입되지 않은 회원입니다."
    },


    API_ERROR:{
        state:false,
        code:3000
    },
    API_RESPONSE_ERROR:{
        state:false,
        code:3001,
        message:"api통신 성공, 비정상적 수신"
    },
    API_ACCESS_DENIAL:{
        state:false,
        code:3101,
        message:"api 서버측 연결 거부"
    },
    


    DB_ERROR:{
        state:false,
        code:4000,
    },
    DB_INSERT_ERROR:(model)=>{
        return{
        state: false,
        code: 4001,
        message: `'${model}' table에 입력중 오류가 발생했습니다.`
        }
    },
    DB_CREATE_ERROR:{
        state:false,
        code:4101,
        message:"테이블 생성중 오류가 발생했습니다."
    },
    DB_FIND_ERROR:{
        state:false,
        code:4201,
        message:"테이블 조회중 오류가 발생했습니다."
    },
    DB_API_SYNC_ERROR:{
        state:false,
        code:4301,
        message:"API 정보 -> DB 파싱중 오류가 발생했습니다."
    },
    DB_SELECT_ERROR:{
        state:false,
        code:4400,
    },
    DB_TABLE_SELECT_ERROR:{
        state:false,
        code:4401,
        message:"요청한 테이블이 존재하지 않습니다."
    }
}