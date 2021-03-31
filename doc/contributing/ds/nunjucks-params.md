# Nunjucks parameters

Change the behavior of components by sending custom parameters.

This enables us to re-use components without having to duplicate them just to change copy or UI features.

## Change copy

As an example lets change the title of a component:

1 - In the compoent `.njk` file add a custom parameter like this:

    {% set title = params.title or 'Default Title' %}

This is looking for a parameter called `title`, if the parameter is not found the default value is used after `or`.

2 - Display the value in the front end.

Add the parameter name within `{{  }}` where you want the value to appear:

    <h1>{{title}}</h1>

3 - Send the title value to the component

    {{
        wmcadsComponentName({
            title: "New title"
        })
    }}
