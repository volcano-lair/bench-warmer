'use strict';
const PassThrough = require('stream').PassThrough;

/**
 * Base interface for HTTP request/response classes
 */
class HTTPMessage extends PassThrough {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.headersSent = false;
  }

  /**
   * Read a header value
   * @param {String}  name
   * @return  {String}
   */
  getHeader(name) {
    return this.headers[name.toLowerCase()];
  }

  /**
   * Remove a header from the request
   * @param {String}  name
   */
  removeHeader(name) {
    if (this.headersSent) { throw new Error('Cannot modify headers after they have been sent'); }

    delete this.headers[name.toLowerCase()];
  }

  /**
   * Add a header to the request
   * @param {String}  name
   * @param {String}  value
   */
  setHeader(name, value) {
    if (this.headersSent) { throw new Error('Cannot modify headers after they have been sent'); }

    this.headers[name.toLowerCase()] = value;
  }

  /**
   * Set a timeout
   * @param {Number}  interval  Milliseconds
   * @param {Function}  handle
   * @return {ClientRequest}
   */
  setTimeout(interval, handle) {
    setTimeout(handle, interval);

    return this;
  }
}
module.exports = HTTPMessage;
