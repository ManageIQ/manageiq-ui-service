import './_usage-graphs.sass'
import template from './usage-graphs.html';

export const UsageGraphsComponent = {
  bindings: {
    cpuChart: '<',
    memoryChart: '<',
    storageChart: '<',
    titleDetails: '@?'
  },
  controller: ComponentController,
  controllerAs: 'vm',
  template,
}

/** @ngInject */
function ComponentController () {
  const vm = this
  vm.$onChanges = () => {
    angular.extend(vm, {
      cpuChart: vm.cpuChart || {data: {total: 0}},
      memoryChart: vm.memoryChart || {data: {total: 0}},
      storageChart: vm.storageChart || {data: {total: 0}},
      cpuDataExists: false,
      memoryDataExists: false,
      storageDataExists: false,
      emptyState: {icon: 'pficon pficon-help', title: __('No data available')}
    })

    if (vm.cpuChart.data.total > 0) {
      vm.cpuDataExists = true
      vm.availableCPU = vm.cpuChart.data.total - vm.cpuChart.data.used
    }

    if (vm.memoryChart.data.total > 0) {
      vm.memoryDataExists = true
      vm.availableMemory = vm.memoryChart.data.total - vm.memoryChart.data.used
    }

    if (vm.storageChart.data.total > 0) {
      vm.storageDataExists = true
      vm.availableStorage = vm.storageChart.data.total - vm.storageChart.data.used
    }
  }
}
