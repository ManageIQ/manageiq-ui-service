(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'designer.rules': {
        parent: 'application',
        url: '/designer/rules',
        templateUrl: 'app/states/designer/rules/rules.html',
        controller: RulesController,
        controllerAs: 'vm',
        title: N_('Rules'),
        resolve: {
          designerRules: resolveRules,
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

  function resolveProfiles(RulesState) {
    return RulesState.getProfiles();
  }

  /** @ngInject */
  function RulesController(designerRules, fields, profiles, RulesState, $scope) {
    /* jshint validthis: true */
    var vm = this;

    var compareRules = function(item1, item2) {
      var compValue;
      if (item1.priority <= item2.priority) {
        compValue = -1;
      } else {
        compValue = 1;
      }

      return compValue;
    };

    var updateRulesInfo = function() {
      angular.forEach(vm.designerRules, function(rule) {
        if (rule.id === vm.editRuleId) {
          rule.editMode = true;
        }
        if (rule.expression && rule.expression.exp) {
          if (rule.expression.exp.EQUAL) {
            rule.operation = "equals";
            rule.field = rule.expression.exp.EQUAL.field;
            rule.value = rule.expression.exp.EQUAL.value;
          } else if (rule.expression.exp.NOT) {
            rule.operation = "does not equal";
            rule.field = rule.expression.exp.Not.field;
            rule.value = rule.expression.exp.NOT.value;
          }
        }

        if (vm.profiles && vm.profiles.length > 0) {
          rule.profile = vm.profiles.find(function(nextProfile) {
            return nextProfile.id === rule.arbitration_profile_id;
          });
        }

        rule.removeRule = function() {
          vm.removeRule(rule);
        };
        rule.editRule = function() {
          vm.editRule(rule);
        };
      });

      vm.designerRules.sort(compareRules);
    };

    function editSuccess() {
      refreshRules();
    }

    function editFailure() {
    }

    var loadSuccess = function(designerRules) {
      vm.designerRules = designerRules.resources;

      if (vm.updatePriorities === true && vm.designerRules && vm.designerRules.length > 0) {
        vm.designerRules.sort(compareRules);
        angular.forEach(vm.designerRules, function(rule, index) {
          rule.priority = index + 1;
        });
        vm.updatePriorities = false;
        RulesState.editRules(vm.designerRules).then(editSuccess, editFailure);
      } else {
        updateRulesInfo();
      }
    };

    var loadFailure = function() {
    };

    var refreshRules = function() {
      RulesState.getRules().then(loadSuccess, loadFailure);
    };

    vm.title = __('Rules');
    vm.designerRules = designerRules.resources;
    vm.fields = fields.resources;
    vm.profiles = profiles.resources;
    vm.updatePriorities = false;

    updateRulesInfo();

    vm.editRuleId = -1;
    vm.listConfig = {
      selectItems: false,
      showSelectBox: false,
    };

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (toState.name === 'login') {
        return;
      }
      /** TODO Check if editing a rule **/
    });

    vm.addRule = function() {
      var newRule = {
        priority: vm.designerRules.length + 1, // By default put new rules at the end of the prioritized list
        operation: 'inject',
        expression: {
          EQUAL: {
          },
        },
      };

      RulesState.addRule(newRule).then(addSuccess, addFailure);

      function addSuccess(id) {
        refreshRules();
        vm.editRuleId = id;
      }

      function addFailure() {
      }
    };

    vm.editRule = function(rule) {
      // TODO: Put rule into edit mode
    };

    vm.removeRule = function(rule) {
      RulesState.deleteRules([rule]).then(removeSuccess, removeFailure);

      function removeSuccess(id) {
        vm.updatePriorities = true;
        refreshRules();
        if (vm.editRuleId === id) {
          vm.editRuleId = -1;
        }
      }

      function removeFailure() {
      }
    };

    vm.toolbarConfig = {
      actionsConfig: {
        actionsInclude: true,
      },
    };
  }
})();
