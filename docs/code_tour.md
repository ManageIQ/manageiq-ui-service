# Code Tour 
This document is intended to provide a development guideline for new and existing contributors to the project.
Keep in mind this application undergoes constant development so be sure to check back occasionally as best practices are sure to evolve.

## Linting
This project uses **ESLint**, `gulp eslint`, and **Sass Lint**, `gulp sasslint`. Both can be run with the gulp task `gulp vet`.

## Style and Convention
For additional information regarding coding style and convention employed in this project checkout:

* [Coding Style and Standards](https://github.com/ManageIQ/manageiq/issues/8781)
* [Internationalization Guidelines](https://github.com/ManageIQ/guides/blob/master/i18n.md) 
* [Angular 1 Style Guide](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md)
* [BEM Quick Start](https://en.bem.info/methodology/quick-start/)

## Adding Dependencies
All dependencies are managed using [Yarn](https://github.com/yarnpkg/yarn).
When adding a new dependency for use in the SUI there are three locations to pay attention to:

1. [package.json](package.json) - identifies resourcing and desired versions of app dependencies, confirm the correct version of the app you require is saved as a **Developer Dependency**, (`devDependencies`). When installing new dependencies be sure to install with an absolute version number:

        yarn add --dev dependency@version

2. [app.js](client/app.js) - is the entrypoint for webpack and makes dependencies available app wide, here you'll reference the `node_modules/` file path of those files you wish to include.

 **Note: Order matters, don't be reckless** :+1:
 
3. [config.js](gulp/config.js) - identifies dependencies required for running tests, the function titled `function getKarmaOptions()` manages  `var options` which must identically mirror any action taken step two.
   
## Adding Components
In efforts to build towards the future [Angular 2.0](https://angular.io/docs/ts/latest/guide/style-guide.html), 
employing [components](https://docs.angularjs.org/guide/component) is now preferred over [directives](https://docs.angularjs.org/guide/directive).
Much of the existing code base has already been refactored to take advantage of components, these elements are denoted:
with the `.component.js` postfix. Find below a few examples for the benefit of extensibility:

* [service catalog card](../client/app/components/ss-card/ss-card.component.js)
* [cart](../client/app/components/shopping-cart/shopping-cart.component.js)
* [profiles list](../client/app/components/profiles/profiles-list.component.js)

In addition, a few choice supporting resources include:

* [Understanding Components](https://docs.angularjs.org/guide/component)
* [Understanding Lifestyle Hooks](https://toddmotto.com/angular-1-5-lifecycle-hooks)
