const RESPONSE = require('../../src/config/responseState');

module.exports = (address) => {
    const result = RESPONSE.SUCCESS;
    result.data = {
        x: 127.156,
        y: 58.163
    };
    return result;
}
