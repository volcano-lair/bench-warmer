'use strict';
const HTTP = require('http');
const HTTPMessage = require('./http-message');

/**
 * Emulate an `HTTP.ServerResponse` for testing
 */
class ServerResponse extends HTTPMessage {
  /**
   * @constructor
   * @param {Object}  options HTTP response options
   */
  constructor(options) {
    super();

    Object.assign(this, {
      headers: {},
      httpVersion: '1.1',
      method: 'GET',
      statusCode: 200,
      trailers: {}
    }, options);

    this.statusMessage = HTTP.STATUS_CODES[this.statusCode];
    this.finished = false;
  }

  /**
   * Add HTTP trailing headers
   * @param {Object}  headers
   */
  addTrailers(headers) {
    Object.assign(this.trailers, headers);
  }

  /**
   * Finishes sending the response. If any parts of the body are unsent,
   * it will flush them to the stream.
   * @param {Buffer|String} chunk Final body chunk to send.
   * @param {String}  [encoding=utf8]  Encoding for String-type chunks.
   * @param {Function}  [callback]  Called when the response stream is finished.
   */
  end(chunk, encoding, callback) {
    if (chunk) {
      this.write(chunk, encoding, callback);
    } else {
      this.writeHead();
    }

    super.end();

    this.finished = true;
    this.emit('finish');
  }

  /**
   * Write a chunk to the stream
   * @param {Buffer|String} chunk Send a body chunk.
   * @param {String}  [encoding=utf8]  Encoding for String-type chunks.
   * @param {Function}  [callback]  Called when the chunk is flushed.
   */
  write(chunk, encoding, callback) {
    this.writeHead();
    super.write(chunk, encoding, callback);
  }

  /**
   * Send response header to the request.
   * @param {Number}  code  Set the response statusCode
   * @param {String}  message Set the response statusMessage
   * @param {Object}  headers Set response headers
   */
  writeHead(code, message, headers) {
    if (this.headersSent) { return; }
    this.headersSent = true;

    if (code) { this.statusCode = code; }
    if (message) { this.statusMessage = message; }
    if (headers) { this.headers = headers; }

    this.emit('head');
  }
}
module.exports = ServerResponse;
