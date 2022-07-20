const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('../../config/passport');
const cors = require('cors');
const dotenv = require('dotenv')
const { logger } = require('../../config/winston');
const RESPONSE = require('../../config/responseState');
const hpp = require('hpp');
const helmet = require('helmet');

const dealRouter = require('./routes');
const locationFixedRouter = require('./routes/locationFixed');

app = express();
dotenv.config();

module.exports = async (port = 7000, options) => {
    const prod = process.env.NODE_ENV === 'production';
    passportConfig();

    if (prod) {
        app.use(helmet());
        app.use(hpp());
        app.use(morgan('combined'));
        app.use(cors({
            origin: 'http://localhost:3000',
            credentials: true
        }));
    } else {
        app.use(morgan('dev'));
        app.use(cors({
            origin: 'http://127.0.0.1:3000',
            credentials: true
        }));
    }
    app.set('port', port);
    app.locals.options = options;

    app.get('/favicon.ico', (req, res) => {
        res.status(404);
    });
    app.use(cookieParser(process.env.COOKIE_SECRET));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        maxAge: 5 * 60,
        cookie: {
            httpOnly: true,
            maxAge: 5 * 60
        },
        name: 'session-cookie'
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/', dealRouter);
    app.use('/locationFixed', locationFixedRouter);

    app.use((req, res, next) => {
        logger.warn(`존재하지 않는 route 호출(URL:${req.url})`)
        next(RESPONSE.ROUTE_NOT_FIND);
    });

    app.use((error, req, res, next) => {
        if (error.code) {
            res.status(500).json(error);
        } else {
            const err = RESPONSE.ROUTE_INIT_ERROR
            logger.error({
                code: err.code,
                message: err.message,
                detail: `${error}`,
                stack: `${error.stack}`
            })
            res.status(500).json(err);
        }
    });

    app.listen(app.get('port'), () => {
        console.log(`서버 작동중 - PORT:${app.get('port')}`);
    });

    return app;
}
