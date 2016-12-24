'use strict';
const HTTPMessage = require('./http-message');

/**
 * Emulate an `HTTP.ClientRequest` instance for testing
 */
class ClientRequest extends HTTPMessage {
  /**
   * @constructor
   * @param {Object}  options `HTTP.request()` options
   */
  constructor(options) {
    super();

    Object.assign(this, {
      protocol: 'http:',
      hostname: 'localhost',
      family: 4,
      port: 80,
      method: 'GET',
      path: '/',
      headers: {}
    }, options);
  }

  /**
   * Emit an `abort` event
   */
  abort() {
    this.emit('abort');
  }

  /**
   * Emit an `aborted` event
   */
  aborted() {
    this.emit('aborted');
  }

  /**
   * Emit an `error` event
   * @param {Error} err An Error instance to emit
   */
  error(err) {
    this.emit('error', err);
  }

  /**
   * Finishes sending the request. If any parts of the body are unsent,
   * it will flush them to the stream.
   * @param {Buffer|String} chunk Final body chunk to send.
   * @param {String}  [encoding=utf8]  Encoding for String-type chunks.
   * @param {Function}  [callback]  Called when the request stream is finished.
   */
  end(chunk, encoding, callback) {
    if (chunk) {
      this.write(chunk, encoding, callback);
    } else {
      this.flushHeaders();
    }

    super.end();
  }

  /**
   * Notifies test frameworks that headers have been sent. Called internally by
   * `write` and `end` before piping any data to the stream.
   */
  flushHeaders() {
    if (this.headersSent) { return; }

    this.headersSent = true;
    this.emit('head');
  }

  /**
   * Set the `noDelay` flag for testing
   * @param {Boolean} noDelay
   */
  setNoDelay(noDelay) {
    this.noDelay = noDelay;
  }

  /**
   * Set the `socketKeepAlive` flag for testing
   * @param {Boolean} enable
   */
  setSocketKeepAlive(enable) {
    this.socketKeepAlive = enable;
  }

  /**
   * Write a chunk to the stream
   * @param {Buffer|String} chunk Send a body chunk.
   * @param {String}  [encoding=utf8]  Encoding for String-type chunks.
   * @param {Function}  [callback]  Called when the chunk is flushed.
   */
  write(chunk, encoding, callback) {
    this.flushHeaders();
    super.write(chunk, encoding, callback);
  }
}
module.exports = ClientRequest;
