/** @ngInject */
export function RequestsStateFactory(ListConfiguration, RBAC) {
  var service = {
    getPermissions: getPermissions,
  };

  ListConfiguration.setupListFunctions(service, { id: 'requested', title: __('Request Date'), sortType: 'numeric' });

  function getPermissions() {
    const permissions = {
      approval: RBAC.hasAny(['miq_request_approval']),
      edit: RBAC.hasAny(['miq_request_edit']),
    };

    return permissions;
  }

  return service;
}
