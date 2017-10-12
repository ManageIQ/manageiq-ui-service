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
    const location = $window.location.href
    if (location.includes(`/ui/service`)) {
      $window.location.href = `/ui/service/`
    } else {
      $window.location.href = `/`
    }
  }
}
