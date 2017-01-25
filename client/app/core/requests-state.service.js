/** @ngInject */
export function RequestsStateFactory(ListConfiguration) {
  var service = {};

  ListConfiguration.setupListFunctions(service, { id: 'requested', title: __('Request Date'), sortType: 'numeric' });

  return service;
}
