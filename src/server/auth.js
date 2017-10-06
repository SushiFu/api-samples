import passport from "passport";
import passportJWT from "passport-jwt";
import httpStatus from "http-status";

import User from "../models/user";
import config from "./config";
import APIError from "../helpers/api-error";

const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const CookieExtractor = function () {
    return function (req) {
        let token = null;
        if (req && req.signedCookies && "jwt" in req.signedCookies) {
            token = req.signedCookies["jwt"];
        }
        return token;
    };
};

const jwtOptions = {
    secretOrKey: config.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderWithScheme("JWT"),
        CookieExtractor()
    ])
};

const invalidToken = new APIError(["Your token is invalid"], httpStatus.UNAUTHORIZED);
const wrongPermission = new APIError(["You do not have right permission"], httpStatus.UNAUTHORIZED);

passport.use(new Strategy(jwtOptions, (payload, done) => {
    User.get(payload.id)
        .then(user => done(null, user))
        .catch(() => {
            done(invalidToken, false);
        });
}));

/**
 * Middleware to initialize passport
 */
function initialize() {
    return passport.initialize();
}

function authenticate(req, res, next) {
    return new Promise((resolve, reject) => {
        passport.authenticate("jwt", { session: false }, (err, user) => {
            if (err) {
                reject(err);
            }
            else if (!user) {
                reject(invalidToken);
            }
            else {
                req.user = user;
                resolve(user);
            }
        })(req, res, next);
    });
}

/**
 * Middleware to valid only registered user
 */
function user() {
    return (req, res, next) => {
        authenticate(req, res, next)
            .then(() => next())
            .catch(err => next(err));
    };
}

/**
 * Middleware to valid only moderator & admin role user
 */
function moderator() {
    return (req, res, next) => {
        authenticate(req, res, next)
            .then(() => {
                if (req.user.role === "moderator" || req.user.role === "admin") {
                    next();
                }
                else {
                    return Promise.reject(wrongPermission);
                }
            })
            .catch(err => next(err));
    };
}

/**
 * Middleware to valid only admin role user
 */
function admin() {
    return (req, res, next) => {
        authenticate(req, res, next)
            .then(() => {
                if (req.user.role === "admin") {
                    next();
                }
                else {
                    return Promise.reject(wrongPermission);
                }
            })
            .catch(err => next(err));
    };
}

/**
 * Middleware to valid only the author of the object (or moderator & admin)
 */
function addedBy() {
    return (req, res, next) => {
        authenticate(req, res, next)
            .then(() => {
                if (req.user.role === "admin" || req.user.role === "moderator" ||
                    req.object.last().el().addedBy === req.user._id ||
                    req.object.last().el().addedBy._id === req.user._id) {
                    next();
                }
                else {
                    return Promise.reject(wrongPermission);
                }
            })
            .catch(err => next(err));
    };
}

/**
 * Middleware to be used on user & profile to check if its the owner (or moderator & admin)
 */
function owner() {
    return (req, res, next) => {
        authenticate(req, res, next)
            .then(() => {
                if (req.user.role === "admin" || req.user.role === "moderator" ||
                    req.object.first().el()._id === req.user._id) {
                    next();
                }
                else {
                    return Promise.reject(wrongPermission);
                }
            })
            .catch(err => next(err));
    };
}

export default { initialize, user, moderator, admin, addedBy, owner };