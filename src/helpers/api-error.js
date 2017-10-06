import httpStatus from "http-status";

/**
 * Class representing an unhandled API error
 * @extends {Error}
 */
export class UnhandledAPIError extends Error {

    /**
     * Creates an Unhandled API error
     * @param {Error} err - Original error
     */
    constructor(err) {
        super();
        this.status = httpStatus.INTERNAL_SERVER_ERROR;
        this.message = ["Unhandled server error"];
        this.type = this.constructor.name;
        this.stack = err.stack;
    }
}

/**
 * Class representing an API error
 * @extends {Error}
 */
class APIError extends Error {

    /**
     * Creates an API error
     * @param {string|string[]} msg - Error message or i18n key w/ args
     * @param {number} [status=INTERNAL_SERVER_ERROR] - HTTP status code of error
     * @param {Error} [err] - Optionnal original error
     */
    constructor(msg, status = httpStatus.INTERNAL_SERVER_ERROR, err) {
        if (Array.isArray(msg)) {
            super(msg[0]);
        }
        else {
            super(msg);
        }
        Error.captureStackTrace(this, this.constructor);
        this.message = msg;
        this.type = this.constructor.name;
        this.status = status;
        if (err) {
            this.stack += " \n\n Override: " + err.stack;
        }
    }
}

export default APIError;