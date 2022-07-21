module.exports = (controller) => {
    return async (req, res, next) => {
        await controller(req.locals.options)
            .then((res) => res.json({ status: 200, data: res }))
            .catch((error) => next(error));
    }
}
