import Feedback from "../models/feedback";

/**
 * Load feedback and append to req
 */
function load(req, res, next, id) {
    Feedback.get(id)
        .then(feedback => {
            req.object.push(feedback);
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get feedback
 * @return {Feedback}
 */
function get(req, res) {
    return res.json(req.object.last().el());
}

/**
 * Create new feedback
 * @property {string} req.body.message - Message of the feedback
 * @return {Feedback}
 */
function create(req, res, next) {
    const feedback = new Feedback({
        message: req.body.message,
        addedBy: req.user._id
    });

    feedback.save()
        .then(savedFeedback => {
            res.json(savedFeedback);
        })
        .catch(e => next(e));
}

function update(req, res, next) {
    const feedback = req.object.last().el();

    if (req.body.message) {
        feedback.message = req.body.message;
        feedback.save()
            .then(savedFeedback => res.json(savedFeedback))
            .catch(e => next(e));
    }
    else {
        res.json(feedback);
    }
}

/**
 * List feedback
 * @property {number} req.query.skip - Numbers of feedback to be skipped
 * @property {number} req.query.limit - Limit of feedbacks to be returned
 * @returns {Feedback{}}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    Feedback.list({ skip, limit })
        .then(feedbacks => res.json(feedbacks))
        .catch(e => next(e));
}

/**
 * Delete feedback
 * @return {Feedback}
 */
function remove(req, res, next) {
    const feedback = req.object.last().el();
    feedback.remove()
        .then(deletedFeedback => res.json(deletedFeedback))
        .catch(e => next(e));
}

export default { load, get, create, update, list, remove };