import mongoosestatic from "mongoosastic";
import timestamps from "mongoose-timestamp";
import httpStatus from "http-status";

import APIError from "../helpers/api-error";
import mongoose from "../server/mongo";
import elastic from "../server/elastic";
import utils from "./utils";

export const FeedbackSchema = new mongoose.Schema({
    className: {
        type: String,
        default: "feedback"
    },
    message: {
        type: String,
        required: true,
        es_indexed: true
    },
    addedBy: {
        type: String,
        ref: "Profile",
        required: true,
        index: true,
        es_indexed: true
    }
}, utils.genSchemaConf());

/**
 * Statics
 */
FeedbackSchema.statics = {
    /**
     * Get feedback
     * @param {ObjectId} id - This _id of Feedback
     * @returns {Promise<Feeback, Error>}
     */
    get(id) {
        return this.findById(id)
            .populate("addedBy")
            .exec()
            .then(feedback => {
                if (feedback) {
                    return feedback;
                }

                const err = new APIError(["No such feedback exists"], httpStatus.NOT_FOUND);
                return Promise.reject(err);
            })
            .catch(e => Promise.reject(e));
    },

    /**
     * List feedbacks in descending order of 'createdAt' timestamps
     * @param {number} skip - Number of feedbacks to be skipped
     * @param {number} limit - Limit of number of feedbacks to be returned
     * @returns {Promise<Media[]}
     */
    list({ skip = 0, limit = 0 } = {}) {
        return this.find()
            .populate("addedBy")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
    }
};

FeedbackSchema.plugin(timestamps, {
    createdAt: {
        index: true,
        es_indexed: true,
        es_type: "date"
    },
    updatedAt: {
        index: true,
        es_indexed: true,
        es_type: "date"
    }
});
FeedbackSchema.plugin(mongoosestatic, { esClient: elastic });

/**
 * @typedef Feedback
 */
export default mongoose.model("Feedback", FeedbackSchema);