import httpStatus from "http-status";

import APIError from "../helpers/api-error";
import { isAlive as isElasticAlive } from "../server/elastic";
import { isAlive as isMongoAlive } from "../server/mongo";
import config from "../server/config";

function healthCheck(req, res, next) {
    Promise.all([
        isElasticAlive(),
        isMongoAlive()
    ]).then(() => {
        res.json({
            "message": req.__("Sample API"),
            "version": config.VERSION,
            "status": req.__("Healthy")
        });
    }).catch(err => {
        next(new APIError(["API is not ready"], httpStatus.SERVICE_UNAVAILABLE, err));
    });
}

export default { healthCheck };