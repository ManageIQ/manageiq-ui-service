/* eslint camelcase: "off" */
(function() {
  'use strict';

  angular.module('app.components')
      .directive('blueprintEditor', function() {
        return {
          restrict: 'AE',
          templateUrl: "app/components/blueprints/blueprint-editor/blueprint-editor.html",
          scope: {
            blueprint: '=',
            serviceTemplates: "=",
          },
          controller: BlueprintEditorController,
          controllerAs: 'vm',
          bindToController: true,
        };
      });

  /** @ngInject */
  function BlueprintEditorController($scope, $timeout, BlueprintsState, DesignerState, BlueprintDetailsModal, SaveBlueprintModal, $state,
                                     EventNotifications, sprintf) {
    var vm = this;

    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (toState.name === 'login') {
        return;
      }
      if ((fromState.name === "designer.blueprints.editor" || fromState.name === "") && toState.name !== "designer.blueprints.editor") {
        var origBlueprint = BlueprintsState.getOriginalBlueprint();
        if (!BlueprintsState.doNotSave() && !angular.equals(origBlueprint, vm.blueprint) && !event.defaultPrevented) {
          SaveBlueprintModal.showModal(vm.blueprint, toState, toParams, fromState, fromParams);
          event.preventDefault();
        }
      }
    });

    var blueprintDirty = false;

    vm.blueprint.read_only = vm.blueprint.status === 'published';

    BlueprintsState.saveOriginalBlueprint(angular.copy(vm.blueprint));

    // if new blueprint, focus on name field
    if (vm.blueprint.name.length === 0) {
      angular.element("#blueprintName").focus();
    }

    $scope.$watch("vm.blueprint", function(oldValue, newValue) {
      if (!angular.equals(oldValue, newValue, true)) {
        blueprintDirty = true;
      }
    }, true);

    vm.canSave = function() {
      return vm.blueprint.name.length !== 0 && blueprintDirty;
    };

    vm.saveBlueprint = function() {
      BlueprintsState.saveBlueprint(vm.blueprint).then(saveSuccess, saveFailure);

      function saveSuccess(id) {
        EventNotifications.success(sprintf(__("'%s' was succesfully saved."), vm.blueprint.name));
        if (id) {
          $state.go($state.current, {blueprintId: id}, {reload: true});
        }
      }

      function saveFailure() {
        EventNotifications.error(sprintf(__("Failed to save '%s'."), vm.blueprint.name));
      }
    };

    vm.editDetails = function() {
      vm.loading = true;
      BlueprintDetailsModal.showModal('edit', vm.blueprint).then(
          function() {
            vm.loading = false;
          });
    };

    vm.itemsSelected = function() {
      if (vm.chartViewModel && vm.chartViewModel.getSelectedNodes) {
        return vm.chartViewModel.getSelectedNodes().length > 0;
      } else {
        return false;
      }
    };

    vm.onlyOneTtemSelected = function() {
      if (vm.chartViewModel && vm.chartViewModel.getSelectedNodes) {
        return vm.chartViewModel.getSelectedNodes().length === 1;
      } else {
        return false;
      }
    };

    vm.duplicateSelectedItem = function() {
      $scope.$broadcast('duplicateSelectedItem');
      angular.element("#duplicateItem").blur();
    };

    vm.removeSelectedItemsFromCanvas = function() {
      $scope.$broadcast('removeSelectedItems');
      angular.element("#removeItems").blur();
    };

    /*  Catalog Editor Toolbox Methods */

    vm.toolboxVisible = false;

    vm.showToolbox = function() {
      vm.toolboxVisible = true;
      // add class to subtabs to apply PF style and
      // focus to filter input box

      $timeout(function() {
        angular.element(".subtabs>ul").addClass('nav-tabs-pf');
        angular.element("#filterFld").focus();
      });
    };

    vm.hideToolbox = function() {
      vm.toolboxVisible = false;
    };

    vm.toggleToolbox = function() {
      if (vm.toolboxVisible === true) {
        vm.hideToolbox();
      } else {
        vm.showToolbox();
      }
    };

    $scope.$on('clickOnChart', function(evt) {
      vm.hideToolbox();
    });

    vm.tabClicked = function() {
      angular.element("#filterFld").focus();
    };

    vm.inConnectingMode = false;
    vm.hideConnectors = false;

    // broadcast hideConnectors change down to canvas
    vm.toggleshowHideConnectors = function() {
      $scope.$broadcast('hideConnectors', {hideConnectors: vm.hideConnectors});
    };

    // listen for in connecting mode from canvas
    $scope.$on('inConnectingMode', function(evt, args) {
      vm.inConnectingMode = args.inConnectingMode;
      vm.hideConnectors = false;
    });

    vm.draggedItem = null;
    vm.startCallback = function(event, ui, item) {
      vm.draggedItem = item;
    };

    vm.addNodeByClick = function(item) {
      var newNode = BlueprintsState.prepareNodeForCanvas(item);
      $scope.$broadcast('addNodeToCanvas', {newNode: newNode});
    };

    vm.tabs = DesignerState.getDesignerToolboxTabs(vm.serviceTemplates);

    vm.getNewItem = function() {
      var activeTab = vm.activeTab();
      var activeSubTab = vm.activeSubTab();
      var activeSubSubTab = vm.activeSubSubTab();

      if (activeSubSubTab && activeSubSubTab.newItem) {
        return activeSubSubTab.newItem;
      }

      if (activeSubTab && activeSubTab.newItem) {
        return activeSubTab.newItem;
      }

      if (activeTab && activeTab.newItem) {
        return activeTab.newItem;
      }

      return null;
    };

    vm.activeTab = function() {
      return vm.tabs.filter(function(tab) {
        return tab.active;
      })[0];
    };

    vm.activeSubTab = function() {
      var activeTab = vm.activeTab();
      if (activeTab && activeTab.subtabs) {
        return activeTab.subtabs.filter(function(subtab) {
          return subtab.active;
        })[0];
      }
    };

    vm.activeSubSubTab = function() {
      var activeSubTab = vm.activeSubTab();
      if (activeSubTab && activeSubTab.subtabs) {
        return activeSubTab.subtabs.filter(function(subsubtab) {
          return subsubtab.active;
        })[0];
      }
    };

    //
    // Zoom
    //
    vm.maxZoom = function() {
      return (vm.chartViewModel && vm.chartViewModel.zoom) ? vm.chartViewModel.zoom.isMax() : false;
    };

    vm.minZoom = function() {
      return (vm.chartViewModel && vm.chartViewModel.zoom) ? vm.chartViewModel.zoom.isMin() : false;
    };

    vm.zoomIn = function() {
      $scope.$broadcast('zoomIn');
    };

    vm.zoomOut = function() {
      $scope.$broadcast('zoomOut');
    };
  }
})();
