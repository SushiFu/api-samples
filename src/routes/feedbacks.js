import express from "express";
import validate from "express-validation";
import Joi from "joi";
import feedbackCtrl from "../controllers/feedbacks";
import auth from "../server/auth";
import defaultValidations from "../helpers/default-validations";

const router = express.Router();

const validation = {
    create: {
        body: {
            message: Joi.string().required()
        }
    },
    update: {
        body: {
            message: Joi.string()
        }
    }
};

router.param("objectId", validate(defaultValidations.objectId));
router.param("objectId", feedbackCtrl.load);

router.route("/")
    /** GET /feedbacks - Get list of feedbacks */
    .get(auth.moderator(), feedbackCtrl.list)

    /** POST /feedbacks - Create new feedbacks */
    .post(validate(validation.create), auth.user(), feedbackCtrl.create);

router.route("/:objectId")
    /** GET /feedbacks/:objectId - Get feedback */
    .get(auth.moderator(), feedbackCtrl.get)

    /** PATCH /feedbacks/:objectId - Update existings feedback */
    .patch(validate(validation.update), auth.addedBy(), feedbackCtrl.update)

    /** DELETE /feedbacks/:objectId - Delete existings feedback */
    .delete(auth.moderator(), feedbackCtrl.remove);

export default router;