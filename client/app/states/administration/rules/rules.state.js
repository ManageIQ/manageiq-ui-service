/* eslint camelcase: "off" */

/** @ngInject */
export function RulesState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'administration.rules': {
      parent: 'application',
      url: '/administration/rules',
      templateUrl: 'app/states/administration/rules/rules.html',
      controller: RulesController,
      controllerAs: 'vm',
      title: N_('Rules'),
      resolve: {
        arbitrationRules: resolveRules,
        fields: resolveRuleFields,
        profiles: resolveProfiles,
      },
    },
  };
}

/** @ngInject */
function resolveRules(RulesState) {
  return RulesState.getRules();
}

/** @ngInject */
function resolveRuleFields(RulesState) {
  return RulesState.getRuleFields();
}

/** @ngInject */
function resolveProfiles(ProfilesState) {
  return ProfilesState.getProfiles();
}

/** @ngInject */
function RulesController(arbitrationRules, fields, profiles) {
  var vm = this;

  vm.title = __('Rules');
  vm.arbitrationRules = arbitrationRules.resources;
  vm.fields = fields.resources;
  vm.profiles = profiles.resources;
}
