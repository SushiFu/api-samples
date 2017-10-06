import express from "express";
import validate from "express-validation";
import Joi from "joi";

import authCtrl from "../controllers/auth";

const router = express.Router();

const validations = {
    login: {
        body: {
            username: Joi.string().required(),
            password: Joi.string().required()
        }
    },
    signup: {
        body: {
            username: Joi.string().regex(/^[a-z0-9_]{1,15}$/).required(),
            email: Joi.string().email().required(),
            password: Joi.string().required().min(6)
        }
    }
};

router.route("/login")
    .post(validate(validations.login), authCtrl.login);

router.route("/signup")
    .post(validate(validations.signup), authCtrl.signup);

router.route("/logout")
    .post(authCtrl.logout);

export default router;