const axios = require('axios');

class Train {
  constructor(key) {
    this.instance = axios.create({
      baseURL: 'http://lapi.transitchicago.com/api/1.0',
      params: {
        key,
        outputType: 'JSON',
      },
    });
  }
  request(path, properties, params = {}) {
    return this.instance.get(path, { params })
      .then(({ data: { ctatt } }) => {
        const { errCd, errNm } = ctatt;
        if (errCd !== '0') {
          throw new Error(`${errCd}: ${errNm}`);
        }
        if (properties.length === 1) {
          return ctatt[properties[0]];
        }
        return properties.reduce((obj, property) => Object.assign(obj, {
          [property]: ctatt[property],
        }), {});
      });
  }
  getArrivalsByMapid(mapid, max, rt) {
    return this.request('/ttarrivals.aspx', ['eta'], { mapid, max, rt });
  }
  getArrivalsByStpid(stpid, max, rt) {
    return this.request('/ttarrivals.aspx', ['eta'], { stpid, max, rt });
  }
  getFollow(runnumber) {
    return this.request('/ttfollow.aspx', ['position', 'eta'], { runnumber });
  }
  getLocations(rt) {
    return this.request('/ttpositions.aspx', ['route'], { rt });
  }
}

module.exports = Train;
