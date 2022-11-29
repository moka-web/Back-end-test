const winston = require("winston");

const logger = winston.createLogger({
    level: "warn",
    transports: [
        new winston.transports.Console({ level: "verbose" }),
        new winston.transports.File({ level: "error", filename: "info_winston.log" }),
    ],
});

module.exports = logger;