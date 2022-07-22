const axios = require('axios');
const dotenv = require('dotenv');
const RESPONSE = require('../../config/responseState')
const { logger } = require('../../config/winston')

dotenv.config();

const naver = async (address) => {
    client_id = process.env.NAVER_API_MAP_ID;
    client_secret = process.env.NAVER_API_MAP_SECRET;
    url = process.env.NAVER_API_MAP_URL;
    const headers = {
        'X-NCP-APIGW-API-KEY-ID': client_id,
        'X-NCP-APIGW-API-KEY': client_secret
    }
    const params = {
        query: address
    }

    try {
        const result = await axios(url, { headers, params })
        // .then((res) => res)
        // .catch(() => RESPONSE.API_TIMEOUT);
        if (result.status !== 200) {
            throw new Error(`올바른 데이터가 수신되지 않았습니다.[status:${result.status}]`);
        }
        if (result.data.meta.totalCount > 0) {
            const response = RESPONSE.SUCCESS;
            response.data = {
                x: result.data.addresses[0].x,
                y: result.data.addresses[0].y
            }
            return response;
        }

        logger.warn(`'${address}' 대한 mapApi 결과가 존재하지 않습니다.`)
        const response = RESPONSE.SUCCESS_NO_DATA;
        response.data = {
            x: 0,
            y: 0
        }
        return response;
    } catch (error) {
        RESPONSE.errorCheckAndloggingThenThrow(error, RESPONSE.API_RESPONSE_ERROR);
    }
}

module.exports = { naver };
