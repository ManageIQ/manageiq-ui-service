(function() {
  'use strict';

  angular.module('app.components')
    .directive('languageSwitcher', LanguageSwitcherDirective);

  /** @ngInject */
  function LanguageSwitcherDirective() {
    var directive = {
      restrict: 'AE',
      scope: {},
      templateUrl: 'app/components/language-switcher/language-switcher.html',
      controller: LanguageSwitcherController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function LanguageSwitcherController(gettextCatalog, Language, lodash) {
      var vm = this;

      var hardcoded = {
        "_browser_": __("Browser Default"),
      };
      vm.available = hardcoded;

      Language.ready
        .then(function(available) {
          vm.available = lodash.extend({}, hardcoded, available);
        });

      vm.switch = function(code) {
        Language.setLocale(code);
      };
    }
  }
})();
