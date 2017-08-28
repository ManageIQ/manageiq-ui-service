import './_usage-graphs.sass'
import templateUrl from './usage-graphs.html'

export const UsageGraphsComponent = {
  bindings: {
    cpuChart: '<',
    memoryChart: '<',
    storageChart: '<'
  },
  controller: ComponentController,
  controllerAs: 'vm',
  templateUrl
}

/** @ngInject */
function ComponentController () {
  const vm = this
  vm.$onChanges = activate

  function activate () {
    angular.extend(vm, {
      cpuDataExists: true,
      memoryDataExists: true,
      storageDataExists: true
    })

    if (vm.cpuChart.data.total === 0) {
      vm.cpuDataExists = false
    }
    if (vm.memoryChart.data.total === 0) {
      vm.memoryDataExists = false
    }
    if (vm.storageChart.data.total === 0) {
      vm.storageDataExists = false
    }
    vm.availableCPU = vm.cpuChart.data.total - vm.cpuChart.data.used
    vm.availableMemory = vm.memoryChart.data.total - vm.memoryChart.data.used
    vm.availableStorage = vm.storageChart.data.total - vm.storageChart.data.used
  }
}
