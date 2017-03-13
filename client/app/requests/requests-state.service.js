/** @ngInject */
export function RequestsStateFactory(ListConfiguration, RBAC) {
  var service = {
    getPermissions: getPermissions,
  };

  ListConfiguration.setupListFunctions(service, { id: 'requested', title: __('Request Date'), sortType: 'numeric' });

  function getPermissions() {
    const permissions = {
      approval: RBAC.hasAny(['miq_request_approval','miq_request_admin','miq_request','miq_request_control']),
      edit: RBAC.hasAny(['miq_request_edit','miq_request_admin','miq_request','miq_request_control']),
    };

    return permissions;
  }

  return service;
}
