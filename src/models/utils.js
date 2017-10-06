/**
 * @callback tranform
 * @param {doc} document
 * @param {ret} response
 */

/**
 * Generate Schema Configuration
 * @param {tranform} [tranform] transform callback
 */
function genSchemaConf(tranform) {
    let conf = {
        toObject: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        },
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    };
    if (tranform) {
        conf.toObject.transform = tranform;
        conf.toJSON.transform = tranform;
    }
    return conf;
}

export default { genSchemaConf };