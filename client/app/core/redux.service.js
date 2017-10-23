/** @ngInject */
import { persistStore } from 'redux-persist'
import { asyncSessionStorage } from 'redux-persist/storages'

export function ReduxFactory ($rootScope, $ngRedux) {
  const service = {
    loadRedux: loadRedux,
    clear: clear
  }

  return service
  function clear () {
    return new Promise((resolve, reject) => {
      persistStore($ngRedux, { storage: asyncSessionStorage }, () => {
        resolve()
      }).purge()
    })
  }
  function loadRedux () {
    return new Promise((resolve, reject) => {
      if ($rootScope.rehydrated) {
        resolve()
      } else {
        persistStore($ngRedux, { storage: asyncSessionStorage }, () => {
          $rootScope.rehydrated = true
          resolve()
        })
      }
    })
  }
}
