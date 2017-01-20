/** @ngInject */
export function DialogsState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'designer.dialogs': {
      parent: 'application',
      url: '/dialogs',
      redirectTo: 'designer.dialogs.list',
      template: '<ui-view></ui-view>',
    },
  };
}
