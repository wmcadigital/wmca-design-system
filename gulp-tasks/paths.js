module.exports = {
  output: 'build/', // Default output location for code build
  server: {
    port: 8080,
    baseDir: './build/',
    root: './build/'
  },
  styles: {
    src: ['src/**/*.scss'], // src of styles to watch
    minifySrc: [
      'src/wmcads/assets/sass/wmcads.scss',
      'src/www/wmcads-website.scss',
      'src/www/pages/templates/templates.scss',
      'src/wmcads/assets/sass/wmcads-grid/grid.scss',
      'src/wmcads/assets/sass/split/buttons.scss',
      'src/wmcads/assets/sass/split/accordion.scss',
      'src/wmcads/assets/sass/split/typography.scss'
    ], // List of scss file(s) which should be processed, linted & minified
    output: 'build/css/', // output location of minified styles
    reactNativeSrc: 'src/wmcads/assets/sass/wmcads.scss'
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
    output: 'build/js/' // Output location of minified JS files
  },
  fonts: {
    src: 'src/wmcads/assets/fonts/**/*',
    output: 'build/fonts/'
  },
  nunjucks: {
    src: 'src/**/*.{njk,md,html}', // Used for watching njk files
    websiteSrc: 'src/www/pages/**/*.{njk,md,html}',
    componentSrc: 'src/wmcads/**/*.{njk,md,html}',
    output: 'build/',
    componentOutput: 'build/njk'
  },
  njkData: {
    src: 'src/**/*.njk.json',
    output: 'build/json/'
  },
  svgs: {
    src: 'src/wmcads/assets/icon/**/*.svg',
    dest: 'build/img/'
  },
  images: {
    src: ['src/wmcads/assets/img/**/*.{png,gif,jpg}'],
    output: 'src/wmcads/assets/img/**/*',
    dest: 'build/img/'
  },
  config: {
    src: 'src/www/assets/config/**/*',
    output: 'build/config/'
  },
  netlifyConfig: {
    src: '_redirects',
    output: 'build/'
  },
  logs: {
    sourcemaps: '_sourcemaps/'
  },
  clean: {
    a11y: './src/www/pages/**/a11y-report.json',
    tmp: './src/www/pages/**/.tmp'
  }
};
