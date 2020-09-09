module.exports = {
  output: 'docs/', // Default output location for code build
  server: {
    port: 3000,
    baseDir: './docs/',
    root: './docs/'
  },
  styles: {
    src: ['src/**/*.scss'], // src of styles to watch
    minifySrc: ['src/wmcads/assets/sass/wmcads-components.scss', 'src/www/wmcads-website.scss'], // List of scss file(s) which should be processed, linted & minified
    output: 'docs/css/', // output location of minified styles
    reactNativeSrc: 'src/wmcads/assets/sass/wmcads-components.scss'
  },
  scripts: {
    src: ['src/**/*.js'], // Src of JS files to watch
    // List of JS folders to concatenate, lint and minified to one file (DON'T LINT ASSETS AS IT WILL TAKE TOO LONG TO SCAN MINIFIED LIBS)
    minifySrc: [
      {
        src: 'src/www/wmcads-website.js',
        minName: 'wmcads-website.min.js',
        lint: true
      }
    ],
    output: 'docs/js/' // Output location of minified JS files
  },
  nunjucks: {
    src: 'src/**/*.njk', // Used for watching njk files
    websiteSrc: 'src/www/pages/**/*.njk',
    output: 'docs/'
  },
  svgs: {
    src: 'src/wmcads/assets/icon/**/*.svg',
    dest: 'docs/img/'
  },
  images: {
    src: ['src/wmcads/assets/img/**/*'],
    output: 'src/wmcads/assets/img/**/*',
    dest: 'docs/img/'
  },
  config: {
    src: 'src/www/assets/config/**/*',
    output: 'docs/config/'
  },
  logs: {
    sourcemaps: '_sourcemaps/'
  },
  clean: {
    a11y: './src/www/pages/**/a11y-report.json',
    tmp: './src/www/pages/**/.tmp'
  }
};
