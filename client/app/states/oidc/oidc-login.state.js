/** @ngInject */
export function OidcLoginState (routerHelper) {
  routerHelper.configureStates(getStates())
}

function getStates () {
  return {
    'oidc-login': {
      parent: 'application',
      url: '/oidc_login',
      redirectTo: 'login',
      template: '<ui-view></ui-view>'
    }
  }
}
