const { execSync } = require('child_process');

function getCurrentBranch() {
  return execSync('git symbolic-ref --short -q HEAD')
    .toString()
    .trim()
    .toLowerCase();
}

module.exports = {
  getCurrentBranch,
};
