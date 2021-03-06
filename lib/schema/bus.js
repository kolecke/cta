const Joi = require('joi');

const request = {
  vids: Joi.string()
    .description('Set of one or more vehicle IDs whose data should be returned. For example: 509,392,201,4367 will return data for four vehicles (if available). A maximum of 10 identifiers can be specified.'),
  rts: Joi.string()
    .description('Set of one or more route designators for which matching data should be returned. For example: X3,4,20 will return data for all vehicles currently running those three routes (if available). A maximum of 10 identifiers can be specified.'),
  rt: Joi.string()
    .description('Alphanumeric designator of a route (ex. "20" or "X20") for which a list of available data is to be returned.'),
  top: Joi.number().integer()
    .description('Maximum number of predictions to be returned.'),
};

module.exports = {
  time: {
    response: Joi.object({
      tm: Joi.date().iso()
        .description('The current system date and (local) time. Date and time is represented in the following format: YYYYMMDD HH:MM:SS. Month is represented as two digits where January is equal to "01" and December is equal to "12". Time is represented using a 24-hour clock.'),
    }).label('time')
      .description('The current system time will be returned as a response to gettime.'),
  },
  vehicles: {
    requestByVid: Joi.object({
      vid: request.vids,
    }),
    requestByRt: Joi.object({
      rt: request.rts,
    }),
    response: Joi.array().items(Joi.object({
      vid: Joi.string()
        .description('Alphanumeric string representing the vehicle ID (ie. bus number)'),
      tmstmp: Joi.string()
        .description('Date and local time of the last positional update of the vehicle. Date and time is represented in the following format: YYYYMMDD HH:MM. Month is represented as two digits where January is equal to "01" and December is equal to "12". Time is represented using a 24-hour clock.'),
      lat: Joi.string()
        .description('Latitude position of the vehicle in decimal degrees (WGS 84).'),
      lon: Joi.string()
        .description('Longitude position of the vehicle in decimal degrees (WGS 84).'),
      hdg: Joi.string()
        .description('Heading of vehicle as a 360º value, where 0º is North, 90º is East, 180º is South and 270º is West.'),
      pid: Joi.number().integer()
        .description('Pattern ID of trip currently being executed.'),
      rt: Joi.string()
        .description('Route that is currently being executed by the vehicle (ex. "20").'),
      des: Joi.string()
        .description('Destination of the trip being executed by the vehicle (ex. "Austin").'),
      pdist: Joi.number().integer()
        .description('Linear distance in feet that the vehicle has traveled into the pattern currently being executed.'),
      dly: Joi.boolean()
        .description('The value is "true" if the vehicle is delayed. The dly element is only present if the vehicle is delayed.'),
      tatripid: Joi.string()
        .description('TA\'s version of the scheduled trip identifier for the vehicle\'s current trip.'),
      tablockid: Joi.string()
        .description('TA\'s version of the scheduled block identifier for the work currently being performed by the vehicle.'),
      zone: Joi.string().allow('')
        .description('Child element of the prd element. The zone name if the vehicle has entered a defined zone, otherwise blank.'),
    }).label('vehicle')
      .description('Encapsulates all information available for a single vehicle in the response.')).label('vehicles')
      .description('The response will include the most-recent status for each vehicle.'),
  },
  routes: {
    response: Joi.array().items(Joi.object({
      rt: Joi.string().example('20')
        .description('Alphanumeric designator of a route (ex. "20" or "X20").'),
      rtnm: Joi.string().example('Madison')
        .description('Common name of the route (ex. "Madison" for the 20 route).'),
      rtclr: Joi.string().example('#336633'),
      rtdd: Joi.string().example('20'),
    }).label('route')
      .description('Encapsulates a route serviced by the system.')).label('routes'),
  },
  directions: {
    request: Joi.object({
      rt: request.rt,
    }),
    response: Joi.array().items(Joi.object({
      dir: Joi.string().example('Eastbound')
        .description('Direction that is valid for the specified route designator. For example, "East Bound".'),
    }).label('direction')).label('directions'),
  },
  stops: {
    request: Joi.object({
      rt: request.rt,
      dir: Joi.string()
        .description('Direction of the route (ex. "East Bound") for which a list of available stops is to be returned.'),
    }),
    response: Joi.array().items(Joi.object({
      stpid: Joi.string()
        .description('Unique identifier representing this stop.'),
      stpnm: Joi.string()
        .description('Display name of this stop (ex. "Madison and Clark")'),
      lat: Joi.number()
        .description('Latitude position of the stop in decimal degrees (WGS 84).'),
      lon: Joi.number()
        .description('Longitude position of the stop in decimal degrees (WGS 84).'),
    }).label('stop')
      .description('Encapsulates all descriptive information about a particular stop.')).label('stops'),
  },
  patterns: {
    requestByPid: Joi.object({
      pid: Joi.string()
        .description('Set of one or more pattern IDs whose points should be returned. For example: 56,436,1221 will return points from three (3) patterns. A maximum of 10 identifiers can be specified.'),
    }),
    requestByRt: Joi.object({
      rt: request.rt,
    }),
    response: Joi.array().items(Joi.object({
      pid: Joi.number().integer()
        .description('ID of pattern.'),
      ln: Joi.number().integer()
        .description('Length of the pattern in feet.'),
      rtdir: Joi.string()
        .description('Direction that is valid for the specified route designator. For example, "East Bound".'),
      pt: Joi.array().items(Joi.object({
        seq: Joi.number().integer()
          .description('Position of this point in the overall sequence of points.'),
        lat: Joi.number()
          .description('Latitude position of the point in decimal degrees (WGS 84).'),
        lon: Joi.number()
          .description('Longitude position of the point in decimal degrees (WGS 84).'),
        typ: Joi.string()
          .description('\'S\' if the point represents a Stop, \'W\' if the point represents a waypoint along the route.'),
        stpid: Joi.string()
          .description('If the point represents a stop, the unique identifier of the stop.'),
        stpnm: Joi.string()
          .description('If the point represents a stop, the display name of the stop.'),
        pdist: Joi.number().integer()
          .description('If the point represents a stop, the linear distance of this point (feet) into the requested pattern.'),
      }).label('point')).label('points')
        .description('Encapsulates one a set of geo-positional points (including stops) that when connected define a pattern.'),
    }).label('pattern')
      .description('Encapsulates a set of points which define a pattern.')).label('patterns'),
  },
  predictions: {
    requestByStpid: Joi.object({
      stpid: Joi.string()
        .description('Set of one or more stop IDs whose predictions are to be returned. For example: 5029,1392,2019,4367 will return predictions for the four stops. A maximum of 10 identifiers can be specified.'),
    }),
    filterByRt: Joi.object({
      rt: request.rts,
      top: request.top,
    }),
    requestByVid: Joi.object({
      vid: request.vids,
    }),
    filterByTop: Joi.object({
      top: request.top,
    }),
    response: Joi.array().items(Joi.object({
      tmstmp: Joi.string()
        .description('Date and time (local) the prediction was generated. Date and time is represented in the following format: YYYYMMDD HH:MM. Month is represented as two digits where January is equal to "01" and December is equal to "12". Time is represented using a 24-hour clock.'),
      typ: Joi.string()
        .description('Type of prediction. \'A\' for an arrival prediction (prediction of when the vehicle will arrive at this stop). \'D\' for a departure prediction (prediction of when the vehicle will depart this stop, if applicable). Predictions made for first stops of a route or layovers are examples of departure predictions.'),
      stpid: Joi.string()
        .description('Unique identifier representing the stop for which this prediction was generated.'),
      stpnm: Joi.string()
        .description('Display name of the stop for which this prediction was generated.'),
      vid: Joi.string()
        .description('Unique ID of the vehicle for which this prediction was generated.'),
      dstp: Joi.number().integer()
        .description('Linear distance (feet) left to be traveled by the vehicle before it reaches the stop associated with this prediction.'),
      rt: Joi.string()
        .description('Alphanumeric designator of the route (ex. "20" or "X20") for which this prediction was generated.'),
      rtdir: Joi.string()
        .description('Direction of travel of the route associated with this prediction (ex. "East Bound").'),
      des: Joi.string()
        .description('Final destination of the vehicle associated with this prediction.'),
      prdtm: Joi.string()
        .description('Predicted date and time (local) of a vehicle\'s arrival or departure to the stop associated with this prediction. Date and time is represented in the following format: YYYYMMDD HH:MM. Month is represented as two digits where January is equal to "01" and December is equal to "12". Time is represented using a 24-hour clock.'),
      dly: Joi.boolean()
        .description('"true" if the vehicle is delayed. The dly element is only present if the vehicle that generated this prediction is delayed.'),
      tablockid: Joi.string()
        .description('TA\'s version of the scheduled block identifier for the work currently being performed by the vehicle.'),
      tatripid: Joi.string()
        .description('TA\'s version of the scheduled trip identifier for the vehicle\'s current trip.'),
      prdctdn: Joi.string()
        .description('This is the time left, in minutes, until the bus arrives at this stop.'),
      zone: Joi.string().allow('')
        .description('The zone name if the vehicle has entered a defined zones, otherwise blank.'),
      rtdd: Joi.string(),
    }).label('prediction')).label('predictions'),
  },
};
