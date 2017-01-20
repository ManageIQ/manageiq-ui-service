/** @ngInject */
export function AdminState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'administration': {
      parent: 'application',
      url: '',
      redirectTo: 'administration.profiles',
    },
  };
}
