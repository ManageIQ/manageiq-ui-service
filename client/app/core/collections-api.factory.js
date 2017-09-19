/** @ngInject */
export function CollectionsApiFactory ($http, API_BASE, lodash) {
  return {
    query: query,
    get: get,
    post: post,
    delete: remove
  }

  function query (collection, options) {
    return $http.get(`${API_BASE}/api/${collection}${buildQuery(options)}`, buildConfig(options))
      .then(handleSuccess)
  }

  function get (collection, id, options) {
    return $http.get(`${API_BASE}/api/${collection}/${id}${buildQuery(options)}`, buildConfig(options))
      .then(handleSuccess)
  }

  function post (collection, id, options, data) {
    return $http.post(`${API_BASE}/api/${collection}/${id || ''}${buildQuery(options)}`, data, buildConfig(options))
      .then(handleSuccess)
  }

  function remove (collection, id, options) {
    return $http.delete(`${API_BASE}/api/${collection}/${id || ''}${buildQuery(options)}`, buildConfig(options))
      .then(handleSuccess)
  }

  // Private
  function handleSuccess (response) {
    return response.data
  }

  function buildQuery (options) {
    const params = []

    lodash.forEach(options, (value, key) => {
      switch (key) {
        case 'filter':
          lodash.forEach(value, (filter) => {
            params.push('filter[]=' + encodeURIComponent(filter))
          })
          break
        case 'auto_refresh':
          break
        default:
          params.push(`${key}=${encodeURIComponent(joinArray(value))}`)
      }
    })

    function joinArray (value) {
      return Array.isArray(value) ? value.join(',') : value
    }

    return params.length ? '?' + params.join('&') : ''
  }

  function buildConfig (options) {
    const config = {}
    options = options || {}

    if (options.auto_refresh) {
      config.headers = {
        'X-Auth-Skip-Token-Renewal': 'true'
      }
    }

    return config
  }
}
