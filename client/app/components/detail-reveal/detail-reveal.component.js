(function() {
  'use strict';

  angular.module('app.components')
    .component('detailReveal', {
      controller: ComponentController,
      controllerAs: 'vm',
      bindings: {
        title: '@',
        detail: '@',
        icon: '@',
        translateTitle: '=',
      },
      transclude: true,
      templateUrl: 'app/components/detail-reveal/detail-reveal.html',
    });

  /** @ngInject */
  function ComponentController($transclude) {
    var vm = this;
    vm.translateTitle = (angular.isDefined(vm.translateTitle) ? true : vm.translateTitle);
    vm.title = (vm.translateTitle === true ? __(vm.title) : vm.title);

    vm.$onInit = activate();

    function activate() {
      vm.toggleDetails = false;
      vm.hasMoreDetails = $transclude().length > 0;
    }
  }
})();
