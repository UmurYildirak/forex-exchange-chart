import moment from 'moment';

const RequestParams = {
    "15M": {
      multiplier: 1,
      timespan: 'minute',
      from: moment().format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
      limit: 15,
    },
    "1H": {
      multiplier: 3,
      timespan: 'minute',
      from: moment().format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
      limit: 60,
    },
    "1D": {
      multiplier: 1,
      timespan: 'hour',
      from: moment().subtract(1, 'days').format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
      limit: 48,
    },
    "1W": {
      multiplier: 1,
      timespan: 'day',
      from: moment().subtract(7, 'days').format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
      limit: 42,
    },
    "1M": {
      multiplier: 1,
      timespan: 'day',
      from: moment().subtract(30, 'days').format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
      limit: 30,
    },
  }

  export default RequestParams;