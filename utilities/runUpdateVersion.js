const fs = require('fs');
const { execSync } = require('child_process');
const moment = require('moment-timezone');
const { applicationTimezone } = require('../config/settings');

const repoCreationDate = moment.tz('2024-08-24', applicationTimezone);

function getDaysSinceRepoCreation() {
  const today = moment.tz(applicationTimezone);
  console.log(today);
  return today.diff(repoCreationDate, 'days');
}

function getTodayCommitCount() {
  const startOfDay = moment.tz(applicationTimezone).startOf('day').toISOString();
  const commitCount = execSync(`git rev-list --count --since="${startOfDay}" HEAD`).toString().trim();
  return parseInt(commitCount, 10) + 1; 
}

function updateVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  let [major, ,] = packageJson.version.split('.').map(Number);

  const daysSinceCreation = getDaysSinceRepoCreation();
  const commitCountToday = getTodayCommitCount();

  packageJson.version = `${major}.${daysSinceCreation}.${commitCountToday}`;

  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  console.log(`Updated version to ${packageJson.version}`)
}

updateVersion();