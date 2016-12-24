'use strict';
const Interaction = require('./interaction');
const Reader = require('./reader');
const Server = require('./server');
const Wire = require('./wire');

exports.Interaction = Interaction;
exports.Server = Server;

/**
 * Create a new Server instance
 * @param {Function}  handle  The HTTP request handler
 * @return {HTTP.Server}
 */
exports.createServer = function(handle) {
  return new Server(handle);
};

exports.Wire = Wire;

/**
 * Create a new Wire instance
 * @param {Function}  handle  Called with request and response objects to test
 *                            request parameters and form a response to the client
 *                            handler code.
 * @return {HTTP.Wire}
 */
exports.createWire = function(handle) {
  return new Wire(handle);
};

exports.Reader = Reader;

/**
 * Create a stream reader to aggregate data chunks and continue on end.
 * @param  {ReadableStream} stream A readable stream
 * @return {Interaction}
 */
exports.createReader = function(stream) {
  return new Interaction((resolve, reject) => {
    new Reader(stream, (err, data) => {
      if (err) { return reject(err); }
      resolve(data);
    });
  });
};

exports.ClientRequest = require('./client-request');
exports.IncomingMessage = require('./incoming-message');
exports.ServerResponse = require('./server-response');
