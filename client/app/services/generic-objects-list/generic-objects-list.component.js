import templateUrl from './generic-objects-list.html'

export const GenericObjectsListComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    genericObject: '<'
  },
  templateUrl
}

/** @ngInject */
function ComponentController () {
  var vm = this

  angular.extend(vm, {
    genericObjectsListConfig: {
      showSelectBox: false,
      useExpandingRows: true
    }
  })
  vm.$onInit = activate()

  function activate () {
    console.log(vm.genericObject)
  }
}
