module.exports = (req, res, next) => {
    if (!req.body.mapState) {
        next(RESPONSE.DATA_NULL);
    }
    const mapState = req.body.mapState;
    if (!mapState.point || !mapState.bounds || !mapState.Zoom) {
        next(RESPONSE.DATA_SOME_MISSING);
    }
    req.body.options = app.locals.options;
    req.body.options.coordinate = {
        min_x: mapState.bounds.min.x,
        min_y: mapState.bounds.min.y,
        max_x: mapState.bounds.max.x,
        max_y: mapState.bounds.max.y
    }
    next('route')
}
