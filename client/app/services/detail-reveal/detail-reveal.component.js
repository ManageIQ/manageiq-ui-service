import './_detail-reveal.sass'
import template from './detail-reveal.html';

export const DetailRevealComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    detailTitle: '@',
    detail: '@',
    icon: '@',
    translateTitle: '<',
    rowClass: '@',
    displayField: '<?'
  },
  transclude: true,
  template,
}

/** @ngInject */
function ComponentController ($transclude) {
  const vm = this
  vm.$onInit = () => {
    if (angular.isUndefined(vm.displayField)) {
      vm.displayField = false
    }

    vm.translateTitle = (angular.isUndefined(vm.translateTitle) ? true : vm.translateTitle)
    vm.detailTitle = (vm.translateTitle === true ? __(vm.detailTitle) : vm.detailTitle)
    vm.rowClass = (angular.isDefined(vm.rowClass) ? vm.rowClass : 'row detail-row')
    vm.toggleDetails = false
    vm.hasMoreDetails = $transclude().length > 0
  }
}
