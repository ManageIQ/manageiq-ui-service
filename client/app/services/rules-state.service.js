(function() {
  'use strict';

  angular.module('app.services')
      .factory('RulesState', RulesStateFactory);

  /** @ngInject */
  function RulesStateFactory(CollectionsApi, Notifications, $state, sprintf, $q, $timeout) {
    var ruleState = {};

    ruleState.editRule = null;

    ruleState.handleEdit = function(ruleObj) {
      ruleState.editRule = ruleObj;
    };

    ruleState.getRules = function() {
      var options = {
        expand: 'resources',
      };

      return CollectionsApi.query('arbitration_rules', options);
    };

    ruleState.getProfiles = function() {
      var options = {
        expand: 'resources',
      };

      return CollectionsApi.query('arbitration_profiles', options);
    };

    ruleState.getRuleFields = function() {
      var options = {
        expand: 'resources',
      };

      // TODO: Get liest of fields from an API call
      return $timeout(function() {
        return {resources: [
          "name",
          "description",
          "ems_id",
          "flavor_id",
          "cloud_network_id",
          "cloud_subnet_id",
          "security_group_id",
          "authentication_id",
          "availability_zone_id",
        ]};
      });
    };

    ruleState.getProfiles = function() {
      var options = {
        expand: 'resources',
      };

      return CollectionsApi.query('arbitration_profiles', options);
    };

    ruleState.addRule = function(ruleObj) {
      var deferred = $q.defer();

      CollectionsApi.post('arbitration_rules', null, {}, ruleObj).then(createSuccess, createFailure);

      function createSuccess(response) {
        Notifications.success(__(sprintf("The rule was created.")));
        deferred.resolve(response.results[0].id);
      }

      function createFailure() {
        Notifications.error(__('There was an error creating this rule.'));
        deferred.reject();
      }

      return deferred.promise;
    };

    ruleState.editRules = function(rules) {
      var deferred = $q.defer();

      var editSuccess = function(response) {
        deferred.resolve(response.id);
      };

      var editFailure = function() {
        Notifications.error(__('There was an error updating the rules.'));
        deferred.reject();
      };

      if (rules && rules.length > 0) {
        var editRules = [];
        angular.forEach(rules, function(nextRule) {
          var tmpRule = {
            id: nextRule.id,
            priority: nextRule.priority,
            operation: nextRule.operation,
            expression: nextRule.expression.exp,
            arbitration_profile_id: nextRule.arbitration_profile_id,
          };
          editRules.push(tmpRule);
        });

        var editObj = {
          "action": "edit",
          "resources": editRules,
        };

        CollectionsApi.post('arbitration_rules', null, {}, editObj).then(editSuccess, editFailure);

        return deferred.promise;
      }
    };

    ruleState.deleteRules = function(rules) {
      var deferred = $q.defer();

      var resources = [];
      for (var i = 0; i < rules.length; i++) {
        resources.push({"id": rules[i].id});
      }

      var ruleObj = {
        "action": "delete",
        "resources": resources,
      };

      CollectionsApi.post('arbitration_rules', null, {}, ruleObj).then(deleteSuccess, deleteFailure);

      function deleteSuccess() {
        Notifications.success(__('Rule(s) were succesfully deleted.'));
        deferred.resolve();
      }

      function deleteFailure() {
        Notifications.error(__('There was an error deleting the rule(s).'));
        deferred.reject();
      }

      return deferred.promise;
    };

    ruleState.getNewRuleObj = function() {
      var ruleObj = {
        priority: 0,
        operation: 'inject',
        expression: {
          EQUAL: {
          },
        },
      };

      return ruleObj;
    };

    return ruleState;
  }
})();
