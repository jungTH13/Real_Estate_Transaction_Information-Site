const express = require('express')
const displayDealsController = require('../../../controllers/displayDealsController');

const router = express.Router()

router.post('/deal', async (req, res, next) => {
    const result = await displayDealsController.basic({ body: req.body.mapState })
        .catch((error) => next(error));

    res.json({ status: 200, data: result });
})

module.exports = router;
