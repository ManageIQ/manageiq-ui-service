import './_language-switcher.sass'
import template from './language-switcher.html';

/** @ngInject */
export const LanguageSwitcherComponent = {
  controller: LanguageSwitcherController,
  controllerAs: 'vm',
  bindings: {
    modalInstance: '@?',
    mode: '@?'
  },
  template,
}

  /** @ngInject */
function LanguageSwitcherController (Language, lodash, $state, Session) {
  const vm = this

  angular.extend(vm, {
    switchLanguage: switchLanguage,
    available: []
  })
  vm.$onInit = function () {
    vm.mode = vm.mode || 'menu'
    const hardcoded = {
      _browser_: __('Browser Default')
    }

    Language.ready
      .then(function (available) {
        if (vm.mode !== 'menu') {
          hardcoded._user_ = __('User Default')
          Language.chosen = { code: '_user_' }
        }
        lodash.forEach(lodash.extend({}, hardcoded, available), (value, key) => {
          vm.available.push({ value: key, label: value })
        })
        vm.chosen = lodash.find(vm.available, { 'value': '_user_' })
      })
  }
  function switchLanguage (input) {
    const languageCode = input.value || input

    if (vm.mode === 'select') {
      Language.setLoginLanguage(languageCode)
    } else {
      Language.setLocale(languageCode)
    }

    if (vm.mode === 'menu') {
      Language.save(languageCode).then((response) => {
        Session.updateUserSession({ settings: { locale: response.data.settings.display.locale } })
      })
      $state.reload()
    }
  }
}
