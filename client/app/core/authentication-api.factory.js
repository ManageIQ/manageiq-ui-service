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
    login: login,
  };

  return service;

  function loginSuccess(response) {
    Session.setAuthToken(response.data.auth_token);
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
