// Gulp requires
const { src, dest } = require('gulp');
const plugins = require('gulp-load-plugins')();

// Local requires
const sass = require('gulp-sass')(require('sass'));
const paths = require('./paths');
const { browserSync } = require('./browser-sync'); // BrowserSync server

const { getRoot, packageJson, build } = require('./utils');

// Process, lint, and minify Sass files
// Helper that ensures `gulp-autoprefixer` is available and returns the function
const ensureAutoprefixer = async () => {
  try {
    const mod = await import('gulp-autoprefixer');
    const fn = mod.default || mod;
    // Assign so gulp-load-plugins will also see it on future access
    try {
      plugins.autoprefixer = fn;
    } catch (e) {
      // ignore if assignment isn't allowed
    }
    return fn;
  } catch (e) {
    return null;
  }
};

const buildingStyles = async () => {
  const autoprefixerFn = await ensureAutoprefixer();

  let stream = src(paths.styles.minifySrc).pipe(plugins.sourcemaps.init());
  stream = stream.pipe(sass().on('error', sass.logError)); // Compile Sass
  stream = stream.pipe(plugins.replace('$*cdn', packageJson.buildDirs[build].cdn));

  if (autoprefixerFn) {
    stream = stream.pipe(autoprefixerFn());
  }

  stream = stream.pipe(plugins.cleanCss({ level: 2 })); // Minify css
  stream = stream.pipe(
    plugins.rename({
      extname: '.min.css'
    })
  );

  stream = stream.pipe(plugins.sourcemaps.write(getRoot(paths.styles.output) + paths.logs.sourcemaps));
  stream = stream.pipe(dest(paths.styles.output));
  stream = stream.pipe(browserSync.stream());

  return stream;
};

const buildingReactNativeStyles = async () => {
  const autoprefixerFn = await ensureAutoprefixer();

  let stream = src(paths.styles.reactNativeSrc).pipe(plugins.replace('$*cdn', packageJson.buildDirs[build].cdn));
  stream = stream.pipe(sass().on('error', sass.logError)); // Compile Sass

  if (autoprefixerFn) {
    stream = stream.pipe(autoprefixerFn());
  }

  stream = stream.pipe(plugins.reactNativeStylesheetCss()); // Converts CSS to React Native stylesheet
  stream = stream.pipe(plugins.uglifyEs.default()); // Mangle var names etc.
  stream = stream.pipe(
    plugins.rename({
      extname: '.min.js'
    })
  );

  stream = stream.pipe(dest(`${paths.styles.output}react-native/`));
  return stream;
};

const buildingComponentStyles = async () => {
  const autoprefixerFn = await ensureAutoprefixer();

  let stream = src(paths.styles.componentsSrc).pipe(plugins.sourcemaps.init());
  stream = stream.pipe(sass().on('error', sass.logError)); // Compile Sass
  stream = stream.pipe(plugins.replace('$*cdn', packageJson.buildDirs[build].cdn));

  if (autoprefixerFn) {
    stream = stream.pipe(autoprefixerFn());
  }

  stream = stream.pipe(plugins.cleanCss({ level: 2 })); // Minify css
  stream = stream.pipe(
    plugins.rename({
      extname: '.min.css'
    })
  );

  stream = stream.pipe(plugins.sourcemaps.write(getRoot(paths.styles.componentsOutput) + paths.logs.sourcemaps));
  stream = stream.pipe(dest(paths.styles.componentsOutput));
  stream = stream.pipe(browserSync.stream());

  return stream;
};

const buildingPatternStyles = async () => {
  const autoprefixerFn = await ensureAutoprefixer();

  let stream = src(paths.styles.patternsSrc).pipe(plugins.sourcemaps.init());
  stream = stream.pipe(sass().on('error', sass.logError)); // Compile Sass
  stream = stream.pipe(plugins.replace('$*cdn', packageJson.buildDirs[build].cdn));

  if (autoprefixerFn) {
    stream = stream.pipe(autoprefixerFn());
  }

  stream = stream.pipe(plugins.cleanCss({ level: 2 })); // Minify css
  stream = stream.pipe(
    plugins.rename({
      extname: '.min.css'
    })
  );

  stream = stream.pipe(plugins.sourcemaps.write(getRoot(paths.styles.patternsOutput) + paths.logs.sourcemaps));
  stream = stream.pipe(dest(paths.styles.patternsOutput));
  stream = stream.pipe(browserSync.stream());

  return stream;
};

module.exports.buildStyles = buildingStyles;
module.exports.buildReactNativeStyles = buildingReactNativeStyles;
module.exports.buildComponentStyles = buildingComponentStyles;
module.exports.buildPatternStyles = buildingPatternStyles;