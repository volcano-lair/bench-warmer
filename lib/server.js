'use strict';
const Interaction = require('./interaction');

const IncomingMessage = require('./incoming-message');
const ServerResponse = require('./server-response');

/**
 * Implement the `HTTP.Server` interface for testing of `Event: request`
 * handlers like Express apps.
 */
class Server {
  /**
   * @constructor
   * @param {Function}  handle  The HTTP request handler
   */
  constructor(handle) {
    this.handle = handle;
  }

  /**
   * Initialize an incoming request to a server-handler
   * @param {Object}    options   Optional parameters to assign to the request instance
   * @param {Function}  [before]  An optional pre-request handler to manipulate the IncomingMessage instance
   * @return  {ServerInteraction}
   */
  request(options, before) {
    return new Interaction((resolve, reject) => {
      const request = new IncomingMessage(options);
      const response = new ServerResponse();

      if (before) { before(request); }

      response.on('head', () => resolve([request, response]));
      response.on('error', (err) => reject(err));

      this.handle(request, response);
    });
  }
}
module.exports = Server;
