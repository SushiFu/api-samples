import multer from "multer";
import httpStatus from "http-status";

import APIError from "../helpers/api-error";

const mult = multer({ storage: multer.memoryStorage() });

/**
 * Set & Check mutipart file
 * @param {string} fieldname - Name of the file field
 * @returns {RequestHandler}
 */
function single(fieldname) {
    return (req, res, next) => {
        mult.single(fieldname)(req, res, err => {
            if (err)
                next(err);
            else if (!req.file)
                next(new APIError(["A file is required"], httpStatus.BAD_REQUEST));
            else
                next();
        });
    };
}

function fields(arrayFields) {
    return (req, res, next) => {
        mult.fields(arrayFields)(req, res, err => {
            if (err)
                next(err);
            else if (!req.files)
                next(new APIError(["Files are required"], httpStatus.BAD_REQUEST));
            else
                next();
        });
    };
}

export default { single, fields };