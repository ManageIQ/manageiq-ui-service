/* global _:false, ActionCable:false, $:false, sprintf: false, moment: false */
(function() {
  'use strict';

  angular.module('app.core')
    .constant('lodash', _)
    .constant('ActionCable', ActionCable)
    .constant('sprintf', sprintf)
    .constant('moment', moment);
})();
