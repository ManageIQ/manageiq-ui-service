import template from './generic-objects-list.html';
import './_generic_objects_list.sass'

export const GenericObjectsListComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    genericObject: '<',
    onUpdate: '&'
  },
  template,
}

/** @ngInject */
function ComponentController (EventNotifications, CollectionsApi) {
  const vm = this

  vm.$onInit = () => {
    angular.extend(vm, {
      genericObjectsListConfig: {
        showSelectBox: false,
        useExpandingRows: true,
        compoundExpansionOnly: true
      },
      customActionClick: customActionClick,
      toggleExpand: toggleExpand
    })
  }
  function toggleExpand (item) {
    item.isExpanded = !item.isExpanded
    vm.onUpdate({object: item})
  }
  function customActionClick (item, action) {
    const data = {
      action: action
    }
    CollectionsApi.post('generic_objects', item.id, {}, data).then((response) => {
      EventNotifications.success(response.message)
    }).catch((response) => {
      EventNotifications.error(__('An error occured'))
    })
  }
}
