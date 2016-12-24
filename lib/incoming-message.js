'use strict';
const PassThrough = require('stream').PassThrough;
const HTTP = require('http');

/**
 * Testing stubs for HTTP.IncomingMessage and HTTP.ServerResponse
 */
class IncomingMessage extends PassThrough {
  /**
   * @constructor
   * @param {Object}  options Set IncomingMessage parameters
   */
  constructor(options) {
    options = Object.assign({}, options);
    super();

    Object.assign(this, {
      headers: {},
      httpVersion: '1.1',
      method: 'GET',
      statusCode: 200,
      trailers: {},
      url: '/'
    }, options);

    this.statusMessage = options.statusMessage || HTTP.STATUS_CODES[this.statusCode];
  }

  /**
   * Emit an `aborted` event
   */
  aborted() {
    this.emit('aborted');
  }

  /**
   * Emit a `close` event
   */
  close() {
    this.emit('close');
  }

  /**
   * Emit an `error` event
   * @param {Error} err
   */
  destroy(err) {
    this.emit('error', err);
  }

  /**
   * Set a timeout
   * @param {Number}  interval  Milliseconds
   * @param {Function}  handle
   * @return  {IncomingMessage}
   */
  setTimeout(interval, handle) {
    setTimeout(handle, interval);

    return this;
  }
}
module.exports = IncomingMessage;
