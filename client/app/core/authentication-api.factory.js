import base64js from 'base64-js'
const TextEncoderLite = require('text-encoder-lite').TextEncoderLite

// utf8-capable window.btoa
function base64encode (str, encoding = 'utf-8') {
  let bytes = new (window.TextEncoder || TextEncoderLite)(encoding).encode(str);
  return base64js.fromByteArray(bytes);
}

/** @ngInject */
export function AuthenticationApiFactory ($http, API_BASE, Session, Notifications) {
  var service = {
    globalLogin: globalLogin,
    login: login,
    oidcLogin: oidcLogin
  };

  return service;

  function globalLogin (authMode, userLogin, password, access_token) {
    if (authMode == 'oidc') {
      self.currentAuthMode = authMode
      return oidcLogin(access_token)
    } else {
      self.currentAuthMode = 'database'
      return login(userLogin, password)
    }
  }

  function oidcLogin (access_token) {
    return new Promise((resolve, reject) => {

      return $http.get(API_BASE + '/api/auth?requester_type=ui', {
        headers: {
          'Authorization': 'Bearer ' + access_token,
          'X-Auth-Token': undefined,
          'X-Requested-With': 'XMLHttpRequest',
        },
      }).then(loginSuccess, loginFailure);

      function loginSuccess (response) {
        Session.setAuthToken(response.data.auth_token)
        Session.setAuthMode(self.currentAuthMode)
        resolve(response)
      }

      function loginFailure (response) {
        Session.destroy()
        reject(response)
      }

    })
  }

  function loginSuccess(response) {
    Session.setAuthToken(response.data.auth_token);
    Session.setAuthMode(self.currentAuthMode)
    return response;
  }

  function loginFailure(error) {
    Session.destroy();
    return Promise.reject(error);
  }

  function login(userLogin, password) {
    return $http.get(API_BASE + '/api/auth?requester_type=ui', {
      headers: {
        'Authorization': 'Basic ' + base64encode([userLogin, password].join(':')),
        'X-Auth-Token': undefined,
        'X-Requested-With': 'XMLHttpRequest',
      },
    }).then(loginSuccess, loginFailure);
  }
}
