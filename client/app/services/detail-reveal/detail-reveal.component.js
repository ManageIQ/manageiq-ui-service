import './_detail-reveal.sass';
import templateUrl from './detail-reveal.html';

export const DetailRevealComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    detailTitle: '@',
    detail: '@',
    icon: '@',
    translateTitle: '<',
    rowClass: '@',
    displayField: '<?',
  },
  transclude: true,
  templateUrl,
};

/** @ngInject */
function ComponentController($transclude) {
  var vm = this;
  vm.$onInit = activate();

  function activate() {
    if (angular.isUndefined(vm.displayField)) {
      vm.displayField = false;
    }

    vm.translateTitle = (angular.isUndefined(vm.translateTitle) ? true : vm.translateTitle);
    vm.detailTitle = (vm.translateTitle === true ? __(vm.detailTitle) : vm.detailTitle);
    vm.rowClass = (angular.isDefined(vm.rowClass) ? vm.rowClass : 'row detail-row');
    vm.toggleDetails = false;
    vm.hasMoreDetails = $transclude().length > 0;
  }
}
