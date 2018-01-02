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
    path: '/bus/routes/{rt}/directions',
    config: {
      handler(request) {
        const { rt } = request.params;
        return bus.getDirections(rt);
      },
      description: 'Get directions',
      notes: 'Use the getdirections request to retrieve the set of directions serviced by the specified route.',
      tags: ['api'],
      validate: {
        params: schema.directions.request,
      },
      response: {
        schema: schema.directions.response,
      },
    },
  }, {
    method: 'GET',
    path: '/bus/routes/{rt}/directions/{dir}/stops',
    config: {
      handler(request) {
        const { rt, dir } = request.params;
        return bus.getStops(rt, dir);
      },
      description: 'Get stops',
      notes: 'Use the getstops request to retrieve the set of stops for the specified route and direction. Stop lists are only available for a valid route/direction pair. In other words, a list of all stops that service a particular route (regardless of direction) cannot be requested.',
      tags: ['api'],
      validate: {
        params: schema.stops.request,
      },
      response: {
        schema: schema.stops.response,
      },
    },
  }, {
    method: 'GET',
    path: '/bus/patterns',
    config: {
      handler(request) {
        const { pid, rt } = request.query;
        return bus.getPatterns(pid, rt);
      },
      description: 'Get patterns',
      notes: 'Use the getpatterns request to retrieve the set of geo-positional points and stops that when connected can be used to construct the geo-positional layout of a pattern (i.e., route variation).\n\nUse pid to specify one or more identifiers of patterns whose points are to be returned. A maximum of 10 patterns can be specified.\n\nUse rt to specify a route identifier where all active patterns are returned. The set of active patterns returned includes: one or more patterns for the specified route (all patterns that are currently being executed by at least one vehicle on the specified route).\n\nNote: The pid and rt parameters cannot be combined in one request. If both parameters are specified on a request to getpatterns, only the first parameter specified on the request will be processed.',
      tags: ['api'],
      validate: {
        query: schema.patterns.query,
      },
      response: {
        schema: schema.patterns.response,
      },
    },
  }]);
};
