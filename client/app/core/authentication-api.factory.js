import base64js from 'base64-js'
import TextEncoderLite from 'text-encoder-lite'

// utf8-capable window.btoa
function base64encode (str, encoding = 'utf-8') {
  let bytes = new (TextEncoder || TextEncoderLite)(encoding).encode(str)
  return base64js.fromByteArray(bytes)
}

/** @ngInject */
export function AuthenticationApiFactory ($http, API_BASE, Session, Notifications) {
  var service = {
    login: login
  }

  return service

  function login (userLogin, password) {
    return new Promise((resolve, reject) => {
      $http.get(API_BASE + '/api/auth?requester_type=ui', {
        headers: {
          'Authorization': 'Basic ' + base64encode([userLogin, password].join(':')),
          'X-Auth-Token': undefined
        }
      }).then(loginSuccess, loginFailure)

      function loginSuccess (response) {
        Session.setAuthToken(response.data.auth_token)
        resolve(response)
      }

      function loginFailure (response) {
        Session.destroy()
        reject(response)
      }
    })
  }
}
