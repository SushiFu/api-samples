/**
 * Create a linked list, linked by the `child` attribute
 * @param {Object[]} objects - List of objects to link
 */
export default function (objects) {
    for (let i = objects.length - 1; i > 0; i--) {
        objects[i - 1].child = objects[i];
    }
    return objects[0];
}