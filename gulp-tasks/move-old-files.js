// Gulp requires
const { src, dest } = require('gulp');

// Local requires
const paths = require('./paths.js');

module.exports.moveOldCSS = () => {
  return src('src/wmcads/assets/old/css/wmcads-components.min.css').pipe(dest(paths.styles.output));
};

module.exports.moveOldReactNative = () => {
  return src('src/wmcads/assets/old/css/react-native/wmcads-components.min.js').pipe(
    dest(`${paths.styles.output}react-native/`)
  );
};

module.exports.moveOldIcons = () => {
  return src('src/wmcads/assets/old/img/wmcads-sprite.min.svg').pipe(dest(paths.svgs.dest)); // move config files to build
};
