const Winston = require('winston');
const WinstonDaily = require('winston-daily-rotate-file');

// logs 디렉토리 하위에 로그 파일 저장
const logDir = 'logs';
const { combine, timestamp, printf } = Winston.format;

// Define log format
const logFormat = printf(info => {
    return `[${info.timestamp}] ${info.level}: ${info.message}` + (info.code ? `[code: ${info.code}]` : '') + (info.detail ? `detail: ${info.detail}` : '')
    // if (info.code) {
    //     return `[${info.timestamp}] ${info.level}: ${info.message} [code: ${info.code}] detail: ${info.detail}`;
    // }
    // return `[${info.timestamp}] ${info.level}: ${info.message}`;
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = Winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        logFormat
    ),
    transports: [
        // error 레벨 로그를 저장할 파일 설정
        new WinstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir + '/error', // error.log 파일은 /logs/error 하위에 저장
            filename: '%DATE%.error.log',
            maxFiles: 30,
            zippedArchive: true
        }),
        // warn 레벨 로그를 저장할 파일 설정
        new WinstonDaily({
            level: 'warn',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir + '/warn', // error.log 파일은 /logs/error 하위에 저장
            filename: '%DATE%.warn.log',
            maxFiles: 30,
            zippedArchive: true
        }),
        // info 레벨 로그를 저장할 파일 설정
        new WinstonDaily({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: '%DATE%.log',
            maxFiles: 30, // 30일치 로그 파일 저장
            zippedArchive: true
        }),
        // verbose 레벨 로그를 저장할 파일 설정 sequlize sql logging
        new WinstonDaily({
            level: 'verbose',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir + '/verbose',
            filename: '%DATE%.verbose.log',
            maxFiles: 30, // 30일치 로그 파일 저장
            zippedArchive: true
        })
    ]
});

// Production 환경이 아닌 경우(dev 등)
if ((process.env.NODE_ENV || 'development') === 'development') {
    logger.add(new Winston.transports.Console({
        format: Winston.format.combine(
            Winston.format.colorize(), // 색깔 넣어서 출력
            logFormat // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
        )
    }));
}

module.exports = { logger };
