import templateUrl from './explorer.html';

/** @ngInject */
export function RequestsExplorerState(routerHelper, RBAC) {
  routerHelper.configureStates(getStates(RBAC));
}

function getStates(RBAC) {
  return {
    'requests.explorer': {
      url: '',
      templateUrl,
      controllerAs: 'vm',
      title: __('Requests'),
      params: { 'filter': null },
      data: {
        authorization: RBAC.hasAny(['miq_request','miq_request_admin','miq_request_show', 'miq_request_show_list']),
      },
    },
  };
}
