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
  request(path, property, params = {}) {
    return this.instance.get(path, { params })
      .then(({ data }) => {
        const { errCd, errNm, [property]: retval } = data.ctatt;
        const code = parseInt(errCd, 10);
        if (code) {
          throw new Error(`${code}: ${errNm}`);
        }
        return retval;
      });
  }
  getArrivalsByMapid(mapid, max, rt) {
    return this.request('/ttarrivals.aspx', 'eta', { mapid, max, rt });
  }
  getArrivalsByStpid(stpid, max, rt) {
    return this.request('/ttarrivals.aspx', 'eta', { stpid, max, rt });
  }
}

module.exports = Train;
