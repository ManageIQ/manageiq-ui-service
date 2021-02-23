# Code Tour
This document is intended to provide a development guideline for new and existing contributors to the project.
Keep in mind this application undergoes constant development so be sure to check back occasionally as best practices are sure to evolve.

## Yarn Tasks 
#### `yarn build`
- Bundles SUI assets and places then in `../manageiq/public/ui/service/`.

#### `yarn available-languages`
- Compiles a list of languages for which the SUI is currently translated. 

#### `yarn gettext-extract`
- Extracts all text in SUI flagged for translation, creates `./client/gettext/po/manageiq-ui-service.pot` used by Zanata.

#### `yarn start`
- Starts the dev server, auto-reloads on asset change, runs on port 3000 by default.  Can be prepended with enviromental
variables such as `PROXY_HOST=localhost:3000`.

#### `yarn test`
- Bundles the SUI and uses karma to run all `.spec.js` files.  Pass fail results are printed out during task execution and coverage at task completion.

#### `yarn test:watch`
- Runs `yarn test` and watch project files for changes, upon a change, automatically reruns `yarn test`. 
SUI is only bundled at the beginning of this task, subsequent runs only bundles changed files.

#### `yarn vet`
- **ESLint** and **Sass Lint** are both run with this script, this is automatically run by travis upon the creation of a pr.

#### `yarn zanata:upload`
- This uploads our extracted .POT file to the zanata platform so it can be translated.

#### `yarn zanata:download`
- This downloads the translated .po files from the zanata platform so they can be integrated.

## Style and Convention
For additional information regarding coding style and convention employed in this project checkout:

* [Coding Style and Standards](https://github.com/ManageIQ/manageiq/issues/8781)
* [Internationalization Guidelines](https://github.com/ManageIQ/guides/blob/master/i18n.md)
* [Angular 1 Style Guide](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md)
* [BEM Quick Start](https://en.bem.info/methodology/quick-start/)

## Adding Dependencies
All dependencies are managed using [Yarn](https://github.com/yarnpkg/yarn).
When adding a new dependency for use in the SUI there are two locations to pay attention to:

1. [package.json](package.json) - identifies resourcing and desired versions of app dependencies, confirm the correct version of the app you require is saved as a **Developer Dependency**, (`devDependencies`). When installing new dependencies be sure to install with an absolute version number:

        yarn add --dev dependency@version

2. [app.js](client/app.js) - is the entrypoint for webpack and makes dependencies available app wide, here you'll reference the `node_modules/` file path of those files you wish to include.

 **Note: Order matters, don't be reckless** :+1: :taco:

## Adding Components
In efforts to build towards the future [Angular 2.0](https://angular.io/docs/ts/latest/guide/style-guide.html),
employing [components](https://docs.angularjs.org/guide/component) is now preferred over [directives](https://docs.angularjs.org/guide/directive).
Much of the existing code base has already been refactored to take advantage of components, these elements are denoted:
with the `.component.js` postfix. Find below a few examples for the benefit of extensibility:

* [service catalog card](../client/app/shared/ss-card/ss-card.component.js)
* [cart](../client/app/components/shopping-cart/shopping-cart.component.js)

In addition, a few choice supporting resources include:

* [Understanding Components](https://docs.angularjs.org/guide/component)
* [Understanding Lifestyle Hooks](https://toddmotto.com/angular-1-5-lifecycle-hooks)
