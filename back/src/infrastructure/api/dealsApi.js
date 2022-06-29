const axios = require('axios');
const dotenv = require('dotenv');
const RESPONSE = require('../../config/responseState')

dotenv.config();

const type1 = async (api_url, params) => {
    try {
        const res = await axios.get(api_url, { params });
        // console.log(res.data);
        if (res.data.response.header.resultCode === '00') {
            const result = RESPONSE.SUCCESS;
            result.data = res.data.response.body.items.item;
            return result;
        } else {
            if (res.data.response.header.resultCode === 99) {
                return await RESPONSE.tryCatchError({ message: 'mapApi 하루 허용 횟수 초과' }, RESPONSE.API_ACCESS_DENIAL);
            }
            return RESPONSE.API_RESPONSE_ERROR;
        }
    } catch (error) {
        const err = RESPONSE.API_ERROR;
        err.info = error;
        return err;
    }
};

module.exports = { type1 };
