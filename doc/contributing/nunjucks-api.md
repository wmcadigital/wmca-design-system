# Component templates

The WMCA Design System is built using the [Nunjucks](https://mozilla.github.io/nunjucks/) templating engine.

Each Design System component and pattern is built using a Nunjucks Macro. Macros are then imported on a page ready to be exported as content pages in the build process.

## Nunjucks templating

Find out more about the [Nunjucks templating language](https://github.com/mozilla/nunjucks/blob/master/docs/templating.md).


## Creating new components

1 - The first step is to create the component files following the [component guidelines](coding-standards.md#component-folder-structure-and-naming).

2 - Next add the following to the .njk file to create a new Macro.

    {% macro wmcadsComponentName(params) %}

    {% endmacro %}

3 - If you think the component would benefit a description or comments in order help other developers you can add it like this: 

    {% macro wmcadsComponentName(params) %}
    {# Component description/ comments here #}
    {% endmacro %}

4 - You can now start adding the component html: 

    {% macro wmcadsComponentName(params) %}
    {# Component description/ comments here #}

    <div class="ds-componentName">

    </div>

    {% endmacro %}

## Importing components

Each component or pattern should have a corresponding [page](../contributing/ds/creating-pages.md) in order to demonstrate how and when to use it.

1 - Import a component using the following:

    {% from "wmcads/component/component-name/component-name.njk" import macroName %}

Most of the time any imports are added to the top of the document but they can be added anywhere within the block.

2 - Rendering the component

Render the component in the page by adding the following where you want the component to display.

    {{
        wmcadsComponentName()
    }}

## Nunjucks parameters

In order to reuse components and patterns we can send parameters to the Nunjucks file in order to change what is displayed in the front-end.

E.g. Change a heading title, image or link.

[Read more on Nunjucks parameters](../contributing/ds/nunjucks-params.md).
