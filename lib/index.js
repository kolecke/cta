const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const bus = require('./routes/bus');
const Pack = require('../package');

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
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: 'CTA Tracker API',
          version: Pack.version,
          description: Pack.description,
        },
        grouping: 'tags',
      },
    },
  ]);
  await server.start();
  bus(server);
}
start();
