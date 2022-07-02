const { logger } = require('./winston');

module.exports = {
    tryCatchError: (error, ERROR_TYPE) => new Promise((resolve, reject) => {
        if (error.status != null) {
            resolve(error);
        } else {
            const err = ERROR_TYPE;
            err.info = error;
            console.error(err);
            resolve(err);
        }
    }),
    errorCheckAndraise: (res) => new Promise((resolve, reject) => {
        if (res == null) {
            throw new Error('반환값이 없습니다.');
        } else if (res.status) {
            resolve(res);
        } else {
            throw res;
        }
    }),
    errorCheckAndloggingThenThrow: (error, Type) => {
        if (error.status === undefined) {
            logger.error({
                code: Type.code,
                message: Type.message,
                detail: `${error}`
            })
            throw Type;
        }
        throw error;
    },

    SUCCESS: {
        status: true,
        code: 200
    },
    SUCCESS_NO_DATA: {
        status: true,
        code: 201,
        message: '수신된 정보가 없습니다.'
    },

    ROUTE_ERROR: {
        status: false,
        code: 1000
    },
    ROUTE_NOT_FIND: {
        status: false,
        code: 1001,
        message: '페이지를 찾을 수 없습니다.'
    },
    ROUTE_INIT_ERROR: {
        status: false,
        code: 1101,
        message: '요청 처리중 오류가 발생했습니다.'
    },

    LOGIN_ERROR: {
        status: false,
        code: 2000
    },
    LOGIN_PASSWORD_AUTH_FAIL: {
        status: false,
        code: 2002,
        message: '비밀번호가 일치하지 않습니다.'
    },
    LOGIN_USER_NOT_FIND: {
        status: false,
        code: 2001,
        message: '가입되지 않은 회원입니다.'
    },

    API_ERROR: {
        status: false,
        code: 3000
    },
    API_RESPONSE_ERROR: {
        status: false,
        code: 3001,
        message: 'api통신 성공, 비정상적 수신'
    },
    API_ACCESS_DENIAL: {
        status: false,
        code: 3101,
        message: 'api 서버측 연결 거부'
    },
    API_TIMEOUT: {
        status: false,
        code: 3002,
        message: 'api 연결 시간 초과'
    },

    DB_ERROR: {
        status: false,
        code: 4000
    },
    DB_INSERT_ERROR: (model) => {
        return {
            status: false,
            code: 4001,
            message: `'${model}' table에 입력중 오류가 발생했습니다.`
        }
    },
    DB_CREATE_ERROR: {
        status: false,
        code: 4101,
        message: '테이블 생성중 오류가 발생했습니다.'
    },
    DB_FIND_ERROR: {
        status: false,
        code: 4201,
        message: '테이블 조회중 오류가 발생했습니다.'
    },
    DB_FIND_ERROR_NAME: (model) => {
        return {
            status: false,
            code: 4201,
            message: `'${model}' table 조회중 오류가 발생했습니다.`
        }
    },
    DB_API_SYNC_ERROR: {
        status: false,
        code: 4301,
        message: 'API 정보 -> DB 파싱중 오류가 발생했습니다.'
    },
    DB_SELECT_ERROR: {
        status: false,
        code: 4400
    },
    DB_TABLE_SELECT_ERROR: {
        status: false,
        code: 4401,
        message: '요청한 테이블이 존재하지 않습니다.'
    },
    DB_TABLE_UPDATE_ERROR: {
        status: false,
        code: 4501,
        message: '테이블 내용을 업데이트는 중 오류가 발생했습니다.'
    },

    VALIDATE_ERROR: {
        status: false,
        code: 5000
    },
    VALIDATE_UNDIFINED_ERROR: {
        status: false,
        code: 5001,
        message: '변수가 정의되어 있지 않습니다.'
    },
    VALIDATE_TYPE_ERROR: {
        status: false,
        code: 5002,
        message: '변수의 타입이 일치하지 않습니다.'
    },

    CONTROLLER_ERROR: {
        status: false,
        code: 6000,
        message: '데이터 초기화 중 오류가 발생했습니다.'
    },
    CONTROLLER_ERROR_NAME: (controllerName) => {
        return {
            status: false,
            code: 6000,
            message: `'${controllerName}' 컨트롤러에서 오류가 발생했습니다.`
        }
    },

    DATA_NULL: {
        status: false,
        code: 7000,
        message: '입력 데이터가 존재하지 않습니다.'
    },
    DATA_SOME_MISSING: {
        status: false,
        code: 7001,
        message: '일부 데이터가 누락되어 있습니다.'
    }
}
