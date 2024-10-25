const fs = require('fs');
const { execSync } = require('child_process');

const repoCreationDate = new Date('2024-08-24');

function getDaysSinceRepoCreation() {
  const today = new Date();
  const diffTime = Math.abs(today - repoCreationDate);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function getTodayCommitCount() {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
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
}

updateVersion();