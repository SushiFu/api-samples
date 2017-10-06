import elasticsearch from "elasticsearch";
import config from "./config";
import { LogElastic } from "./logger";

let elastic = new elasticsearch.Client({
    host: config.ELASTIC_URL,
    log: LogElastic,
});

/**
 * Check if elasticsearch is alive
 * @returns {Promise}
 */
export function isAlive() {
    let p = Promise.reject();
    for (var i = 0; i < 15; i++) {
        p = p.catch(tryConnect).catch(rejectDelay);
    }
    return p;
}

function rejectDelay(reason) {
    return new Promise(function (resolve, reject) {
        setTimeout(reject.bind(null, reason), 2000);
    });
}

const elasticError = new Error("Unable to connect elasticsearch : " + config.ELASTIC_URL);
function tryConnect() {
    return new Promise((resolve, reject) => {
        elastic.ping({}, err => {
            if (err) {
                reject(elasticError);
            }
            else {
                resolve();
            }
        });
    });
}

export default elastic;