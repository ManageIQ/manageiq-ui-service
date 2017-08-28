/** @ngInject */
export function LogoutState (routerHelper) {
  routerHelper.configureStates(getStates())
}

function getStates () {
  return {
    'logout': {
      url: '/logout',
      controller: StateController,
      controllerAs: 'vm',
      title: N_('Logout')
    }
  }
}

/** @ngInject */
function StateController (Session, $window) {
  activate()

  function activate () {
    Session.destroy()
    $window.location.href = $window.location.href
  }
}
