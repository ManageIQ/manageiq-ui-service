import templateUrl from './help.html'

/** @ngInject */
export function HelpState (routerHelper) {
  routerHelper.configureStates(getStates())
}

function getStates () {
  return {
    'help': {
      parent: 'application',
      url: '/',
      templateUrl,
      controller: StateController,
      controllerAs: 'vm',
      title: N_('Help')
    }
  }
}

/** @ngInject */
function StateController () {
}
