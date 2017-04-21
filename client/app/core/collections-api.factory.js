/* eslint camelcase: "off" */

/** @ngInject */
export function CollectionsApiFactory($http, API_BASE) {
  const service = {
    query: query,
    get: get,
    post: post,
    options: options,
    delete: remove,
  };

  return service;

  function query(collection, options) {
    const url = API_BASE + '/api/' + collection;

    // $log.debug("query = " + url + buildQuery(options));

    return $http.get(url + buildQuery(options), buildConfig(options))
      .then(handleSuccess);

    function handleSuccess(response) {
      return response.data;
    }
  }

  function get(collection, id, options) {
    const url = API_BASE + '/api/' + collection + '/' + id;

    // $log.debug("get = " + url + buildQuery(options));

    return $http.get(url + buildQuery(options), buildConfig(options))
      .then(handleSuccess);

    function handleSuccess(response) {
      return response.data;
    }
  }

  function post(collection, id, options, data) {
    const url = API_BASE + '/api/' + collection + '/' + (id || "") + buildQuery(options);

    // $log.debug("post = " + url + buildQuery(options));

    return $http.post(url, data, buildConfig(options))
      .then(handleSuccess);

    function handleSuccess(response) {
      return response.data;
    }
  }

  function options(collection) {
    const url = API_BASE + '/api/' + collection;

    return $http.get(url + buildQuery(options))
      .then(handleSuccess);

    function handleSuccess(response) {
      return response.data;
    }
  }

  // delete is a reserved word in JS
  function remove(collection, id, options) {
    const url = API_BASE + '/api/' + collection + '/' + (id || "") + buildQuery(options);

    // $log.debug("post = " + url + buildQuery(options));

    return $http.delete(url, buildConfig(options))
      .then(handleSuccess);

    function handleSuccess(response) {
      return response.data;
    }
  }

  // Private

  function buildQuery(options) {
    const params = [];
    options = options || {};

    if (options.expand) {
      if (angular.isArray(options.expand)) {
        options.expand = options.expand.join(',');
      }
      params.push('expand=' + encodeURIComponent(options.expand));
    }

    if (options.attributes) {
      if (angular.isArray(options.attributes)) {
        options.attributes = options.attributes.join(',');
      }
      params.push('attributes=' + encodeURIComponent(options.attributes));
    }

    if (options.format_attributes) {
      if (angular.isArray(options.format_attributes)) {
        options.format_attributes = options.format_attributes.join(',');
      }
      params.push('format_attributes=' + encodeURIComponent(options.format_attributes));
    }

    if (options.filter) {
      angular.forEach(options.filter, function(filter) {
        params.push('filter[]=' + encodeURIComponent(filter));
      });
    }

    if (options.limit) {
      params.push('limit=' + encodeURIComponent(options.limit));
    }

    if (options.offset) {
      params.push('offset=' + encodeURIComponent(options.offset));
    }

    if (options.hide) {
      params.push('hide=' + encodeURIComponent(options.hide));
    }

    if (options.sort_by) {
      params.push('sort_by=' + encodeURIComponent(options.sort_by));
    }

    if (options.sort_order) {
      params.push('sort_order=' + encodeURIComponent(options.sort_order));
    }

    if (options.sort_options) {
      params.push('sort_options=' + encodeURIComponent(options.sort_options));
    }

    return params.length ? '?' + params.join('&') : '';
  }

  function buildConfig(options) {
    const config = {};
    options = options || {};

    if (options.auto_refresh) {
      config.headers = {
        'X-Auth-Skip-Token-Renewal': 'true',
      };
    }

    return config;
  }
}
