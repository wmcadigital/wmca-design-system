const del = require('del');
const paths = require('./paths');

const cleaningDir = () => {
  return del([paths.output, paths.logs.sourcemaps, paths.clean.a11y, paths.clean.tmp]);
};

module.exports = cleaningDir;
