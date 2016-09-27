/* eslint camelcase: "off" */
(function() {
  'use strict';

  angular.module('app.services')
      .factory('RulesState', RulesStateFactory);

  /** @ngInject */
  function RulesStateFactory(CollectionsApi, EventNotifications, $q, $timeout) {
    var ruleState = {};

    ruleState.getRules = function() {
      var options = {
        expand: 'resources',
      };

      return CollectionsApi.query('arbitration_rules', options);
    };

    ruleState.getRuleFields = function() {
      // TODO: Get liest of fields from an API call
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
    };

    ruleState.addRule = function(ruleObj) {
      function createSuccess() {
        EventNotifications.success(__("The rule was created."));
      }

      function createFailure() {
        EventNotifications.error(__('There was an error creating this rule.'));
      }

      return CollectionsApi.post('arbitration_rules', null, {}, ruleObj).then(createSuccess, createFailure);
    };

    ruleState.editRules = function(rules) {
      var editSuccess = function(response) {
      };

      var editFailure = function() {
        EventNotifications.error(__('There was an error updating the rules.'));
      };

      var editObj = {
        "action": "edit",
        "resources": rules,
      };

      return CollectionsApi.post('arbitration_rules', null, {}, editObj).then(editSuccess, editFailure);
    };

    ruleState.deleteRules = function(ruleIds) {
      var resources = [];
      for (var i = 0; i < ruleIds.length; i++) {
        resources.push({"id": ruleIds[i]});
      }

      var ruleObj = {
        "action": "delete",
        "resources": resources,
      };

      return CollectionsApi.post('arbitration_rules', null, {}, ruleObj).then(deleteSuccess, deleteFailure);

      function deleteSuccess() {
        EventNotifications.success(__('Rule(s) were succesfully deleted.'));
      }

      function deleteFailure() {
        EventNotifications.error(__('There was an error deleting the rule(s).'));
      }
    };

    return ruleState;
  }
})();
