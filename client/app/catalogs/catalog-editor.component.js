/* eslint camelcase: "off" */
import templateUrl from './catalog-editor.html';

export const CatalogEditorComponent = {
  templateUrl,
  bindings: {
    catalog: "<",
    serviceTemplates: "<",
    stateName: "@",
  },
  controller: ComponentController,
  controllerAs: 'vm',
};

/** @ngInject */
function ComponentController(CatalogsState, $scope, $state, SaveModalDialog, lodash) {
  var vm = this;
  var listState = 'catalogs';
  var watchers = [];

  vm.$onInit = function() {
    var selectedServiceTemplates = [];
    var availableServiceTemplates = [];
    var name = '';
    var description = '';

    if (vm.catalog) {
      CatalogsState.setCatalogServiceTemplates(vm.catalog, vm.serviceTemplates);
      sortTemplates(vm.catalog.serviceTemplates);

      angular.forEach(vm.catalog.serviceTemplates, function(nextTemplate) {
        selectedServiceTemplates.push(nextTemplate);
      });
      sortTemplates(selectedServiceTemplates);

      name = vm.catalog.name;
      description = vm.catalog.description;
    }

    // Determine the available service templates
    angular.forEach(vm.serviceTemplates, function(nextItem) {
      if (!nextItem.service_template_catalog_id) {
        availableServiceTemplates.push(nextItem);
      }
    });

    angular.extend(vm,
      {
        editInfo: {
          name: name,
          description: description,
          selectedServiceTemplates: selectedServiceTemplates,
          availableServiceTemplates: availableServiceTemplates,
        },
        catalogValid: false,
        sortTemplates: sortTemplates,
        handleSave: handleSave,
        handleCancel: handleCancel,
        updateSelections: updateSelections,
        saveCatalog: saveCatalog,
      }
    );

    watchers.push($scope.$on('$stateChangeStart', onChangeState));

    updateSelections();
  };

  vm.$onDestroy = function() {
    angular.forEach(watchers, function(watcher) {
      if (angular.isFunction(watcher)) {
        watcher();
      }
    });
  };

  function arrayCompare(array1, array2) {
    return (array1.length === array2.length) && (lodash.intersection(array1, array2).length === array1.length);
  }

  function catalogFieldsChanged() {
    return !vm.catalog || vm.catalog.name !== vm.editInfo.name || vm.catalog.description !== vm.editInfo.description;
  }

  function updateSelections() {
    vm.dirty = false;
    if (vm.catalog) {
      vm.dirty = vm.dirty || catalogFieldsChanged();
      vm.dirty = vm.dirty || !arrayCompare(vm.catalog.serviceTemplates, vm.editInfo.selectedServiceTemplates);
    } else {
      vm.dirty = vm.dirty || vm.editInfo.name;
      vm.dirty = vm.dirty || vm.editInfo.description;
      vm.dirty = vm.dirty || vm.editInfo.selectedServiceTemplates.length > 0;
    }

    vm.nameValid = vm.editInfo.name && vm.editInfo.name.length > 0;
    vm.descriptionValid = vm.editInfo.description && vm.editInfo.description.length > 0;

    vm.catalogValid = vm.nameValid && vm.descriptionValid;
  }

  function getCatalogObject() {
    var catalogObject = {};

    if (vm.catalog) {
      catalogObject.id = vm.catalog.id;
    }

    catalogObject.name = vm.editInfo.name;
    catalogObject.description = vm.editInfo.description;

    return catalogObject;
  }

  function getNewServiceTemplates() {
    var newTemplates = [];

    angular.forEach(vm.editInfo.selectedServiceTemplates, function(nextItem) {
      if (!vm.catalog || vm.catalog.serviceTemplates.indexOf(nextItem) === -1) {
        newTemplates.push(
          {
            href: nextItem.href,
          }
        );
      }
    });

    return newTemplates;
  }

  function getRemovedServiceTemplates() {
    var removedTemplates = [];

    if (vm.catalog) {
      angular.forEach(vm.catalog.serviceTemplates, function (nextItem) {
        if (vm.catalog && vm.editInfo.selectedServiceTemplates.indexOf(nextItem) === -1) {
          removedTemplates.push(
            {
              href: nextItem.href,
            }
          );
        }
      });
    }

    return removedTemplates;
  }

  function navigateAway(saveFirst, toState, toParams) {
    var addTemplates, catalogId, removeTemplates;

    // If toState is not passed, go to the default state (list)
    if (!toState) {
      toState = listState;
    }

    function doNavigate() {
      $state.go(toState, toParams);
    }

    function addSuccess(response) {
      if (!response || !response.error) {
        if (removeTemplates && removeTemplates.length > 0) {
          CatalogsState.removeServiceTemplates(catalogId, removeTemplates).then(removeSuccess, removeFailure);
        } else {
          vm.dirty = false;
          doNavigate();
        }
      }
    }

    function addFailure() {
      // Remain on the edit page if the save failed
    }

    function removeSuccess(response) {
      if (!response || !response.error) {
        vm.dirty = false;
        doNavigate();
      }
    }

    function removeFailure() {
      // Remain on the edit page if the save failed
    }

    function saveSuccess(response) {
      if (!response || !response.error) {
        if (!vm.catalog) {
          catalogId = response.id;
        }
        if (addTemplates && addTemplates.length > 0) {
          CatalogsState.addServiceTemplates(catalogId, addTemplates).then(addSuccess, addFailure);
        } else if (removeTemplates && removeTemplates.length > 0) {
          CatalogsState.removeServiceTemplates(catalogId, removeTemplates).then(removeSuccess, removeFailure);
        } else {
          vm.dirty = false;
          doNavigate();
        }
      }
    }

    function saveFailure() {
      // Remain on the edit page if the save failed
    }

    if (saveFirst) {
      var catalogObject = getCatalogObject();
      addTemplates = getNewServiceTemplates();
      removeTemplates = getRemovedServiceTemplates();

      if (vm.catalog) {
        catalogId = vm.catalog.id;
      }

      if (catalogFieldsChanged()) {
        if (vm.catalog) {
          CatalogsState.editCatalog(catalogObject).then(saveSuccess, saveFailure);
        } else {
          CatalogsState.addCatalog(catalogObject).then(saveSuccess, saveFailure);
        }
      } else if (addTemplates && addTemplates.length > 0) {
        CatalogsState.addServiceTemplates(catalogId, addTemplates).then(addSuccess, addFailure);
      } else if (removeTemplates && removeTemplates.length > 0) {
        CatalogsState.removeServiceTemplates(catalogId, removeTemplates).then(removeSuccess, removeFailure);
      } else {
        vm.dirty = false;
        doNavigate();
      }
    } else {
      doNavigate();
    }
  }

  function saveCatalog(toState, toParams) {
    navigateAway(true, toState, toParams);
  }

  function handleSave() {
    saveCatalog();
  }

  function handleCancel() {
    navigateAway(false);
  }

  function sortTemplates(items) {
    items.sort(function(item1, item2) {
      return item1.name.localeCompare(item2.name);
    });
  }

  function onChangeState(event, state, params) {
    if (state.name !== 'login' && state.name !== vm.stateName && vm.dirty && !vm.savingCatalog) {
      vm.savingCatalog = true;
      SaveModalDialog.showModal(onSaveDialogSave, onSaveDialogDoNotSave, onSaveDialogCancel, vm.catalogValid);
      event.preventDefault();
    }

    function onSaveDialogSave() {
      vm.savingCatalog = false;
      vm.saveCatalog(state, params);
    }

    function onSaveDialogDoNotSave() {
      vm.savingCatalog = false;
      vm.dirty = false;
      $state.go(state, params);
    }

    function onSaveDialogCancel() {
      vm.savingCatalog = false;
    }
  }
}
