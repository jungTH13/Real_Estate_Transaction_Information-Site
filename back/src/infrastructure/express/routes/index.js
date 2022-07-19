const express = require('express')
const displayDealsController = require('../../../controllers/displayDealsController');
const displayGraphController = require('../../../controllers/displayGraphController');
const locationDealsController = require('../../../controllers/locationDealsController');

const router = express.Router()

router.post('/deal', async (req, res, next) => {
    await displayDealsController.RecentlyDeals(Object.assign(app.locals.options, { body: req.body.mapState }))
        .then((result) => res.json({ status: 200, data: result }))
        .catch((error) => next(error));
})

router.post('/proviousDeal', async (req, res, next) => {
    await displayDealsController.ProviousOfRecentlyDeals(Object.assign(app.locals.options, { body: req.body.mapState }))
        .then((result) => res.json({ status: 200, data: result }))
        .catch((error) => next(error));
})

router.post('/traingVolum', async (req, res, next) => {
    await displayGraphController.monthlyTradingVolum(Object.assign(app.locals.options, { body: req.body.mapState }))
        .then((result) => res.json({ status: 200, data: result }))
        .catch((error) => next(error));
})

router.post('/amountAVG', async (req, res, next) => {
    await displayGraphController.monthlyTradingAmountAVG(Object.assign(app.locals.options, { body: req.body.mapState }))
        .then((result) => res.json({ status: 200, data: result }))
        .catch((error) => next(error));
})

router.post('/searchLcationAndDong', async (req, res, next) => {
    await locationDealsController.searchLocationAndDong(Object.assign(app.locals.options, { body: req.body.mapState }))
        .then((result) => res.json({ status: 200, data: result }))
        .catch((error) => next(error));
})

router.post('/selectDealInfo', async (req, res, next) => {
    console.log(req.body)
    await locationDealsController.selectDealInfo(Object.assign(app.locals.options, { body: req.body }))
        .then((result) => res.json({ status: 200, data: result }))
        .catch((error) => next(error));
})

module.exports = router;
