/** @ngInject */
export function MarketplaceStateFactory(ListConfiguration) {
  var service = {};

  ListConfiguration.setupListFunctions(service, { id: 'name', title: __('Name'), sortType: 'alpha' });

  return service;
}
