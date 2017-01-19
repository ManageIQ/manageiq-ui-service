import { authConfig, authInit } from './authorization.config.js';
import { navConfig, navInit } from './navigation.config.js';
import { gettextInit } from './gettext.config.js';
import { layoutInit } from  './layouts.config.js';

export default angular
  .module('app.config', [])
  .constant('API_BASE', location.protocol + '//' + location.host)
  .constant('API_LOGIN', '')
  .constant('API_PASSWORD', '')
  .config(authConfig)
  .run(authInit)
  .run(layoutInit)
  .run(gettextInit)
  .config(navConfig)
  .run(navInit)
  .name;
