const moment = require('moment-timezone');
const { application_timezone } = require('../config/settings');

// Function to generate a timestamp in timezone from configuration
const getTimestamp = () => moment().tz(application_timezone).format('YYYY-MM-DD HH:mm:ss');

// Function to convert date to a timestamp in timezone from configuration
const formatDate = (date) => moment(date).tz(application_timezone).format();

module.exports = {
  getTimestamp,
  formatDate,
}