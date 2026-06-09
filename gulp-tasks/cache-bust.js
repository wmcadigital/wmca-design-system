// Gulp requires
const { src, dest } = require('gulp');
const plugins = require('gulp-load-plugins')();
// Local requires
const paths = require('./paths.js');

const bustingCache = () => {
  const cbString = new Date().getTime();
  return src([`${paths.server.baseDir}**/*.html`])
    .pipe(plugins.replace(/\?cb=[0-9]*/gm, `?cb=${cbString}`))
    .pipe(dest(paths.server.baseDir));
};

module.exports = bustingCache;
