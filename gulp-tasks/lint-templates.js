// Gulp requires
const { src } = require('gulp');
const plugins = require('gulp-load-plugins')();
const paths = require('./paths');

const lintingTemplates = () => {
  return src(`${paths.nunjucks.output}**/*.html`)
    .pipe(plugins.htmlhint('.htmlhintrc'))
    .pipe(plugins.htmlhint.reporter());
};

module.exports = lintingTemplates;
