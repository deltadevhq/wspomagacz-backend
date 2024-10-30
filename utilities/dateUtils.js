const moment = require('moment-timezone');
const { applicationTimezone } = require('../config/settings');

// Function to generate a timestamp in timezone from configuration
const getTimestamp = () => moment().tz(applicationTimezone).format('YYYY-MM-DD HH:mm:ss');

// Function to convert date to a timestamp in timezone from configuration
const formatDate = (date) => moment(date).tz(applicationTimezone);

module.exports = {
  getTimestamp,
  formatDate,
};