import './_language-switcher.sass'
import templateUrl from './language-switcher.html'

/** @ngInject */
export function LanguageSwitcherDirective () {
  return {
    restrict: 'AE',
    scope: {
      mode: '@?'
    },
    templateUrl,
    controller: LanguageSwitcherController,
    controllerAs: 'vm',
    bindToController: true
  }

  /** @ngInject */
  function LanguageSwitcherController (Language, lodash, $state, Session) {
    const vm = this

    angular.extend(vm, {
      switchLanguage: switchLanguage,
      available: []
    })

    vm.mode = vm.mode || 'menu'

    const hardcoded = {
      _browser_: __('Browser Default')
    }

    Language.ready
    .then(function (available) {
      if (vm.mode !== 'menu') {
        hardcoded._user_ = __('User Default')
        Language.chosen = {code: '_user_'}
      }
      lodash.forEach(lodash.extend({}, hardcoded, available), (value, key) => {
        vm.available.push({value: key, label: value})
      })
      vm.chosen = lodash.find(vm.available, {'value': '_user_'})
    })

    function switchLanguage (input) {
      Language.setLocale(input.value || input)
      if (!input.value) {
        Language.save(input).then((response) => {
          Session.updateUserSession({settings: {ui_service: {display: {locale: response.data.settings.ui_service.display.locale}}}})
        })
        $state.reload()
      }
    }
  }
}
