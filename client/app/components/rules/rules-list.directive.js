/* eslint camelcase: "off" */
(function() {
  'use strict';

  angular.module('app.components')
    .directive('rulesList', function() {
      return {
        restrict: 'AE',
        templateUrl: "app/components/rules/rules-list.html",
        scope: {
          arbitrationRules: "=",
          fields: "=",
          profiles: "=",
        },
        controller: RulesListController,
        controllerAs: 'vm',
        bindToController: true,
      };
    });

  /** @ngInject */
  function RulesListController(RulesState, SaveRuleModal, $state, $rootScope, $timeout, $log, $scope, lodash) {
    /* jshint validthis: true */
    var vm = this;
    vm.operators = [
      {
        value: 'EQUAL',
        name: "equals",
      },
      {
        value: 'NOT',
        name: "does not equal",
      },
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

    var updateRulesInfo = function() {
      var exp, operator;

      angular.forEach(vm.arbitrationRules, function(rule) {
        operator = vm.operators[0];

        if (rule.expression && rule.expression.exp) {
          if (rule.expression.exp.NOT) {
            operator = vm.operators[1];
          }
          exp = rule.expression.exp[operator.value];
        } else {
          exp = null;
        }

        rule.operator = operator.name;
        if (exp) {
          rule.field = exp.field;
          rule.value = exp.value;
        }

        if (vm.profiles && vm.profiles.length > 0) {
          var profile = lodash.find(vm.profiles, function(nextProfile) {
            return nextProfile.id === rule.arbitration_profile_id;
          });
          if (profile) {
            rule.profileName = profile.name;
          }
        }
      });

      vm.arbitrationRules.sort(compareRules);
    };

    var convertToRuleObj = function(rule) {
      var ruleObj = {
        id: rule.id,
        priority: rule.priority,
        operation: rule.operation,
      };
      var fieldObj = {
        field: rule.field,
        value: rule.value,
      };

      var operator = lodash.find(vm.operators, function(nextOperator) {
        return nextOperator.name === rule.operator;
      });

      if (operator.value === "EQUAL") {
        ruleObj.expression = {
          EQUAL: fieldObj,
        };
      } else {
        ruleObj.expression = {
          NOT: fieldObj,
        };
      }
      var profile = lodash.find(vm.profiles, function(nextProfile) {
        return nextProfile.name === rule.profileName;
      });
      if (profile) {
        ruleObj.arbitration_profile_id =  profile.id;
      }

      return ruleObj;
    };

    var loadSuccess = function(arbitrationRules) {
      function editSuccess() {
        refreshRules();
      }

      function editFailure() {
      }

      $timeout(function() {  // Done in a timeout since results are massaged outside of a $digest
        vm.arbitrationRules = arbitrationRules.resources;
        updateRulesInfo();

        if (vm.updatePriorities === true && vm.arbitrationRules && vm.arbitrationRules.length > 0) {
          vm.arbitrationRules.sort(compareRules);
          angular.forEach(vm.arbitrationRules, function(rule, index) {
            rule.priority = index + 1;
          });
          vm.updatePriorities = false;
          var editRules = [];
          angular.forEach(vm.arbitrationRules, function(rule) {
            editRules.push(convertToRuleObj(rule));
          });
          RulesState.editRules(editRules).then(editSuccess, editFailure);
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

      angular.forEach(vm.arbitrationRules, function(rule, index) {
        rule.priority = index + 1;
      });

      function editSuccess() {
        refreshRules();
      }

      function editFailure() {
      }

      if (saveRules === true) {
        angular.forEach(vm.arbitrationRules, function(rule) {
          editRules.push(convertToRuleObj(rule));
        });
        RulesState.editRules(editRules).then(editSuccess, editFailure);
      }
    };

    var getNames = function(objects) {
      var names = [];

      if (objects && objects.length > 0) {
        angular.forEach(objects, function(nextObject) {
          names.push(nextObject.name);
        });
      }

      return names;
    };

    vm.title = __('Rules');
    vm.profileNames = getNames(vm.profiles);
    vm.operatorNames = getNames(vm.operators);
    vm.updatePriorities = false;
    vm.editMode = false;

    updateRulesInfo();

    var handleChangeStart = $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      var editedRule;

      if (toState.name === 'login' || vm.saveModalShown) {
        return;
      }

      if (fromState.name === "administration.rules" && toState.name !== "administration.rules" && vm.editMode) {
        editedRule = lodash.find(vm.arbitrationRules, function(rule) {
          return rule.editMode === true;
        });
        if (!editedRule && vm.arbitrationRules[0] && !vm.arbitrationRules[0].id) {
          editedRule = vm.arbitrationRules[0];
        }
        vm.saveModalShown = true;
        SaveRuleModal.showModal(save, doNotSave, cancel);
        event.preventDefault();
      }

      function save() {
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
        $state.go(toState, toParams);
      }

      function cancel() {
        vm.saveModalShown = false;
      }
    });

    vm.addRule = function() {
      var newRule = {
        operation: 'inject',
        operator: vm.operators[0].name,
        editMode: true,
      };

      vm.arbitrationRules.splice(0, 0, newRule);
      updateRulesPriorities(false);

      vm.editMode = true;
    };

    vm.editRule = function(rule) {
      rule.editMode = true;
      rule.original = {
        field: rule.field,
        operator: rule.operator,
        value: rule.value,
        arbitration_profile_id: rule.arbitration_profile_id,
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
        vm.arbitrationRules.splice(0, 1);
        updateRulesPriorities(false);
      } else {
        rule.field = rule.original.field;
        rule.operator = rule.original.operator;
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
        if (vm.arbitrationRules.length > 1) {
          angular.forEach(vm.arbitrationRules, function(nextRule, index) {
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
      var ruleIndex = -1;

      for (var i = 0; i < vm.arbitrationRules.length; i++) {
        if (vm.arbitrationRules[i] === vm.dragRule) {
          ruleIndex = i;
        }
      }

      if (ruleIndex >= 0) {
        vm.arbitrationRules.splice(ruleIndex, 1);
      }
    };

    vm.adjustPriorities = function(event) {
      updateRulesPriorities(true);
    };

    var moveRule = function(rule, delta) {
      var index = vm.arbitrationRules.indexOf(rule);
      var newPosition = index + delta;
      if (index >= 0 && newPosition >= 0 && newPosition < vm.arbitrationRules.length) {
        vm.arbitrationRules.splice(index, 1);
        vm.arbitrationRules.splice(newPosition, 0, rule);
        updateRulesPriorities(true);
      }
    };

    vm.downPriority = function(rule) {
      moveRule(rule, 1);
    };

    vm.upPriority = function(rule) {
      moveRule(rule, -1);
    };

    vm.dropCallback = function(event, ui, item, index) {
      $log.debug("Dropped " + item.value + " at index " + index);
    };
    vm.toolbarConfig = {
      actionsConfig: {
        actionsInclude: true,
      },
    };

    $scope.$on('destroy', handleChangeStart);
  }
})();
