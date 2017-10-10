/* eslint-disable dot-notation */
import TokenActions from '../actions/token.actions'
import UserActions from '../actions/user.actions'
/** @ngInject */
export function SessionFactory (lodash, $http, $q, $sessionStorage, $cookies, $ngRedux, RBAC, Polling) {
  const model = {
    token: null,
    user: {}
  }

  const service = {
    current: model,
    setAuthToken: setAuthToken,
    setGroup: setGroup,
    destroy: destroy,
    active: active,
    currentUser: currentUser,
    loadUser: loadUser,
    requestWsToken: requestWsToken,
    destroyWsToken: destroyWsToken,
    setPause: setPause
  }
  const vm = this
  const actions = lodash.merge(TokenActions, UserActions)
  vm.unsubscribe = $ngRedux.connect(mapStateToThis, actions)(vm)
  // console.log(vm.token.get('token'))
  function mapStateToThis (state) {
    return {
      token: state.token,
      user: state.user
    }
  }

  destroy()

  return service

  function setAuthToken (token) {
    console.log('token being set ' + token)
    model.token = token
    vm.addToken(token)
    $http.defaults.headers.common['X-Auth-Token'] = model.token
    $sessionStorage.token = model.token
  }

  function setGroup (group) {
    $http.defaults.headers.common['Accept'] = 'application/json;charset=UTF-8'
    if (typeof group === 'object') {
      $http.defaults.headers.common['X-Miq-Group'] = group.description
      model.user.group = group.description
      model.user.group_href = group.href
      $sessionStorage.miqGroup = group.description
      $sessionStorage.selectedMiqGroup = group.description
    } else {
      $http.defaults.headers.common['X-Miq-Group'] = group
      $sessionStorage.miqGroup = group
      $sessionStorage.selectedMiqGroup = group
      model.user.group = group
    }
  }

  function setPause (pauseLength) {
    $sessionStorage.pause = pauseLength * 1000

    return $sessionStorage.pause
  }

  function destroy () {
    model.token = null
    model.user = {}
    destroyWsToken()
    delete $http.defaults.headers.common['X-Auth-Token']
    delete $sessionStorage.miqGroup
    delete $sessionStorage.selectedMiqGroup
    delete $sessionStorage.token
    delete $sessionStorage.user
  }

  function loadUser () {
    Polling.start('UserPolling', getUserAuthorizations, 300000)
    // USERS HAVE, a group, role, and selected Group
    return new Promise((resolve, reject) => {
      getUserAuthorizations().then(function (response) {
        const user = {
          identity: response.identity,
          group: response.identity.group,
          role: response.identity.role
        }
        vm.addUser(user)
        // RBAC.setRole(response.identity.role)
        resolve(response)
      })
    })
/*
    } else {
      const response = angular.fromJson($sessionStorage.user)
      currentUser(response.identity)
      const miqGroup = (angular.isUndefined($sessionStorage.selectedMiqGroup) ? response.identity.group : $sessionStorage.selectedMiqGroup)
      setGroup(miqGroup)
      RBAC.set(response.authorization.product_features)
      deferred.resolve(response)
    }

    return deferred.promise */
  }

  function getUserAuthorizations () {
    const config = {
      headers: {
        'X-Auth-Skip-Token-Renewal': 'true'
      }
    }

    return $http.get('/api?attributes=authorization', config)
    .then(function (response) {
      currentUser(response.data.identity)
      setGroup(response.data.identity.group)
      RBAC.set(response.data.authorization.product_features)

      return response.data
    })
  }

  function requestWsToken (arg) {
    return $http.get('/api/auth?requester_type=ws')
    .then(function (response) {
      destroyWsToken()
      $cookies.put('ws_token', response.data.auth_token, {path: '/ws/notifications'})

      return arg
    })
  }

  function destroyWsToken () {
    $cookies.remove('ws_token', {path: '/ws/notifications'})
  }

  function currentUser (user) {
    if (angular.isDefined(user)) {
      model.user = user
    }

    return model.user
  }

  // Helpers

  function active () {
    // may not be current, but if we have one, we'll rely on API 401ing if it's not
    const token = vm.token
    console.log(`Token status: ${token}`)
    return token
  //  return angular.isString(token) ? token : false
  }
}
