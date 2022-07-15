const express = require('express')
const locationDealsController = require('../../../controllers/locationDealsController');

const router = express.Router()

router.post('/searchLocationAndDong', async (req, res, next) => {
    await locationDealsController.searchLocationAndDong(Object.assign(app.locals.options, { body: req.body.mapState }))
        .then((result) => res.json({ status: 200, data: result }))
        .catch((error) => next(error));
})

router.post('/proviousDeal', async (req, res, next) => {
    await locationDealsController.ProviousOfRecentlyDeals(Object.assign(app.locals.options, { body: req.body }))
        .then((result) => res.json({ status: 200, data: result }))
        .catch((error) => next(error));
})

router.post('/traingVolum', async (req, res, next) => {
    await locationDealsController.monthlyTradingVolum(Object.assign(app.locals.options, { body: req.body }))
        .then((result) => res.json({ status: 200, data: result }))
        .catch((error) => next(error));
})

router.post('/amountAVG', async (req, res, next) => {
    await locationDealsController.monthlyTradingAmountAVG(Object.assign(app.locals.options, { body: req.body }))
        .then((result) => res.json({ status: 200, data: result }))
        .catch((error) => next(error));
})

module.exports = router;
