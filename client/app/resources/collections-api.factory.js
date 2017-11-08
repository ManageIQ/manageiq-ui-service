(function() {
  'use strict';

  angular.module('app.resources')
    .factory('CollectionsApi', CollectionsApiFactory);

  /** @ngInject */
  function CollectionsApiFactory($http, API_BASE, lodash) {
    var service = {
      query: query,
      get: get,
      post: post,
      delete: remove,
    };

    return service;

    function query(collection, options) {
      var url = API_BASE + '/api/' + collection;

      // console.log("query = " + url + buildQuery(options));

      return $http.get(url + buildQuery(options), buildConfig(options))
        .then(handleSuccess);

      function handleSuccess(response) {
        return response.data;
      }
    }

    function get(collection, id, options) {
      var url = API_BASE + '/api/' + collection + '/' + id;

      // console.log("get = " + url + buildQuery(options));

      return $http.get(url + buildQuery(options), buildConfig(options))
        .then(handleSuccess);

      function handleSuccess(response) {
        return response.data;
      }
    }

    function post(collection, id, options, data) {
      var url = API_BASE + '/api/' + collection + '/' + (id || "") + buildQuery(options);

      // console.log("post = " + url + buildQuery(options));

      return $http.post(url, data, buildConfig(options))
        .then(handleSuccess);

      function handleSuccess(response) {
        return response.data;
      }
    }

    // delete is a reserved word in JS
    function remove(collection, id, options) {
      var url = API_BASE + '/api/' + collection + '/' + (id || "") + buildQuery(options);

      // $log.debug("post = " + url + buildQuery(options));

      return $http.delete(url, buildConfig(options))
        .then(handleSuccess);

      function handleSuccess(response) {
        return response.data;
      }
    }

    // Private

    function buildQuery (options) {
      const params = [];

      lodash.forEach(options, (value, key) => {
        switch (key) {
          case 'filter':
            lodash.forEach(value, (filter) => {
              params.push('filter[]=' + encodeURIComponent(filter))
            });
            break;
          case 'auto_refresh':
            break;
          default:
            params.push(`${key}=${encodeURIComponent(joinArray(value))}`)
        }
      });

      function joinArray (value) {
        return Array.isArray(value) ? value.join(',') : value
      }

      return params.length ? '?' + params.join('&') : ''
    }

    function buildConfig(options) {
      var config = {};
      options = options || {};

      if (options.auto_refresh) {
        config.headers = {
          'X-Auth-Skip-Token-Renewal': 'true',
        };
      }

      return config;
    }
  }
})();
