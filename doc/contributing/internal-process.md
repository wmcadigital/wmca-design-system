# Internal process for developing the new WMCA website

These docs outline the process all designers and developers should be following when updating the WMCA Design System and for testing templates for the new WMCA website.

## Development

Make sure you are familiar with how the design system is setup and how to contribute to it by reviewing the [Contributing guide](../contributing.md).

Main points to follow:

- Each new feature or bugfix should be created on a new branch based on `release` following the guidelines in [Versioning](versioning.md#123-new-branches).
  - This makes it easier for multiple developers to work on the same feature or bugfix without disturbing the main codebase.
  - This also makes it easier to carry out staggered releases to the main codebase.
- All new components or patterns need to follow the [Coding standards](coding-standards.md).
- Any new CMS templates should be added to the design system to ensure:
    - That the latest components and patterns are in use
    - To show the template to designers for sign off
    - Any custom styles and javascript are checked and generated in the build process
- Once you are ready to propose new changes, you must **open a pull request to the** `release` **branch**.
  - This will trigger the Github actions which will:
    - Check the pull request title to ensure the semantic-release works correctly
    - Checks the codebase for any linting or accessibility issues
    - A preview will be created in Netlify
    - The pull request will then be reviewed by the head developer and any issues identified.
    - Once the lead developer is happy with the pull request an ICT change request will be created and merged into the `master` branch.

### Points for template creation

- All templates should be added into `src/www/pages/templates`. These will appear on the main Design System site [here](https://wmcads.netlify.app/templates/).
- Ensure you use the appropriate style [utilities classes](https://wmcads.netlify.app/styles/utility-classes/) for the template layout.
- Check that the page passes accessibility checks using automated tools such as [AXE](https://www.deque.com/axe/), [Wave](https://wave.webaim.org/) or [Lighthouse](https://developers.google.com/web/tools/lighthouse) (or a combination of the tools).
- Once the pull request passes all checks and the lead developer confirms it's ok the template preview will be sent to the designers for final sign off.

## Design / UX / UI

- When a template has been signed off by the lead developer a Netlify preview link will be sent to the designers
- Designers should review the template on desktop, tablet and mobile to ensure the design works as expected.
- Any issues to be added to the GitHub repository [issues](https://github.com/wmcadigital/wmca-design-system/issues) page. Where possible add the sprint card reference found in the [West Midlands Combined Authority - Backlog](https://github.com/orgs/wmcadigital/projects/18). E.g. `DS2.1 - Font issue with body copy`.

### Template Sign Off

Only when the template has been signed off by the lead developer and design can it be integrated into the Content Management System.

#### Sign off checklist

- Templates use the design System utility classes, components & patterns
  - If the template requires extra styles or scripts these should be added into the `src/www/pages/templates/template-name` folder so they can go through [Linting](../contributing/testing-and-linting.md) and the build process.
    - If the code is concidered useful for other pages it should be added to the base Design System.
- Templates pass accessibility checks
- Sprint goal is met
- Acceptance criteria met
- Approved by lead developer
- Approved by Design
