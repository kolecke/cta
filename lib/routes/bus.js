const Bus = require('../data/bus');
const key = require('../config').bus;
const schema = require('../schema/bus');

const bus = new Bus(key);

module.exports = (server) => {
  server.route([{
    method: 'GET',
    path: '/bus/time',
    config: {
      handler() {
        return bus.getTime();
      },
      description: 'Get time',
      notes: 'Use the gettime request to retrieve the current system date and time. Since BusTime is a time-dependent system, it is important to synchronize your application with BusTime\'s system date and time.\n\nThe time specified is the local time.',
      tags: ['api'],
      response: {
        schema: schema.time.response,
      },
    },
  }, {
    method: 'GET',
    path: '/bus/vehicles',
    config: {
      handler(request) {
        const { vid, rt, tmres } = request.query;
        return bus.getVehicles(vid, rt, tmres);
      },
      description: 'Get vehicles',
      notes: 'Use the getvehicles request to retrieve vehicle information (i.e., locations) of all or a subset of vehicles currently being tracked by BusTime.\n\nUse the vid parameter to retrieve information for one or more vehicles currently being tracked.\n\nUse the rt parameter to retrieve information for vehicles currently running one or more of the specified routes. \n\nNote: The vid and rt parameters cannot be combined in one request. If both parameters are specified on a request to getvehicles, only the first parameter specified on the request will be processed.',
      tags: ['api'],
      validate: {
        query: schema.vehicles.query,
      },
      response: {
        schema: schema.vehicles.response,
      },
    },
  }, {
    method: 'GET',
    path: '/bus/routes',
    config: {
      handler() {
        return bus.getRoutes();
      },
      description: 'Get routes',
      notes: 'Use the getroutes request to retrieve the set of routes serviced by the system.',
      tags: ['api'],
      response: {
        schema: schema.routes.response,
      },
    },
  }, {
    method: 'GET',
    path: '/bus/directions',
    config: {
      handler(request) {
        const { rt } = request.query;
        return bus.getDirections(rt);
      },
      description: 'Get directions',
      notes: 'Use the getdirections request to retrieve the set of directions serviced by the specified route.',
      tags: ['api'],
      validate: {
        query: schema.directions.query,
      },
      response: {
        schema: schema.directions.response,
      },
    },
  }, {
    method: 'GET',
    path: '/bus/stops',
    config: {
      handler(request) {
        const { rt, dir } = request.query;
        return bus.getStops(rt, dir);
      },
      description: 'Get stops',
      notes: 'Use the getstops request to retrieve the set of stops for the specified route and direction. Stop lists are only available for a valid route/direction pair. In other words, a list of all stops that service a particular route (regardless of direction) cannot be requested.',
      tags: ['api'],
      validate: {
        query: schema.stops.query,
      },
      response: {
        schema: schema.stops.response,
      }
    },
  }]);
};
