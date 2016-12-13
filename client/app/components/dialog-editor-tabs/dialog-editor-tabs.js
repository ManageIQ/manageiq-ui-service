/* eslint camelcase: ["error", {properties: "never"}] */

(function() {
  'use strict';

  angular.module('app.components')
    .component('dialogEditorTabs', {
      controller: ComponentController,
      controllerAs: 'vm',
      templateUrl: 'app/components/dialog-editor-tabs/dialog-editor-tabs.html',
    });

  function ComponentController(DialogEditor, lodash, DialogEditorModal) {
    var vm = this;

    /**
     * After loading component data, activate first tab if there is any
     */
    vm.$onInit = function() {
      // load data from service
      vm.tabList = DialogEditor.getDialogTabs();

      // set active tab
      if (vm.tabList.length !== 0) {
        DialogEditor.activeTab = 0;
        vm.tabList[0].active = true;
      }
    };

    /**
     * Show modal to edit Dialog details
     */
    vm.editDialogModal = function(tab) {
      DialogEditorModal.showModal(tab);
    };

    /**
     * Add a new tab to tab list.
     * New tab automaticaly does have last position in list and is set
     * as active
     */
    vm.addTab = function() {
      // make sure all current tabs are deactivated
      vm.tabList.forEach(function(tab) {
        tab.active = false;
      });

      // create a new tab
      var nextIndex = vm.tabList.length;
      vm.tabList.push({
        description: __('New tab ') + nextIndex,
        display: "edit",
        label: __('New tab ') + nextIndex,
        position: nextIndex,
        active: true,
        dialog_groups: [],
      });

      // set activity for a new tab
      DialogEditor.activeTab = nextIndex;
    };

    /**
     * Delete tab by its position.
     * After removing tab, position attributes of tabs needs to be
     * updated.
     * If tab is active in the moment of deletion, activity goes to
     * first tab
     *
     * Parameter: id -- index of tab to remove
     */
    vm.deleteTab = function(id) {
      // if the deleted tab is active, pass the activity first
      if (vm.tabList[id].active) {
        if ((vm.tabList.length - 1) === vm.tabList[id].position
         && (vm.tabList.length - 1) !== 0) {
          // active was at the end -> new active is on previous index
          vm.tabList[id - 1].active = true;
        } else if ((vm.tabList.length - 1) > vm.tabList[id].position) {
          // active tab has a following tab -> new active is on next index
          vm.tabList[id + 1].active = true;
        }
      }

      // remove tab with matching id
      lodash.remove(vm.tabList, function(tab) {
        return tab.position === id;
      });

      if (vm.tabList.length === 0) {
        return;
      } else {
        // reload indexes for tabs
        DialogEditor.updatePositions(vm.tabList);
      }

      var activeTabData = lodash.find(vm.tabList, {active: true});
      if (angular.isDefined(activeTabData)) {
        DialogEditor.activeTab = activeTabData.position;
      }
    };

    /**
     * Select active tab by parameter representing index
     *
     * Parameter: id -- index of tab to set as active
     */
    vm.selectTab = function(id) {
      var deselectedTab = lodash.find(vm.tabList, {active: true});
      deselectedTab.active = false;

      var selectedTab = vm.tabList[id];
      selectedTab.active = true;

      DialogEditor.activeTab = id;
    };

    vm.sortableOptions = {
      cancel: '.nosort',
      cursor: 'move',
      helper: 'clone',
      revert: 50,
      stop: function(e, ui) {
        var sortedTab = ui.item.scope();
        var tabList = sortedTab.$parent.dialogEditorTabs.tabList;

        DialogEditor.updatePositions(tabList);
        DialogEditor.activeTab = lodash.find(tabList, {active: true}).position;
      },
    };
  }
})();
