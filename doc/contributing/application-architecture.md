# Application architecture

- `src/`

  Source files. See [README.md](../../src/README.md) in the src directory for details.

  - `wmre/`

    This is where the core library of all components/patterns are built using nunjucks for the WMCA Design System. These are then referenced by the Design System Website to show examples to other collaborators.

    - `assets/`

      App-specific assets.

      - `img/`

        Images that are used in components or the design system.

      - `sass/`

        Any core SASS/SCSS that is used for styling components/patterns etc. should be placed in here and then referenced in `src/wmre/assets/sass/wmre.scss`. Note: Anything referenced will appear in the live build.

        - `components/`

          Examples of components usage in various contexts. See [README.md](../../src/components/README.md) in the components directory for more details. You can access these examples from [WMCA Design System components](http://localhost:8080/components/).

        - `patterns/`

          Examples of pattern usage in various contexts. See [README.md](../../src/components/README.md) in the components directory for more details. You can access these examples from [WMCA Design System patterns](http://localhost:8080/patterns/).

    - `www/`

      Anything that is specific for the [WMCA Design System website](http://localhost:8080) goes in this folder. It also contains generic layout templates used to render preview and content pages.

      - `assets/`

        Design System website-specific assets.

        - `config/`

          Browserconfig and webmanifest configs for the WMCA Design System website.

        - `js/`

          Any javascript files located in here will be concatenated and compiled into `docs/js/wmcads-vendor.min.js` via the [javascript build task](tasks.md#markdown-header-141-scripts-javascript).

- `docs/` **contains auto-generated files**

  Standalone builds of WMCA Design System. Provides a way to consume WMCA Design System without using npm.

- `_sourcemaps` **contains auto-generated files**

  Any sourcemaps generated from [JS or CSS compile tasks](tasks#markdown-header-14-building).

- `_accessibility-logs` **contains auto-generated files**

  Logs generated when [linting template files](tasks.md#markdown-header-122-templates-html).

* `doc/`

  Markdown documentation files.

* `gulp-tasks/`

  Gulp modules and helpers for various task runner jobs. See [tasks](tasks.md) for more information about the tasks.
