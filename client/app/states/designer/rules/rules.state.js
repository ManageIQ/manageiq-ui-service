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
          profiles: resolveProfiles
        }
      }
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
  function RulesController(designerRules, fields, profiles, RulesState, SaveRuleModal, $state, $scope, $timeout) {
    /* jshint validthis: true */
    var vm = this;
    vm.operators = [
      {
        value: 'EQUAL',
        name: "equals"
      },
      {
        value: 'NOT',
        name: "does not equal"
      }
    ];

    var compareRules = function(item1, item2) {
      var compValue;
      if (item1.priority <= item2.priority) {
        compValue = -1;
      } else {
        compValue = 1;
      }

      return compValue;
    };

    var updateRuleInfo = function(rule) {
      if (rule.expression && rule.expression.exp) {
        if (rule.expression.exp.EQUAL) {
          rule.operator = vm.operators[0];
          rule.field = rule.expression.exp.EQUAL.field;
          rule.value = rule.expression.exp.EQUAL.value;
        } else if (rule.expression.exp.NOT) {
          rule.operator = vm.operators[1];
          rule.field = rule.expression.exp.NOT.field;
          rule.value = rule.expression.exp.NOT.value;
        } else {
          rule.operator = vm.operators[0];
        }
      } else {
        rule.operator = vm.operators[0];
      }

      if (vm.profiles && vm.profiles.length > 0) {
        var profile = vm.profiles.find(function(nextProfile) {
          return nextProfile.id === rule.arbitration_profile_id;
        });
        if (profile) {
          rule.profileName = profile.name;
        }
      }
    };

    var updateRulesInfo = function() {
      angular.forEach(vm.designerRules, function(rule) {
        updateRuleInfo(rule);
      });

      vm.designerRules.sort(compareRules);
    };

    var convertToRuleObj = function(rule) {
      var ruleObj = {
        id: rule.id,
        priority: rule.priority,
        operation: rule.operation
      };
      var fieldObj = {
        field: rule.field,
        value: rule.value
      };

      var operator = vm.operators.find(function(nextOperator) {
        return nextOperator.name === rule.operator.name;
      });
      if (operator.value === "EQUAL") {
        ruleObj.expression = {
          EQUAL: fieldObj
        };
      } else {
        ruleObj.expression = {
          NOT: fieldObj
        };
      }
      var profile = vm.profiles.find(function(nextProfile) {
        return nextProfile.name === rule.profileName;
      });
      if (profile) {
        ruleObj.arbitration_profile_id =  profile.id;
      }

      return ruleObj;
    };

    var loadSuccess = function(designerRules) {
      function editSuccess() {
        refreshRules();
      }

      function editFailure() {
      }

      $timeout(function() {  // Done in a timeout since results are massaged outside of a $digest
        vm.designerRules = designerRules.resources;

        if (vm.updatePriorities === true && vm.designerRules && vm.designerRules.length > 0) {
          vm.designerRules.sort(compareRules);
          angular.forEach(vm.designerRules, function(rule, index) {
            rule.priority = index + 1;
          });
          vm.updatePriorities = false;
          var editRules = [];
          angular.forEach(vm.designerRules, function(rule) {
            editRules.push(rule);
          });
          RulesState.editRules(editRules).then(editSuccess, editFailure);
        } else {
          updateRulesInfo();
        }
      });
    };

    var loadFailure = function() {
    };

    var refreshRules = function() {
      RulesState.getRules().then(loadSuccess, loadFailure);
    };

    var updateRulesPriorities = function(saveRules) {
      var editRules = [];

      angular.forEach(vm.designerRules, function(rule, index) {
        rule.priority = index + 1;
      });

      function editSuccess() {
        refreshRules();
      }

      function editFailure() {
      }

      if (saveRules === true) {
        angular.forEach(vm.designerRules, function(rule) {
          editRules.push(convertToRuleObj(rule));
        });
        RulesState.editRules(editRules).then(editSuccess, editFailure);
      }
    };

    vm.title = __('Rules');
    vm.designerRules = designerRules.resources;
    vm.fields = fields.resources;
    vm.profiles = profiles.resources;
    vm.profileNames = [];
    angular.forEach(profiles.resources, function(profile) {
      vm.profileNames.push(profile.name);
    });
    vm.operatorNames = [];
    angular.forEach(vm.operators, function(operator) {
      vm.operatorNames.push(operator.name);
    });
    vm.updatePriorities = false;
    vm.editMode = false;

    updateRulesInfo();

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      var editedRule;

      if (toState.name === 'login' || vm.saveModalShown) {
        return;
      }

      if (fromState.name === "designer.rules" && toState.name !== "designer.rules" && vm.editMode) {
        editedRule = vm.designerRules.find(function(rule) {
          return rule.editMode === true;
        });
        if (!editedRule && vm.designerRules[0] && !vm.designerRules[0].id) {
          editedRule = vm.designerRules[0];
        }
        vm.saveModalShown = true;
        SaveRuleModal.showModal(save, doNotSave, cancel);
        event.preventDefault();
      }

      function save() {
        vm.editMode = false;
        vm.saveModalShown = false;
        function saveSuccess() {
          $state.go(toState, toParams);
        }

        function saveFailure() {
          $state.go(toState, toParams);
        }

        if (editedRule.original) {
          RulesState.editRules([convertToRuleObj(editedRule)]).then(saveSuccess, saveFailure);
        } else {
          RulesState.addRule(convertToRuleObj(editedRule)).then(saveSuccess, saveFailure);
        }
      }

      function doNotSave() {
        vm.editMode = false;
        vm.saveModalShown = false;
        $state.go(toState, toParams);
      }

      function cancel() {
        vm.saveModalShown = false;
      }
    });

    vm.addRule = function() {
      var newRule = {
        operation: 'inject',
        operator: vm.operators[0],
        editMode: true
      };
      updateRuleInfo(newRule);

      vm.designerRules.splice(0, 0, newRule);
      updateRulesPriorities(false);

      vm.editMode = true;
    };

    vm.editRule = function(rule) {
      rule.editMode = true;
      rule.original = {
        field: rule.field,
        operator: rule.operator.value,
        value: rule.value,
        arbitration_profile_id: rule.arbitration_profile_id
      };
      vm.editMode = true;
    };

    vm.removeRule = function(rule) {
      RulesState.deleteRules([rule.id]).then(removeSuccess, removeFailure);

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

    vm.cancelEditRule = function(rule) {
      rule.editMode = false;
      vm.editMode = false;
      if (!rule.original) {
        vm.designerRules.splice(0, 1);
        updateRulesPriorities(false);
      } else {
        rule.field = rule.original.field;
        rule.operator = vm.operators.find(function(nextOperator) {
          return nextOperator.value === rule.original.operator;
        });
        rule.value = rule.original.value;
        rule.profile = rule.original.profile;
        rule.original = undefined;
      }
    };

    vm.saveRule = function(rule) {
      var editRules = [];
      if (rule.original) {
        editRules.push(convertToRuleObj(rule));
        RulesState.editRules(editRules).then(saveSuccess, saveFailure);
      } else {
        RulesState.addRule(convertToRuleObj(rule)).then(addSuccess, saveFailure);
      }

      function addSuccess() {
        vm.editMode = false;
        if (vm.designerRules.length > 1) {
          angular.forEach(vm.designerRules, function(nextRule, index) {
            if (index > 0) {
              editRules.push(convertToRuleObj(nextRule));
            }
          });
          RulesState.editRules(editRules).then(saveSuccess, saveFailure);
        } else {
          refreshRules();
        }
      }

      function saveSuccess() {
        rule.editMode = false;
        vm.editMode = false;
        refreshRules();
      }

      function saveFailure() {
      }
    };

    vm.ruleDrag = function(rule) {
      vm.dragRule = rule;
    };

    vm.ruleMoved = function() {
      var ruleIndex = vm.designerRules.findIndex(function(nextRule) {
        return nextRule === vm.dragRule;
      });
      if (ruleIndex >= 0) {
        vm.designerRules.splice(ruleIndex, 1);
      }
    };

    vm.adjustPriorities = function(event) {
      updateRulesPriorities(true);
    };

    vm.downPriority = function(rule) {
      var index = vm.designerRules.indexOf(rule);
      if (index >= 0 && index < vm.designerRules.length) {
        vm.designerRules.splice(index, 1);
        vm.designerRules.splice(index + 1, 0, rule);
      }
      updateRulesPriorities(true);
    };

    vm.upPriority = function(rule) {
      var index = vm.designerRules.indexOf(rule);
      if (index > 0) {
        vm.designerRules.splice(index, 1);
        vm.designerRules.splice(index - 1, 0, rule);
      }
      updateRulesPriorities(true);
    };
    vm.dropCallback = function(event, ui, item, index) {
      console.log("Dropped " + item.value + " at index " + index);
    };
    vm.toolbarConfig = {
      actionsConfig: {
        actionsInclude: true
      }
    };
  }
})();
