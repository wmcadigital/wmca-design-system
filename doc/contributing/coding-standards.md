# Components

Find components in `src/wmcads/components`.

Components must use the `.wmcads-` namespace.

For example, `.wmcads-button`.

## Writing CSS for components

Components must follow the conventions described in our [CSS coding standards](css.md).

Components must:

- use classes for child elements, scoped to the parent component
- be flexible, not set a width or external padding and margins
- set internal margins in a single direction
- not rely on any other selector outside of the component scss file to style its children

### Component folder structure and naming

Component folder and files should be singular, except in cases where they are more commonly used in groups, for example, radios, breadcrumbs and checkboxes.

The folder structure should be:

    component-name
      - `component-name.njk`
      - `_component-name.scss`
      - `component-name.js` (optional)

## Nunjucks template API

[Read more](nunjucks-api.md) about the way we write component templates.
