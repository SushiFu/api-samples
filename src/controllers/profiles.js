import Profile from "../models/profile";

/**
 * Load profile and append to req
 */
function load(req, res, next, id) {
    Profile.get(id)
        .then((profile) => {
            req.object.push(profile);
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get profile
 * @returns {Profile}
 */
function get(req, res) {
    return res.json(req.object.last().el());
}

/**
 * Search profiles
 * @returns {Profile[]}
 */
function search(req, res, next) {
    const { limit = 50 } = req.query;
    Profile.search({
        "match": {
            "username": {
                "query": req.query.query,
                "fuzziness": 2
            }
        },
    }, {
            size: limit,
            hydrate: true
        },
        (err, profiles) => {
            if (err) {
                next(err);
            }
            else {
                res.json(profiles.hits.hits);
            }
        });
}

/**
 * Update existing profile
 * @returns {Profile}
 */
function update(req, res, next) {
    const profile = req.object.last().el();

    profile.description = req.body.description === "" ? undefined : req.body.description;
    profile.website = req.body.website === "" ? undefined : req.body.website;
    profile.location = req.body.location === "" ? undefined : req.body.location;

    profile.save()
        .then(savedProfile => res.json(savedProfile))
        .catch(e => next(e));
}

/**
 * Get profile list
 * @property {number} req.query.skip - Number of profiles to be skipped
 * @property {number} req.query.limit - Limit of profiles to be returned
 * @returns {Profile[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    Profile.list({ limit, skip })
        .then(profiles => res.json(profiles))
        .catch(e => next(e));
}

export default { load, get, update, list, search };
