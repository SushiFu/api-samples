import Joi from "joi";

export default {
    objectId: {
        params: {
            objectId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    },
    userId: {
        params: {
            userId: Joi.string().required(),
        }
    }
};