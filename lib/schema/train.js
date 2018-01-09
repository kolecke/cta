const Joi = require('joi');

const arrivals = Joi.array().items(Joi.object({
  staId: Joi.string()
    .description('Numeric GTFS parent station ID which this prediction is for (five digits in 4xxxx range) (matches "mapid" specified by requestor in query)'),
  stpId: Joi.string()
    .description('Numeric GTFS unique stop ID within station which this prediction is for (five digits in 3xxxx range)'),
  staNm: Joi.string()
    .description('Textual proper name of parent station'),
  stpDe: Joi.string()
    .description('Textual description of platform for which this prediction applies'),
  rn: Joi.string()
    .description('Run number of train being predicted for'),
  rt: Joi.string()
    .description('Textual, abbreviated route name of train being predicted for (matches GTFS routes)'),
  destSt: Joi.string()
    .description('GTFS unique stop ID where this train is expected to ultimately end its service run (experimental and supplemental only—see note below)'),
  destNm: Joi.string()
    .description('Friendly destination description (see note below)'),
  trDr: Joi.string()
    .description('Numeric train route direction code (see appendices)'),
  prdt: Joi.string()
    .description('Date-time format stamp for when the prediction was generated: yyyyMMdd HH:mm:ss (24-hour format, time local to Chicago)'),
  arrT: Joi.string()
    .description('Date-time format stamp for when a train is expected to arrive/depart: yyyyMMdd HH:mm:ss (24-hour format, time local to Chicago)'),
  isApp: Joi.string()
    .description('Indicates that Train Tracker is now declaring "Approaching" or "Due" on site for this train'),
  isSch: Joi.string()
    .description('Boolean flag to indicate whether this is a live prediction or based on schedule in lieu of live data'),
  isFlt: Joi.string()
    .description('Boolean flag to indicate whether a potential fault has been detected (see note below)'),
  isDly: Joi.string()
    .description('Boolean flag to indicate whether a train is considered "delayed" in Train Tracker'),
  flags: Joi.string().allow(null)
    .description('Train flags (not presently in use)'),
  lat: Joi.string()
    .description('Latitude position of the train in decimal degrees'),
  lon: Joi.string()
    .description('Longitude position of the train in decimal degrees'),
  heading: Joi.string()
    .description('Heading, expressed in standard bearing degrees (0 = North, 90 = East, 180 = South, and 270 = West; range is 0 to 359, progressing clockwise)'),
}).label('arrival')).label('arrivals');

module.exports = {
  arrivals: {
    requestByMapid: Joi.object({
      mapid: Joi.number().integer()
        .description('A single five-digit code to tell the server which station you\'d like to receive predictions for. See appendix for information about valid station codes.'),
    }),
    requestByStpid: Joi.object({
      stpid: Joi.number().integer()
        .description('A single five-digit code to tell the server which specific stop (in this context, specific platform or platform side within a larger station) you\'d like to receive predictions for. See appendix for information about valid stop codes.'),
    }),
    filter: Joi.object({
      max: Joi.number().integer()
        .description('The maximum number you\'d like to receive (if not specified, all available results for the requested stop or station will be returned)'),
      rt: Joi.string()
        .description('Allows you to specify a single route for which you\'d like results (if not specified, all available results for the requested stop or station will be returned)'),
    }),
    response: arrivals,
  },
  follow: {
    request: Joi.object({
      runnumber: Joi.number().integer()
        .description('Allows you to specify a single run number for a train for which you\'d like a series of upcoming arrival estimations.'),
    }),
    response: Joi.object({
      position: Joi.object(),
      arrivals,
    }).label('follow'),
  },
  locations: {
    request: Joi.object({
      rt: Joi.string()
        .description('Allows you to specify one or more routes for which you\'d like train location information.'),
    }),
    response: Joi.array().items(Joi.object({
      '@name': Joi.string()
        .description('indicates route per GTFS-matching route identifiers'),
      train: Joi.array().items(Joi.object({
        rn: Joi.string()
          .description('Run number'),
        destSt: Joi.string()
          .description('GTFS unique stop ID where this train is expected to ultimately end its service run (experimental and supplemental only—see note below)'),
        destNm: Joi.string()
          .description('Friendly destination description (see note below)'),
        trDr: Joi.string()
          .description('Numeric train route direction code (see appendices)'),
        nextStaId: Joi.string()
          .description('Next station ID (parent station ID matching GTFS)'),
        nextStpId: Joi.string()
          .description('Next stop ID (stop ID matching GTFS)'),
        nextStaNm: Joi.string()
          .description('Proper name of next station'),
        prdt: Joi.string()
          .description('Date-time format stamp for when the prediction was generated: yyyyMMdd HH:mm:ss (24-hour format, time local to Chicago)'),
        arrT: Joi.string()
          .description('Date-time format stamp for when a train is expected to arrive/depart: yyyyMMdd HH:mm:ss (24-hour format, time local to Chicago)'),
        isApp: Joi.string()
          .description('Indicates that Train Tracker is now declaring "Approaching" or "Due" on site for this train'),
        isDly: Joi.string()
          .description('Boolean flag to indicate whether a train is considered "delayed" in Train Tracker'),
        flags: Joi.string().allow(null)
          .description('Train flags (not presently in use)'),
        lat: Joi.string()
          .description('Latitude position of the train in decimal degrees'),
        lon: Joi.string()
          .description('Longitude position of the train in decimal degrees'),
        heading: Joi.string()
          .description('Heading, expressed in standard bearing degrees (0 = North, 90 = East, 180 = South, and 270 = West; range is 0 to 359, progressing clockwise)'),
      })),
    })),
  },
};
