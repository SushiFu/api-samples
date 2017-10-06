import httpStatus from "http-status";

import APIError from "../helpers/api-error";

function createErrorMsg(req, res, next) {
    next(new APIError(["No such user exists"], httpStatus.NOT_FOUND));
}

function testError(req, res, next) {
    next(new Error("This a unhandled test error"));
}

function trueBullshit(req, res) {
    res.json({ message: "OK" });
}

export default { createErrorMsg, testError, trueBullshit };