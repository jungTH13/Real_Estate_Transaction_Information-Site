const axios = require('axios');
const dotenv = require('dotenv');
const RESPONSE = require('../../config/responseState')
const { logger } = require('../../config/winston');

dotenv.config();

const type1 = async (api_url, params) => {
    try {
        const res = await axios.get(api_url, { params })
        // .then((res) => res)
        // .catch(() => RESPONSE.API_TIMEOUT);
        if (res.status !== 200) {
            throw new Error(`올바른 데이터가 수신되지 않았습니다.[status:${result.status}]`);
        }
        if (res.data.response.header.resultCode === '00') {
            const result = RESPONSE.SUCCESS;
            result.data = res.data.response.body.items.item;
            return result;
        }
        if (res.data.response.header.resultCode === 99) {
            logger.warn('mapApi 하루 허용 횟수 초과');
            return RESPONSE.API_ACCESS_DENIAL;
        }

        throw new Error(`올바른 데이터가 수신되지 않았습니다.[resultCode:${res.data.response.header.resultCode}]`);
    } catch (error) {
        RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.API_RESPONSE_ERROR);
    }
};

module.exports = { type1 };
