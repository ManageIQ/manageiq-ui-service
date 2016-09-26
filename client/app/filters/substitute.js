(function() {
  'use strict';

  angular.module('app.services').filter('substitute', function($interpolate) {
    return function(text, context) {
      text = text.replace(/\[\[/g, '{{').replace(/\]\]/g, '}}');
      var interpolateFn = $interpolate(text);

      return interpolateFn(context);
    };
  });
})();
