const express = require('express')
const displayDealsController = require('../../../controllers/displayDealsController');

const router = express.Router()

router.post('/deal', async (req, res, next) => {
    await displayDealsController.RecentlyDeals({ body: req.body.mapState })
        .then((result) => res.json({ status: 200, data: result }))
        .catch((error) => next(error));
})

module.exports = router;
