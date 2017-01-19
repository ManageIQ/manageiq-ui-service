import 'angular-cookies';
import 'ngstorage';

// Needs imports loader because it expects `this` to be `window`
import 'imports-loader?this=>window!actioncable';

export default angular
  .module('app.services', [
    'ngStorage',
    'ngCookies',
  ])
  .name;
