export const DetailRevealComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    title: '@',
    detail: '@',
    icon: '@',
    translateTitle: '<',
    rowClass: '@',
  },
  transclude: true,
  templateUrl: 'app/components/detail-reveal/detail-reveal.html',
};

/** @ngInject */
function ComponentController($transclude) {
  var vm = this;
  vm.$onInit = activate();

  function activate() {
    vm.translateTitle = (angular.isUndefined(vm.translateTitle) ? true : vm.translateTitle);
    vm.title = (vm.translateTitle === true ? __(vm.title) : vm.title);
    vm.rowClass = (angular.isDefined(vm.rowClass) ? vm.rowClass : 'row detail-row');
    vm.toggleDetails = false;
    vm.hasMoreDetails = $transclude().length > 0;
  }
}
