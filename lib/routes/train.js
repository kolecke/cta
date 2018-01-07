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
  }]);
};