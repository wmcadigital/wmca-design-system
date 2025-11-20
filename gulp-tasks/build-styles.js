// Gulp requires
const { src, dest } = require('gulp');
const plugins = require('gulp-load-plugins')();

// Local requires
const sass = require('gulp-sass')(require('sass'));
const through2 = require('through2');
const path = require('path');
const paths = require('./paths');
const { browserSync } = require('./browser-sync'); // BrowserSync server

const { getRoot, packageJson, build } = require('./utils');

// Process, lint, and minify Sass files
const buildingStyles = () => {
  return src(paths.styles.minifySrc)
    .pipe(plugins.sourcemaps.init())
    .pipe(sass().on('error', sass.logError)) // Compile Sass
    .pipe(plugins.replace('$*cdn', packageJson.buildDirs[build].cdn))
    .pipe(plugins.autoprefixer()) // Prefix css with older browser support
    .pipe(plugins.cleanCss({ level: 2 })) // Minify css
    .pipe(
      through2.obj(function afterMinifyComp(file, enc, cb) {
        // eslint-disable-next-line no-console
        console.log(
          'after-minify-comp:',
          file.relative,
          file.contents ? file.contents.length : 'no-contents'
        );
        cb(null, file);
      })
    )
    .pipe(
      through2.obj(function afterMinify(file, enc, cb) {
        // eslint-disable-next-line no-console
        console.log(
          'after-minify:',
          file.relative,
          file.contents ? file.contents.length : 'no-contents'
        );
        cb(null, file);
      })
    )
    .pipe(
      plugins.rename({
        extname: '.min.css'
      })
    )
    .pipe(plugins.sourcemaps.write(getRoot(paths.styles.output) + paths.logs.sourcemaps))
    .pipe(dest(paths.styles.output))
    .pipe(browserSync.stream());
};

// Build individual component CSS files (outputs each component as its own .min.css)
const buildingComponentStyles = () => {
  return (
    src(paths.styles.componentsSrc, { allowEmpty: true })
      // Log matched files for debugging
      .pipe(
        through2.obj(function logMatched(file, enc, cb) {
          // eslint-disable-next-line no-console
          console.log('component:', file.path);
          cb(null, file);
        })
      )
      // Compile each SCSS file using the Dart Sass API directly (avoids gulp-sass quirks with partials)
      .pipe(
        through2.obj(function compileWithSass(file, enc, cb) {
          try {
            const sassImpl = require('sass');
            // Provide includePaths so module imports like @use "shared/vars" resolve
            const includePaths = [
              path.resolve(process.cwd(), 'src/wmcads/assets/sass'),
              path.resolve(process.cwd(), 'src/wmcads/components'),
              process.cwd()
            ];
            // Some component partials assume shared variables/mixins are already
            // available (they don't import them directly). Compile each component
            // by providing a small wrapper 'data' string that @use's the shared
            // modules first and then imports the component partial so variables
            // and functions are available during compilation.
            const wrapper = `@use "shared/vars" as *;\n@use "shared/mixins" as *;\n@import "${file.path}";`;
            const result = sassImpl.renderSync({ data: wrapper, includePaths });
            file.contents = Buffer.from(result.css);
            cb(null, file);
          } catch (err) {
            cb(err);
          }
        })
      )
      .pipe(plugins.replace('$*cdn', packageJson.buildDirs[build].cdn))
      .pipe(plugins.autoprefixer()) // Prefix css with older browser support
      .pipe(plugins.cleanCss({ level: 2 })) // Minify css
      .pipe(
        plugins.rename(function renameComponent(pathObj) {
          // Remove leading underscore from partial names (e.g. _button.scss -> button.min.css)
          pathObj.basename = pathObj.basename.replace(/^_/, '');
          pathObj.extname = '.min.css';
        })
      )
      .pipe(dest(paths.styles.componentsOutput))
      .pipe(browserSync.stream())
  );
};

module.exports.buildComponentStyles = buildingComponentStyles;

// Build individual pattern CSS files (outputs each pattern as its own .min.css)
const buildingPatternStyles = () => {
  return (
    src(paths.styles.patternsSrc, { allowEmpty: true })
      // Log matched pattern files for debugging
      .pipe(
        through2.obj(function logMatchedPattern(file, enc, cb) {
          // eslint-disable-next-line no-console
          console.log('pattern:', file.path);
          cb(null, file);
        })
      )
      // Compile each SCSS file using the Dart Sass API directly
      .pipe(
        through2.obj(function compilePatternWithSass(file, enc, cb) {
          try {
            const sassImpl = require('sass');
            const includePaths = [
              path.resolve(process.cwd(), 'src/wmcads/assets/sass'),
              path.resolve(process.cwd(), 'src/wmcads/patterns'),
              process.cwd()
            ];
            const wrapper = `@use "shared/vars" as *;\n@use "shared/mixins" as *;\n@import "${file.path}";`;
            const result = sassImpl.renderSync({ data: wrapper, includePaths });
            file.contents = Buffer.from(result.css);
            cb(null, file);
          } catch (err) {
            cb(err);
          }
        })
      )
      .pipe(plugins.replace('$*cdn', packageJson.buildDirs[build].cdn))
      .pipe(plugins.autoprefixer())
      .pipe(plugins.cleanCss({ level: 2 }))
      .pipe(
        plugins.rename(function renamePattern(pathObj) {
          pathObj.basename = pathObj.basename.replace(/^_/, '');
          pathObj.extname = '.min.css';
        })
      )
      .pipe(dest(paths.styles.patternsOutput))
      .pipe(browserSync.stream())
  );
};

module.exports.buildPatternStyles = buildingPatternStyles;

const buildingReactNativeStyles = () => {
  return src(paths.styles.reactNativeSrc)
    .pipe(plugins.replace('$*cdn', packageJson.buildDirs[build].cdn))
    .pipe(sass().on('error', sass.logError)) // Compile Sass
    .pipe(plugins.autoprefixer()) // Prefix css with older browser support
    .pipe(plugins.reactNativeStylesheetCss()) // Converts CSS to React Native stylesheet
    .pipe(plugins.uglifyEs.default()) // Mangle var names etc.
    .pipe(
      plugins.rename({
        extname: '.min.js'
      })
    )
    .pipe(dest(`${paths.styles.output}react-native/`));
};

module.exports.buildStyles = buildingStyles;
module.exports.buildReactNativeStyles = buildingReactNativeStyles;
