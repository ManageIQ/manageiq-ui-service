/** @ngInject */
export function DesignerState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'designer': {
      parent: 'application',
      url: '/designer',
      redirectTo: 'designer.dialogs',
    },
  };
}
