/**
 * Plugin
 *
 * Manages the registration and use of a Steeplejack
 * plugin. This is so that whole sections of code,
 * written in Steeplejack-friendly syntax, can be
 * exported as a separate package and reused.
 *
 * Isn't DRY code marvellous?
 */

/* Node modules */

/* Third-party modules */
import { _ } from 'lodash';
import { Base } from '@steeplejack/core';

/* Files */

class Plugin extends Base {
  constructor (files = null) {
    super();

    this.myModules = [];

    /* Set the module files */
    this.modules = files;
  }

  /**
   * Modules
   *
   * Gets the modules array
   *
   * @returns {*[]}
   */
  get modules () {
    return this.myModules;
  }

  /**
   * Modules
   *
   * Sets the modules to be included with this
   * plugin
   *
   * @param {*} module
   */
  set modules (module) {
    if (_.isArray(module)) {
      /* Array of modules - cycle through */
      _.each(module, (mod) => {
        this.modules = mod;
      });
    } else if (_.isUndefined(module) === false && _.isNull(module) === false) {
      this.myModules.push(module);
    }
  }
}

module.exports = Plugin;
