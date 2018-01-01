const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const bus = require('./routes/bus');

async function start() {
  const server = await Hapi.server({
    host: 'localhost',
    port: 3000,
    debug: {
      log: '*',
      request: '*',
    },
  });
  await server.register([
    Inert,
    Vision,
    HapiSwagger,
  ]);
  await server.start();
  bus(server);
}
start();
