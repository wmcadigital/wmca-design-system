// Gulp requires
const { src, dest } = require('gulp');

// Local requires
const paths = require('./paths.js');

const movingOldCSS = () => {
  return src('src/wmcads/assets/old/css/wmcads-components.min.css').pipe(dest(paths.styles.output));
};

const movingOldReactNativeStyles = () => {
  return src('src/wmcads/assets/old/css/react-native/wmcads-components.min.js').pipe(
    dest(`${paths.styles.output}react-native/`)
  );
};

const movingOldIcons = () => {
  return src('src/wmcads/assets/old/img/wmcads-sprite.min.svg').pipe(dest(paths.svgs.dest)); // move config files to build
};

module.exports.moveOldCSS = movingOldCSS;
module.exports.moveOldReactNative = movingOldReactNativeStyles;
module.exports.moveOldIcons = movingOldIcons;
