import User from "../models/user";
import Profile from "../models/profile";

/**
 * Load user and append to req
 */
function load(req, res, next, id) {
    User.get(id)
        .then((user) => {
            req.object.push(user);
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get user
 * @return {User}
 */
function get(req, res) {
    return res.json(req.object.last().el());
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.password - The password of user.
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.role - The role of user.
 */
function create(req, res, next) {
    User.createWithRole(req.body.username, req.body.password, req.body.email, req.body.role)
        .then(user => res.json(user))
        .catch(e => next(e));
}

/**
 * Update existing user
 * @returns {User}
 */
function update(req, res, next) {
    const user = req.object.last().el();

    if (req.body.email) {
        user.email = req.body.email;
    }
    if (req.body.password) {
        user.password = req.body.password;
    }

    user.save()
        .then(savedUser => res.json(savedUser))
        .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped
 * @property {number} req.query.limit - Limit of users to be returned
 * @returns {Users[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    User.list({ limit, skip })
        .then(users => res.json(users))
        .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
    const user = req.object.last().el();
    user.remove()
        .then(() => { return Profile.findByIdAndRemove(user.id).exec(); })
        .then(() => { res.json(user); })
        .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
