const Joi = require('joi');

module.exports = {
  time: {
    response: Joi.object({
      tm: Joi.date().iso()
        .description('The current system date and (local) time. Date and time is represented in the following format: YYYYMMDD HH:MM:SS. Month is represented as two digits where January is equal to "01" and December is equal to "12". Time is represented using a 24-hour clock.'),
    }).label('time')
      .description('The current system time will be returned as a response to gettime.'),
  },
  vehicles: {
    query: Joi.object({
      vid: Joi.string()
        .description('Set of one or more vehicle IDs whose location should be returned. For example: 509,392,201,4367 will return information for four vehicles (if available). A maximum of 10 identifiers can be specified. '),
      rt: Joi.string()
        .description('Set of one or more route designators for which matching vehicles should be returned. For example: X3,4,20 will return information for all vehicles currently running those three routes (if available). A maximum of 10 identifiers can be specified.'),
      tmres: Joi.string().valid(['m', 's']).default('m')
        .description('Resolution of time stamps. Set to "s" to get time resolution to the second. Set to "m" to get time resolution to the minute. If omitted, defaults to "m". \n\nDate and time is represented in the following format: \n\nIf specified as "s" \n\nYYYYMMDD HH:MM:SS \n\nIf specified as "m" \n\nYYYYMMDD HH:MM \n\nMonth is represented as two digits where January is equal to "01" and December is equal to "12". Time is represented using a 24-hour clock.'),
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
    query: Joi.object({
      rt: Joi.string()
        .description('Alphanumeric designator of a route (ex. "20" or "X20") for which a list of available directions is to be returned.'),
    }),
    response: Joi.array().items(Joi.object({
      dir: Joi.string().example('Eastbound')
        .description('Direction that is valid for the specified route designator. For example, "East Bound".'),
    }).label('direction')).label('directions'),
  },
  stops: {
    query: Joi.object({
      rt: Joi.string()
        .description('Alphanumeric designator of the route (ex. “20” or “X20”) for which a list of available stops is to be returned.'),
      dir: Joi.string()
        .description('Direction of the route (ex. “East Bound”) for which a list of available stops is to be returned.'),
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
};