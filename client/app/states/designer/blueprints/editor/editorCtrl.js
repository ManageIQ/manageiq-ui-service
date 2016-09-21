(function() {
  'use strict';

  angular.module('app.states')
    .controller('BlueprintEditorCtrl', ['$scope', '$timeout', 'BlueprintsState', 'DesignerState', 'BlueprintDetailsModal',
      'SaveBlueprintModal', '$state', 'Notifications', 'sprintf', ComponentController]);

  /** @ngInject */
  function ComponentController($scope, $timeout, BlueprintsState, DesignerState, BlueprintDetailsModal, SaveBlueprintModal, $state,
                               Notifications, sprintf) {
    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (toState.name === 'login') {
        return;
      }
      if (fromState.name === "designer.blueprints.editor" && toState.name !== "designer.blueprints.editor") {
        var origBlueprint = BlueprintsState.getOriginalBlueprint();
        if (!BlueprintsState.doNotSave() && !angular.equals(origBlueprint, $scope.blueprint) && !event.defaultPrevented) {
          SaveBlueprintModal.showModal($scope.blueprint, toState, toParams, fromState, fromParams);
          event.preventDefault();
        }
      }
    });

    $scope.blueprint = $scope.$parent.vm.blueprint;

    var blueprintDirty = false;

    if (!$scope.blueprint) {
      $scope.blueprint = angular.copy(newBlueprint());
    }

    BlueprintsState.saveOriginalBlueprint(angular.copy($scope.blueprint));

    // console.log("RETRIEVED Blueprint: " + angular.toJson($scope.blueprint, true));

    $scope.$watch("blueprint", function(oldValue, newValue) {
      if (!angular.equals(oldValue, newValue, true)) {
        blueprintDirty = true;
      }
    }, true);

    $scope.$on('BlueprintCanvasChanged', function(evt, args) {
      if (args.chartDataModel && !angular.equals($scope.blueprint.ui_properties.chart_data_model, args.chartDataMode)) {
        $scope.blueprint.ui_properties.chart_data_model = args.chartDataModel;
        blueprintDirty = true;
      }
    });

    $scope.blueprintUnchanged = function() {
      return !blueprintDirty;
    };

    function newBlueprint() {
      var blueprint = BlueprintsState.getNewBlueprintObj();
      blueprintDirty = true;

      return blueprint;
    }

    $scope.saveBlueprint = function() {
      BlueprintsState.saveBlueprint($scope.blueprint).then(saveSuccess, saveFailure);

      function saveSuccess(id) {
        Notifications.success(sprintf(__("'%s' was succesfully saved."), $scope.blueprint.name));
        if (id) {
          $state.go($state.current, {blueprintId: id}, {reload: true});
        }

        /*
         Saving in case we decide to not always reload; for performance

         get another copy to work, different obj from what was saved
         BlueprintsState.saveOriginalBlueprint(angular.copy($scope.blueprint));
         blueprintDirty = false;
         $( "#saveBtm" ).blur();
         console.log("Saved blueprint from designer"); */
      }

      function saveFailure() {
        Notifications.error(sprintf(__("Failed to save '%s'."), $scope.blueprint.name));
      }
    };

    $scope.editDetails = function() {
      $scope.loading = true;
      BlueprintDetailsModal.showModal('edit', $scope.blueprint).then(
        function() {
          $scope.loading = false;
        });
    };

    $scope.itemsSelected = function() {
      if ($scope.chartViewModel && $scope.chartViewModel.getSelectedNodes) {
        return $scope.chartViewModel.getSelectedNodes().length > 0;
      } else {
        return false;
      }
    };

    $scope.onlyOneTtemSelected = function() {
      if ($scope.chartViewModel && $scope.chartViewModel.getSelectedNodes) {
        return $scope.chartViewModel.getSelectedNodes().length === 1;
      } else {
        return false;
      }
    };

    $scope.duplicateSelectedItem = function() {
      $scope.$broadcast('duplicateSelectedItem');
      $("#duplicateItem").blur();
    };

    $scope.removeSelectedItemsFromCanvas = function() {
      $scope.$broadcast('removeSelectedItems');
      $("#removeItems").blur();
    };

    /*  Catalog Editor Toolbox Methods */

    $scope.toolboxVisible = false;

    $scope.showToolbox = function() {
      $scope.toolboxVisible = true;
      // add class to subtabs to apply PF style and
      // focus to filter input box

      $timeout(function() {
        $(".subtabs>ul").addClass('nav-tabs-pf');
        $("#filterFld").focus();
      });
    };

    $scope.hideToolbox = function() {
      $scope.toolboxVisible = false;
    };

    $scope.$on('clickOnChart', function(evt) {
      $scope.hideToolbox();
    });

    $scope.tabClicked = function() {
      $("#filterFld").focus();
    };

    $scope.inConnectingMode = false;
    $scope.hideConnectors = false;

    // broadcast hideConnectors change down to canvas
    $scope.toggleshowHideConnectors = function() {
      $scope.$broadcast('hideConnectors', {hideConnectors: $scope.hideConnectors});
    };

    // listen for in connecting mode from canvas
    $scope.$on('inConnectingMode', function(evt, args) {
      $scope.inConnectingMode = args.inConnectingMode;
      $scope.hideConnectors = false;
    });

    $scope.tabs = DesignerState.getDesignerToolboxTabs($scope.$parent.vm.serviceTemplates);

    $scope.getNewItem = function() {
      var activeTab = $scope.activeTab();
      var activeSubTab = $scope.activeSubTab();
      var activeSubSubTab = $scope.activeSubSubTab();

      if (activeSubSubTab && activeSubSubTab.newItem) {
        return activeSubSubTab.newItem;
      }

      if (activeSubTab && activeSubTab.newItem) {
        return activeSubTab.newItem;
      }

      if (activeTab && activeTab.newItem) {
        return activeTab.newItem;
      }

      return {name: 'New Item', image: 'images/service.png'};
    };

    $scope.activeTab = function() {
      return $scope.tabs.filter(function(tab) {
        return tab.active;
      })[0];
    };

    $scope.activeSubTab = function() {
      var activeTab = $scope.activeTab();
      if (activeTab && activeTab.subtabs) {
        return activeTab.subtabs.filter(function(subtab) {
          return subtab.active;
        })[0];
      }
    };

    $scope.activeSubSubTab = function() {
      var activeSubTab = $scope.activeSubTab();
      if (activeSubTab && activeSubTab.subtabs) {
        return activeSubTab.subtabs.filter(function(subsubtab) {
          return subsubtab.active;
        })[0];
      }
    };
  }
})();
