/** @ngInject */
export function AboutMeState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'about-me': {
      parent: 'application',
      url: '/about-me',
      templateUrl: 'app/states/about-me/about-me.html',
      controller: StateController,
      controllerAs: 'vm',
      title: N_('About Me'),
    },
  };
}

/** @ngInject */
function StateController() {
}
