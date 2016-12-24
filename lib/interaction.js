'use strict';

/**
 * Add some useful methods to the Promise interface
 */
class Interaction extends Promise {
  /**
   * Spread resolved values into arguments to the handler
   * @param {Function}  handle  Resolved handler
   * @return {Interaction}
   */
  spread(handle) {
    return this.then((args) => handle.apply(null, args));
  }

  /**
   * Set the same handler for resolved and rejected
   * @param {Function}  handle
   * @return {Interaction}
   */
  finally(handle) {
    return this.then(() => handle(), (err) => handle(err));
  }
}
module.exports = Interaction;
