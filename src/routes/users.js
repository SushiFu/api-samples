import express from "express";
import validate from "express-validation";
import Joi from "joi";

import auth from "../server/auth";
import defaultValidations from "../helpers/default-validations";
import userCtrl from "../controllers/users";

const router = express.Router();

const validations = {
    create: {
        body: {
            username: Joi.string().regex(/^[a-z0-9_]{1,15}$/).required(),
            password: Joi.string().required(),
            email: Joi.string().email().required(),
            role: Joi.string().required().valid("user", "moderator", "admin")
        }
    },
    update: {
        body: {
            password: Joi.string(),
            email: Joi.string().email()
        }
    },
    list: {
        query: {
            limit: Joi.number().positive(),
            skip: Joi.number()
        }
    }
};

router.param("userId", validate(defaultValidations.userId));
router.param("userId", userCtrl.load);

router.route("/")
    /** GET /users - Get list of users */
    .get(validate(validations.list), auth.admin(), userCtrl.list)

    /** POST /users - Create new user */
    .post(validate(validations.create), auth.admin(), userCtrl.create);

router.route("/:userId")
    /** GET /users/:userId - Get user */
    .get(auth.owner(), userCtrl.get)

    /** PUT /users/:userId - Update user */
    .put(validate(validations.update), auth.owner(), userCtrl.update)

    /** DELETE /users/:userId - Delete user */
    .delete(auth.owner(), userCtrl.remove);

export default router;