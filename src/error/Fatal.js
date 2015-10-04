/**
 * Fatal
 *
 * This is an error that cannot be recovered from. This
 * is likely to be either when a datastore cannot respond
 * or similar. Ultimately, this would return an HTTP 503
 * error (or equivalent).
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
var Exception = require("./Exception");


module.exports = Exception.extend({

    type: "Fatal"

});
