/** @ngInject */
export function DialogsState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'dialogs': {
      parent: 'application',
      url: '/dialogs',
      redirectTo: 'dialogs.list',
      template: '<ui-view></ui-view>',
    },
  };
}
