Bench Warmer
============

_A nearly-complete test bench for the NodeJS HTTP interface._

[![Build Status](https://travis-ci.org/volcano-lair/bench-warmer.svg?branch=master)](https://travis-ci.org/volcano-lair/bench-warmer)

[NPM Package](https://www.npmjs.com/package/bench-warmer)

**Rule The First of Unit Testing:** _Thou shalt not create any network sockets_

**Rule The Second of Unit Testing:** _GOTO Rule The First of Unit Testing_

## Bench.Server

Create an interface for testing server request handlers, like an Express app.

```javascript
const app = Express();
const server = Bench.createServer(app)

// Attach some body-parser middleware (https://github.com/expressjs/body-parser)
app.use(BodyParser.raw());

app.get('/', (req, res) => res.send('hello!'));
app.post('/', (req, res) => {

  res.send('hello!');
});

server.request({ path: '/' })
  .spread((req, res) => {
    /* do unit tests here! */
  })
  .then(() => server.request({
    path: '/', method: 'POST'
  }, (req) => {
    req.write('this is a test!');
    req.end();
  }))
  .spread((req, res) => {
    expect(res.statusCode).to.equal(200);
  });
```

`Bench.createServer(onRequest)` returns an instance of `Bench.Server`. Calling `#request(params, before)` on the `Server` instance returns an extension of `Promise` with a `#spread()` helper. The Promise resolves with the IncomingMessage (request) and ServerResponse instances that were passed through the code under test for assertion testing.

Mocha handles promises in test cases, allowing the result of a request to be returned for asynchronous control:

```javascript
describe('An HTTP test', function() {
  const app = Express();
  const server = Bench.createServer(app)

  it('does something', function() {
    return server.request({/* params */})
      .spread((req, res) => {
        expect(res.statusCode).to.equal(200);
      });
  });
});
```

## Bench.Wire

The `Wire` class provides a simulated, observable channel between client and server interfaces. It can be used to test client code in isolation, or to simulate interactions between client and server modules without any network resources.

```javascript
const client = new Client(/* ... */);
const app = Express();
const wire = Bench.createWire(app);

/*
 * Client libraries must provide an interface to inject a `Wire`
 * instance as their `#request()` provider. This assumes that
 * `client._provider` was a reference to something like `HTTP`.
 */
client._provider = wire;

/*
 * The Wire instance emits events to tap client request and server
 * response events for testing
 */
wire.once('request', (req) => {
  expect(req.path).to.equal('something')
});

wire.once('response', (res) => {
  expect(res.statusCode).to.equal(200)
});

/*
 * Call the client interface's methods to make and capture
 * request/response interactions.
 */
client.makeSomeRequest(/* parameters */)
```

## Bench.Reader

The `Reader` class is a helper for aggregating data from `Readable` streams for testing.

```javascript
/*
 * A Wire instance can be used to unit-test client interactions without any
 * reciprocal server code.
 */
const wire = Bench.createWire((req, res) => {
  Bench.createReader(req, (reader) => {
    expect(reader.body).to.equal('content');

    res.write('stuff');
    res.end();
  })
});
const client = new Client(/* ... */);

client._provider = wire;

// ...
```
