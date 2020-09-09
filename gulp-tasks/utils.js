// Gulp requires
const fs = require('fs');

let build = 'staging';
// Function that is ran when buildAll is called to determine buildEnv
// This matches the buildDirs in package.json
switch (process.env.npm_config_build) {
  case 'ghpages':
    build = 'ghpages';
    break;
  case 'staging':
    build = 'staging';
    break;
  default:
    build = 'local';
    break;
}

module.exports.build = build;
module.exports.packageJson = JSON.parse(fs.readFileSync('./package.json'));
module.exports.getRoot = path => '../'.repeat(path.match(/\//gi).length); // Function which takes in a path and back counts slashes to get to baseRoot dir
