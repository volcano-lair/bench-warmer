'use strict';
const EventEmitter = require('events').EventEmitter;

const ClientRequest = require('./client-request');
const ServerResponse = require('./server-response');

/**
 * Emulate the behavior of a server receiving an HTTP request from a client under test
 */
class Wire extends EventEmitter {
  /**
   * @constructor
   * @param {Function}  handle  Called with request and response objects to test
   *                            request parameters and form a response to the client
   *                            handler code.
   */
  constructor(handle) {
    super();
    this.handle = handle;
  }

  /**
   * Called by client code under test to make an outgoing request
   * @param {Object}  options Options for the outgoing request
   * @return  {ClientRequest}
   */
  request(options) {
    const request = new ClientRequest(options);
    const response = new ServerResponse();

    request.on('head', () => {
      this.emit('request', request);
      this.handle(request, response);
    });

    response.on('head', () => {
      this.emit('response', response);
      request.emit('response', response);
    });

    return request;
  }
}
module.exports = Wire;
