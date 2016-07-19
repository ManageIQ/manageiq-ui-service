(function() {
  'use strict';

  angular.module('app.components')
    .directive('languageSwitcher', LanguageSwitcherDirective);

  /** @ngInject */
  function LanguageSwitcherDirective() {
    var directive = {
      restrict: 'AE',
      scope: {
        mode: '@?',
      },
      templateUrl: 'app/components/language-switcher/language-switcher.html',
      controller: LanguageSwitcherController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function LanguageSwitcherController($scope, gettextCatalog, Language, lodash) {
      var vm = this;
      vm.mode = vm.mode || 'menu';

      var hardcoded = {
        "_user_": __("User Default"),
        "_browser_": __("Browser Default"),
      };
      vm.available = hardcoded;

      if (vm.mode === 'menu') {
        delete hardcoded._user_;
      } else {
        vm.chosen = Language.chosen = { code: '_user_' };

        $scope.$watch('vm.chosen.code', function(val) {
          if (!val || (val === '_user_')) {
            val = "en";
          }

          Language.setLocale(val);
        });
      }

      Language.ready
        .then(function(available) {
          vm.available = lodash.extend({}, hardcoded, available);
        });

      vm.switch = function(code) {
        Language.setLocale(code);
        Language.save(code);
      };
    }
  }
})();
