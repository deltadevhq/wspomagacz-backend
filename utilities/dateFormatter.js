const { formatDate } = require('./dateUtils');

const formatResponseDates = (data) => {
  if (Array.isArray(data)) {
    data.forEach(item => formatResponseDates(item));
  } else if (data && typeof data === 'object') {
    for (const key in data) {
      if (typeof data[key] === 'object'){
        data[key] = formatResponseDates(data[key]);
      } 
      if (data[key] instanceof Date || (key.endsWith('_at') && data[key])) {
        data[key] = formatDate(data[key]);
      }
    }
  }
  return data;
};

const dateFormatterMiddleware = (req, res, next) => {
  const originalJson = res.json;
  res.json = (data) => {
    originalJson.call(res, formatResponseDates(data));
  };
  next();
};

module.exports = {
  dateFormatterMiddleware,
};