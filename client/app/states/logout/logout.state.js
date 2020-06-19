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
function StateController (Session, API_BASE, $window) {
  activate()

  function activate () {
    var targetLocation
    const authMode = Session.getAuthMode()
    Session.destroy()
    const location = $window.location.href
    if (location.includes(`/ui/service`)) {
      targetLocation = `/ui/service/`
    } else {
      targetLocation = `/`
    }
    if (authMode == 'oidc') {
      $window.location.href = '/oidc_login/redirect_uri?logout=' + encodeURI(API_BASE + targetLocation)
    } else {
      $window.location.href = targetLocation
    }
  }
}
