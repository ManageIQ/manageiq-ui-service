/* eslint camelcase: "off" */

/** @ngInject */
export function authConfig ($httpProvider) {
  $httpProvider.interceptors.push(interceptor)

  /** @ngInject */
  function interceptor ($injector, $q, $window) {
    return {
      response: response,
      responseError: responseError
    }

    function response (res) {
      if (res.status === 401) {
        endSession()

        return $q.reject(res)
      }

      return $q.resolve(res)
    }

    function responseError (rej) {
      if (rej.status === 401) {
        endSession()

        return $q.reject(rej)
      }

      return $q.reject(rej)
    }

    function endSession () {
      var $state = $injector.get('$state')
      var Session = $injector.get('Session')

      if ($state.current.name !== 'login') {
        Session.destroy()
        $window.location.href = $state.href('login') + '?timeout'
      }
    }
  }
}
