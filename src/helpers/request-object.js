class RequestElement {
    /**
     * Create new RequestElement
     * @param {Object} el - Element
     * @returns {RequestElement}
     */
    constructor(el) {
        this._object = el;
        this._parent = {};
    }

    /**
     * Set parent
     * @param {RequestElement} parent - Parent
     */
    setParent(parent) {
        this._parent = parent;
    }

    /**
     * Get parent
     * @returns {RequestElement}
     */
    parent() {
        return this._parent;
    }
    
    /**
     * Get the element itself
     * @returns {Object}
     */
    el() {
        return this._object;
    }
}

export default class RequestObject {
    /**
     * Create new RequestObject
     * @returns {RequestObject}
     */
    constructor() {
        this._list = [];
    }

    /**
     * Add Object to the list
     * @param {Object} el - Object to add
     */
    push(el) {
        let element = new RequestElement(el);
        let parent = this.last();
        element.setParent(parent);
        this._list.push(element);
    }

    /**
     * Get the full list of Objects
     * @returns {RequestElement[]}
     */
    list() {
        return this._list;
    }

    /**
     * 
     */
    elementsList() {
        let list = this._list.map(el => {
            const obj = el.el().toJSON();
            delete obj.likes;
            delete obj.comments;
            delete obj.addedBy;
            delete obj.spot;
            delete obj.caption;
            delete obj.createdAt;
            delete obj.updatedAt;
            delete obj.hashtags;

            //No need usertags in media because we delete caption
            //but we still need them for comment
            if (obj.className === "media") {
                delete obj.usertags;
            }

            return obj;
        });

        return list;
    }

    /**
     * Get the first Object of the list
     * @returns {RequestElement}
     */
    first() {
        return this._list[0];
    }

    /**
     * Get the last element of the list
     * @returns {RequestElement}
     */
    last() {
        return this._list[this._list.length - 1];
    }
}

/**
 * Load middleware
 * @returns {Function}
 */
function requestObject (req, res, next) {
    req.object = new RequestObject();
    next();
}

export {requestObject};