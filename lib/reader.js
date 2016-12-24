'use strict';
/**
 * Read a readable stream into a string
 */
class Reader {
  /**
   * @constructor
   * @param {Stream.Readable} stream
   * @param {Function}  done  Called after the stream has ended
   */
  constructor(stream, done) {
    this.chunks = [];

    stream.on('error', (err) => done(err));
    stream.on('data', (chunk) => this._chunk(chunk));
    stream.on('end', () => {
      this._ended();
      done(null, this);
    });
  }

  /**
   * @private
   * @param {Buffer}  data
   */
  _chunk(data) {
    this.chunks.push(data);
  }

  /**
   * @private
   */
  _ended() {
    this.body = Buffer.concat(this.chunks).toString('utf8');
  }
}
module.exports = Reader;
