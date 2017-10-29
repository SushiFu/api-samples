import mongoostatic from "mongoosastic";
import timestamps from "mongoose-timestamp";
import httpStatus from "http-status";
import APIError from "../helpers/api-error";

import mongoose from "../server/mongo";
import elastic from "../server/elastic";
import utils from "./utils";

export const ProfileSchema = new mongoose.Schema({
    _id: {
        type: String,
        match: [/^[a-z0-9_]{1,15}$/, "The value of path {PATH} ({VALUE}) is not a valid username."],
        required: true
    },
    className: {
        type: String,
        default: "profile"
    },
    description: {
        type: String,
        es_indexed: true
    },
    location: {
        type: String,
        es_indexed: true
    },
    website: {
        type: String,
        es_indexed: true
    },
}, utils.genSchemaConf((doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
}));

/**
 * Virtuals fields
 */
ProfileSchema.virtual("username")
    .get(function () {
        return this._id ? this._id : null;
    })
    .set(function (val) {
        this._id = val;
    });

/**
 * Statics
 */
ProfileSchema.statics = {
    /**
     * Get profile
     * @param {ObjectId} id - This _id of profile
     * @returns {Promise<Profile, error>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((profile) => {
                if (profile) {
                    return profile;
                }
                const err = new APIError(["No such profile exists"], httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * Create a new profile
     * @param {String} username
     * @returns {Promise<Profile, APIError>}
     */
    create(username) {
        return this.findById(username)
            .exec()
            .then(exist => {
                if (exist)
                    return exist;
                let profile = new this();
                profile.username = username;
                return profile.save();
            });
    },

    /**
     * List profile in descending order of 'createdAt' timestamps
     * @param {number} skip - Number of profile to be skipped
     * @param {number} limit - Limit number of profiles to be returned
     * @returns {Promise<Profile[]>}
     */
    list({ skip = 0, limit = 20 } = {}) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
    }
};

ProfileSchema.plugin(timestamps, {
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

ProfileSchema.plugin(mongoostatic, {
    esClient: elastic,
    transform: function (data, profile) {
        data.username = profile._id;
        return data;
    },
    customProperties: {
        username: {
            type: "string",
            boost: 2.0
        }
    }
});

/**
 * @typedef Profile
 */
export default mongoose.model("Profile", ProfileSchema);