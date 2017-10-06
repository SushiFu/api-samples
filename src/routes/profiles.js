import express from "express";
import validate from "express-validation";
import Joi from "joi";

import auth from "../server/auth";
import defaultValidations from "../helpers/default-validations";
import profileCtrl from "../controllers/profiles";

const router = express.Router();

const validations = {
    list: {
        query: {
            limit: Joi.number().positive(),
            skip: Joi.number()
        }
    },
    update: {
        body: {
            description: Joi.string().allow(""),
            location: Joi.string().allow(""),
            website: Joi.string().allow("")
        }
    },
    search: {
        query: {
            query: Joi.string().required(),
            limit: Joi.number().positive()
        }
    }
};

router.param("userId", validate(defaultValidations.userId));
router.param("userId", profileCtrl.load);

router.route("/")
    /** GET /profiles - Get list of profiles */
    .get(validate(validations.list), auth.admin(), profileCtrl.list);

router.route("/search")
    /** GET /profiles/search - Search profiles */
    .get(validate(validations.search), auth.user(), profileCtrl.search);

router.route("/:userId")
    /** GET /profiles/:userId - Get profile */
    .get(auth.user(), profileCtrl.get)
    /** PUT /profiles/:userId- Update profile */
    .put(validate(validations.update), auth.owner(), profileCtrl.update);

export default router;
