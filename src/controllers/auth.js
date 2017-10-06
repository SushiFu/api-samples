import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import config from "../server/config";
import User from "../models/user";
import APIError from "../helpers/api-error";

/**
 * Login user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.password - The password of user.
 */
function login(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    User.findById(username)
        .exec()
        .then(user => {
            if (user && user.password && bcrypt.compareSync(password, user.password)) {
                sendTokenResponse(res, user);
            }
            else {
                const err = new APIError(["Username or password incorrect"], httpStatus.UNAUTHORIZED);
                return Promise.reject(err);
            }
        })
        .catch(err => next(err));
}

/**
 * Signup user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.password - The password of user.
 * @property {string} req.body.email - The email of user.
 */
function signup(req, res, next) {
    User.exist(req.body.username)
        .then(already => {
            if (already) {
                const err = new APIError(["This username is already taken"], httpStatus.UNAUTHORIZED);
                return Promise.reject(err);
            }
            else {
                return User.create(req.body.username, req.body.password, req.body.email);
            }
        })
        .then(user => {
            sendTokenResponse(res, user);
        })
        .catch(err => next(err));
}

/**
 * Log out with cookie
 */
function logout(req, res) {
    res.clearCookie("jwt");

    return res.json({
        message: "logged out"
    });
}

/**
 * Send JWT token json for user w/ cookie
 * @argument {Response} res
 * @argument {User} user
 * @returns {JSON} token response
 */
export function sendTokenResponse(res, user) {
    let token = jwt.sign({ id: user._id }, config.JWT_SECRET);

    res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: true,
        signed: true,
        secure: config.NODE_ENV === "development" ? false : true //don't secure the cookie in dev
    });

    return res.json({
        message: "authenticated",
        token: "JWT " + token,
        user: user
    });
}

export default { login, signup, logout };