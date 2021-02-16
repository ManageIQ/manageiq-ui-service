import languageFile from '../gettext/json/manageiq-ui-service.json'

export default function() {
  const urlParams = new URLSearchParams(window.location.search)

  const params = ['path', 'is_vcloud', 'vmx', 'lang'].reduce((map, obj) => {
    map[obj] = urlParams.get(obj)
    return map
  }, {})

  window.__ = (string) => (languageFile[params.lang] || {})[string] || string

  document.querySelector('#connection-status').innerHTML = __('Connecting')
  document.querySelector('#ctrlaltdel').title = __('Send CTRL+ALT+DEL')

  return params
}
