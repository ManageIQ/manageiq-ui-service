/* eslint camelcase: "off" */
(function() {
  'use strict';

  angular.module('app.components')
    .component('dualPaneSelector', {
      templateUrl: "app/components/dual-pane-selector/dual-pane-selector.html",
      bindings: {
        availableItems: "=",
        selectedItems: "=",
        availableTitle: "@",
        selectedTitle: "@",
        sortFn: '<',
        onChangeFn: '<',
      },
      controller: DualPaneSelectorController,
      controllerAs: 'vm',
      replace: true,
      transclude: {
        available: '?available',
        selected: '?selected',
      },
    });

  /** @ngInject */
  function DualPaneSelectorController(sprintf) {
    var vm = this;

    vm.$onInit = function() {
      angular.extend(vm,
        {
          selectedAvailableItems: [],
          selectedSelectedItems: [],
          availableCountText: '',
          selectedCountText: '',
          isAvailableItemSelected: isAvailableItemSelected,
          isSelectedItemSelected: isSelectedItemSelected,
          availableItemClick: availableItemClick,
          availableItemDoubleClick: availableItemDoubleClick,
          selectedItemClick: selectedItemClick,
          selectedItemDoubleClick: selectedItemDoubleClick,
          selectItems: selectItems,
          unSelectItems: unSelectItems,
        }
      );
      vm.sortFn(vm.availableItems);
      vm.sortFn(vm.selectedItems);

      updateCountTexts();
    };

    function updateCountTexts() {
      vm.availableCountText = sprintf(__("%d of %d items selected"),
                                      vm.selectedAvailableItems.length,
                                      vm.availableItems.length);
      vm.selectedCountText = sprintf(__("%d of %d items selected"),
                                     vm.selectedSelectedItems.length,
                                     vm.selectedItems.length);
    }

    function handleListChange() {
      updateCountTexts();
      if (angular.isFunction(vm.onChangeFn)) {
        vm.onChangeFn();
      }
    }

    function isAvailableItemSelected(item) {
      return vm.selectedAvailableItems.indexOf(item) !== -1;
    }

    function isSelectedItemSelected(item) {
      return vm.selectedSelectedItems.indexOf(item) !== -1;
    }

    function toggleItemSelection(item, selectionList) {
      var index = selectionList.indexOf(item);
      if (index === -1) {
        selectionList.push(item);
      } else {
        selectionList.splice(index, 1);
      }
      updateCountTexts();
    }

    function moveItem(item, fromList, toList, selectionList) {
      var index = fromList.indexOf(item);
      if (index !== -1) {
        fromList.splice(index, 1);
        toList.push(item);
        vm.sortFn(toList);

        index = selectionList.indexOf(item);
        if (index !== -1) {
          selectionList.splice(index, 1);
        }
      }
      handleListChange();
    }

    function moveSelections(selectionList, fromList, toList) {
      angular.forEach(selectionList, function(nextItem) {
        toList.push(nextItem);
        fromList.splice(fromList.indexOf(nextItem), 1);
      });
      vm.sortFn(fromList);
      vm.sortFn(toList);

      selectionList.splice(0, selectionList.length);

      handleListChange();
    }

    function availableItemClick(item) {
      toggleItemSelection(item, vm.selectedAvailableItems);
    }

    function availableItemDoubleClick(item) {
      moveItem(item, vm.availableItems, vm.selectedItems, vm.selectedAvailableItems);
    }

    function selectedItemClick(item) {
      toggleItemSelection(item, vm.selectedSelectedItems);
    }

    function selectedItemDoubleClick(item) {
      moveItem(item, vm.selectedItems, vm.availableItems, vm.selectedSelectedItems);
    }

    function selectItems() {
      moveSelections(vm.selectedAvailableItems, vm.availableItems, vm.selectedItems);
    }

    function unSelectItems() {
      moveSelections(vm.selectedSelectedItems, vm.selectedItems, vm.availableItems);
    }
  }
})();

