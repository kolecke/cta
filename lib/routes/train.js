const Train = require('../data/train');
const key = require('../config').train;
const schema = require('../schema/train');

const train = new Train(key);

module.exports = (server) => {
  server.route([{
    method: 'GET',
    path: '/api/train/stations/{mapid}/arrivals',
    config: {
      handler(request) {
        const { mapid } = request.params;
        const { max, rt } = request.query;
        return train.getArrivalsByMapid(mapid, max, rt);
      },
      description: 'Get arrivals by mapid',
      notes: 'This API produces a list of arrival predictions for all platforms at a given train station.',
      tags: ['api', 'train'],
      validate: {
        params: schema.arrivals.requestByMapid,
        query: schema.arrivals.filter,
      },
      response: {
        schema: schema.arrivals.response,
      },
    },
  }, {
    method: 'GET',
    path: '/api/train/stops/{stpid}/arrivals',
    config: {
      handler(request) {
        const { stpid } = request.params;
        const { max, rt } = request.query;
        return train.getArrivalsByStpid(stpid, max, rt);
      },
      description: 'Get arrivals by stpid',
      notes: 'This API produces a list of arrival predictions for all platforms at a given train station.',
      tags: ['api', 'train'],
      validate: {
        params: schema.arrivals.requestByStpid,
        query: schema.arrivals.filter,
      },
      response: {
        schema: schema.arrivals.response,
      },
    },
  }, {
    method: 'GET',
    path: '/api/train/runs/{runnumber}',
    config: {
      handler(request) {
        const { runnumber } = request.params;
        return train.getFollow(runnumber)
          .then(({ position, eta }) => ({ position, arrivals: eta }));
      },
      description: 'Get run',
      notes: 'This API produces a list of arrival predictions for a given train at all subsequent stations for which that train is estimated to arrive, up to 20 minutes in the future or to the end of its trip.',
      tags: ['api', 'train'],
      validate: {
        params: schema.follow.request,
      },
      response: {
        schema: schema.follow.response,
      },
    },
  }, {
    method: 'GET',
    path: '/api/train/routes/{rt}/locations',
    config: {
      handler(request) {
        const { rt } = request.params;
        return train.getLocations(rt);
      },
      description: 'Get locations',
      notes: 'This API produces a list of in-service trains and basic info and their locations for one or more specified ‘L’ routes. Each separate entry describes a single train and provides coordinate, geospatial heading, certain train attributes and next stop information.',
      tags: ['api', 'train'],
      validate: {
        params: schema.locations.request,
      },
      response: {
        schema: schema.locations.response,
      },
    },
  }]);
};
