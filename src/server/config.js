import { version } from "../../package.json";

let params = {
    VERSION: version,
    NODE_ENV: process.env.NODE_ENV,
    LOG_LEVEL: process.env.LOG_LEVEL,
    API_URL: process.env.API_URL,
    API_PORT: process.env.API_PORT,
    ROOT_PASSWD: process.env.ROOT_PASSWD,
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_URL: process.env.MONGO_URL,
    ELASTIC_URL: process.env.ELASTIC_URL
};

Object.keys(params).forEach((key) => {
    let val = params[key];
    if (val === undefined)
        throw new Error(key.toString() + " env is missing");
});

if (!(params.NODE_ENV === "production" ||
    params.NODE_ENV === "test" ||
    params.NODE_ENV === "development")) {
    throw new Error("NODE_ENV could only take 'production', 'test' or 'development' values");
}

if (!(params.LOG_LEVEL === "fatal" ||
    params.LOG_LEVEL === "error" ||
    params.LOG_LEVEL === "warn" ||
    params.LOG_LEVEL === "info" ||
    params.LOG_LEVEL === "debug" ||
    params.LOG_LEVEL === "trace")) {
    throw new Error("LOG_LEVEL is not set or invalid");
}

export default params;