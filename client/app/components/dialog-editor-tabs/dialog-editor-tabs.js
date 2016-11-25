/* eslint camelcase: ["error", {properties: "never"}] */

(function() {
  'use strict';

  angular.module('app.components')
    .component('dialogEditorTabs', {
      controller: function(DialogEditor, lodash, DialogEditorModal) {
        /**
         * After loading component data, activate first tab if there is any
         */
        this.$onInit = function() {
          // load data from service
          this.tabList = DialogEditor.getData().content[0].dialog_tabs;

          // set active tab
          if (this.tabList.length !== 0) {
            DialogEditor.activeTab = 0;
            this.tabList[0].active = true;
          }
        };

        this.editDialogModal = function(tab) {
          DialogEditorModal.showModal(tab);
        };

        /**
         * Add a new tab to tab list.
         * New tab automaticaly does have last position in list and is set
         * as active
         */
        this.addTab = function() {
          // make sure all current tabs are deactivated
          this.tabList.forEach(function(tab) {
            tab.active = false;
          });

          // create a new tab
          var nextIndex = this.tabList.length;
          this.tabList.push({
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
        this.deleteTab = function(id) {
          // if active, deactivate first
          if (this.tabList[id].active) {
            if ((this.tabList.length - 1) === this.tabList[id].position
             && (this.tabList.length - 1) !== 0) {
              // active was last -> new active is on previous index
              this.tabList[id - 1].active = true;
            } else if (this.tabList[id].position < (this.tabList.length - 1)) {
              // active was has following tab -> new active is on next index
              this.tabList[id + 1].active = true;
            }
          }

          // remove tab with matching id
          lodash.remove(this.tabList, function(tab) {
            return tab.position === id;
          });

          DialogEditor.updatePositions(this.tabList);
          var activeTabData = lodash.find(this.tabList, {active: true});
          if (angular.isUndefined(activeTabData)) {
            DialogEditor.activeTab = activeTabData.position;
          }
        };

        /**
         * Select active tab by parameter representing index
         *
         * Parameter: id -- index of tab to set as active
         */
        this.selectTab = function(id) {
          var deselectedTab = lodash.find(this.tabList, {active: true});
          deselectedTab.active = false;

          var selectedTab = this.tabList[id];
          selectedTab.active = true;

          DialogEditor.activeTab = id;
        };

        this.sortableOptions = {
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
      },
      controllerAs: 'dialogEditorTabs',
      templateUrl: 'app/components/dialog-editor-tabs/dialog-editor-tabs.html',
    });
})();
