/* global toastr:false, _:false, $:false, sprintf: false */
(function() {
  'use strict';

  angular.module('app.core')
    .constant('lodash', _)
    .constant('jQuery', $)
    .constant('toastr', toastr)
    .constant('sprintf', sprintf);
})();
