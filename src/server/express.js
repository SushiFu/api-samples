import express from "express";
import expressValidation from "express-validation";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import compress from "compression";
import methodOverride from "method-override";
import cors from "cors";
import helmet from "helmet";
import httpStatus from "http-status";
import responseTime from "response-time";
import i18n from "i18n";

import config from "./config";
import logger, { logHttpRequest } from "./logger";
import auth from "./auth";
import routes from "../routes/index";
import APIError, { UnhandledAPIError } from "../helpers/api-error";
import { requestObject } from "../helpers/request-object";

i18n.configure({
    locales: ["en"],
    defaultLocale: "en",
    directory: __dirname + "/../../locales"
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compress());
app.use(methodOverride());
app.use(helmet());
app.use(cors());

app.use(cookieParser(config.JWT_SECRET));
app.use(auth.initialize());

app.use(i18n.init);

// HTTP requests logging w/ response time
app.use(responseTime((req, res, time) => {
    logHttpRequest(req, res, time);
}));

// Init RequestObject
app.use(requestObject);

// Init API routes
app.use("/", routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
    if (err instanceof expressValidation.ValidationError) {
        const unifiedErrorMessage = err.errors.map(error => error.messages.join(". ")).join(" and ");
        const error = new APIError(unifiedErrorMessage, err.status);
        return next(error);
    }
    else if (!(err instanceof APIError)) {
        const apiError = new UnhandledAPIError(err);
        return next(apiError);
    }
    return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new APIError(["%s %s not found", req.method, req.path], httpStatus.NOT_FOUND);
    return next(err);
});

// error handler, send stacktrace only in development.
app.use((err, req, res, next) => {
    let json = {
        status: httpStatus[err.status],
        type: err.type
    };
    json.message = Array.isArray(err.message) ? req.__(...err.message) : err.message;
    if (config.NODE_ENV === "development" || config.NODE_ENV === "test") {
        json.stack = err.stack;
    }
    res.status(err.status).json(json);

    json.stack = err.stack;
    if (err instanceof APIError) {
        logger.warn(json);
    }
    else {
        logger.error(json);
    }

    next();
});

export default app;