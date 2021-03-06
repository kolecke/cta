const axios = require('axios');
const moment = require('moment');

class Bus {
  constructor(key) {
    this.instance = axios.create({
      baseURL: 'http://www.ctabustracker.com/bustime/api/v2',
      params: {
        key,
        locale: 'en',
        format: 'json',
      },
    });
  }
  request(path, property, params = {}) {
    return this.instance.get(path, { params })
      .then(({ data }) => {
        const { error, [property]: retval } = data['bustime-response'];
        if (error) {
          throw new Error(error.map(({ msg }) => msg).join(', '));
        }
        return retval;
      });
  }
  getTime() {
    return this.request('/gettime', 'tm')
      .then(time => ({
        tm: moment(time, 'YYYYMMDD HH:mm:ss').toDate(),
      }));
  }
  getVehiclesByVid(vid, tmres = 's') {
    return this.request('/getvehicles', 'vehicle', { vid, tmres });
  }
  getVehiclesByRt(rt, tmres = 's') {
    return this.request('/getvehicles', 'vehicle', { rt, tmres });
  }
  getRoutes() {
    return this.request('/getroutes', 'routes');
  }
  getDirections(rt) {
    return this.request('/getdirections', 'directions', { rt });
  }
  getStops(rt, dir) {
    return this.request('/getstops', 'stops', { rt, dir });
  }
  getPatternsByPid(pid) {
    return this.request('/getpatterns', 'ptr', { pid });
  }
  getPatternsByRt(rt) {
    return this.request('/getpatterns', 'ptr', { rt });
  }
  getPredictionsByStpid(stpid, rt, top) {
    return this.request('/getpredictions', 'prd', { stpid, rt, top });
  }
  getPredictionsByVid(vid, top) {
    return this.request('/getpredictions', 'prd', { vid, top });
  }
  getServiceBulletins(rt, rtdir, stpid) {
    return this.request('/getservicebulletins', 'sb', { rt, rtdir, stpid });
  }
}

module.exports = Bus;
