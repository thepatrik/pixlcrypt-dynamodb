"use strict";
require("dotenv").config({silent: true});
const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const bunyanMiddleware = require("bunyan-middleware");
const bunyan = require("bunyan");
const utils = require("./utils");
const routes = require("./routes");
const useCompression = process.env.USE_COMPRESSION !== "false";

const logLvls = {
    "production": "info",
    "development": "info",
    "test": "warn"
};

const logger = bunyan.createLogger({
    name: "pixlcrypt",
    level: logLvls[process.env.NODE_ENV]
});

const requestLogger = bunyanMiddleware({
    logger: logger,
    filter: req => {
        return req.url === "/health";
    },
    obscureHeaders: [
        "Authorization",
        "x-api-key"
    ]
});
app.use(requestLogger);

app.set("json spaces", 2);

app.use(helmet.xssFilter());
app.use(helmet.noCache());
app.use(helmet.noSniff());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts({
    setIf: req => {
        return utils.isSecure(req);
    }
}));

app.use(cors());
app.options("*", cors()); // include before other routes

if (useCompression) {
    app.use(compression());
}

app.use(routes);

module.exports = app;