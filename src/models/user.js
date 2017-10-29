import httpStatus from "http-status";
import mongoostatic from "mongoosastic";
import timestamps from "mongoose-timestamp";
import bcrypt from "bcryptjs";
import APIError from "../helpers/api-error";

import mongoose from "../server/mongo";
import elastic from "../server/elastic";
import utils from "./utils";
import Profile from "./profile";

export const UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        match: [/^[a-z0-9_]{1,15}$/, "The value of path {PATH} ({VALUE}) is not a valid username."],
        required: true
    },
    className: {
        type: String,
        default: "user"
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "moderator", "admin"],
        default: "user",
        es_indexed: true
    },
    password: {
        type: String,
        set: (password) => {
            const salt = bcrypt.genSaltSync(10);
            return bcrypt.hashSync(password, salt);
        }
    },
    email: {
        type: String,
        unique: true,
        match: [/([\w\.]+)@([\w\.]+)\.(\w+)/, "The value of path {PATH} ({VALUE}) is not a valid email address."],
        index: true,
        es_indexed: true
    }
}, utils.genSchemaConf((doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
}));

/**
 * Virtuals fields
 */
UserSchema.virtual("username")
    .get(function () {
        return this._id ? this._id : null;
    });

/**
 * Statics
 */
UserSchema.statics = {
    /**
     * Check if user exist
     * @param {String} id - This _id of user
     * @returns {Promise<Boolean>}
     */
    exist(id) {
        return this.findById(id)
            .exec()
            .then((user) => {
                return user !== null;
            });
    },

    /**
     * Get user
     * @param {String} id - This _id of user
     * @returns {Promise<User, Error>}
     */
    get(id) {
        return this
            .findById(id)
            .exec()
            .then(user => {
                if (user) {
                    return user;
                }
                const err = new APIError(["No such user exists"], httpStatus.NOT_FOUND);
                return Promise.reject(err);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    },

    /**
     * List users in descending order of 'createdAt' timestamp
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned
     * @returns {Promise<User[]>}
     */
    list({ skip = 0, limit = 20 } = {}) {
        return this.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
    },

    /**
     * Create a new user w/ empty profile
     * @param {String} username
     * @param {String} password
     * @param {String} email
     * @param {String} [role]
     * @returns {Promise<User>}
     */
    create(username, password, email, role) {
        let user = new this();
        user._id = username;
        user.password = password;
        user.email = email;
        if (role)
            user.role = role;
        return Profile
            .create(username)
            .then(() => {
                return user.save();
            });
    },

    /**
     * Ensure root user is created
     * @param {String} password
     * @returns {Promise<User>}
     */
    ensureRootCreation(password) {
        return Profile
            .create("root")
            .then(() => {
                return this.findById("root");
            })
            .then(exist => {
                let user;
                if (exist) {
                    user = exist;
                }
                else {
                    user = new this();
                    user._id = "root";
                }
                user.password = password;
                user.email = "root@superapi.gg";
                user.role = "admin";
                return user.save();
            });
    }
};

UserSchema.plugin(timestamps, {
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
UserSchema.plugin(mongoostatic, { esClient: elastic });

/**
 * @typedef User
 */
export default mongoose.model("User", UserSchema);