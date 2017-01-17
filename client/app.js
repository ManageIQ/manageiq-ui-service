// The webpack entrypoint
function requireAll(context) {
  context.keys().forEach(context);
}

// Application scripts, order matters
require('./app/globals.js');
require('./app/app.module.js');
requireAll(require.context('./app', true, /\.module\.js$/));
requireAll(require.context('./app', true, /^((?!module|e2e).)*\.js$/));

// Application styles
require('./assets/sass/styles.sass');

// Angular templates
requireAll(require.context('./app', true, /\.html$/));
