describe('BlueprintDetailsModal', function() {
  var controller;
  var blueprint;
  var serviceCatalogs;
  var serviceDialogs;
  var tenants;
  var notificationsErrorSpy;
  var notificationsSuccessSpy;
  var modalInstance = { close: function() {}, dismiss: function() {} };
  var mockDir = 'tests/mock/blueprint-details/';

  beforeEach(function () {
    module('app.components', 'app.config', 'app.resources', 'ui.bootstrap', 'gettext');
  });

  beforeEach(function () {
    bard.inject('$rootScope', '$state', '$httpBackend', 'BlueprintDetailsModal', 'BlueprintsState', 'BlueprintOrderListService',
        'BrowseEntryPointModal', 'CreateCatalogModal', 'sprintf', 'EventNotifications', 'CollectionsApi', '$document', '$controller');

    serviceCatalogs = readJSON(mockDir + 'service-catalogs.json');
    serviceDialogs = readJSON(mockDir + 'service-dialogs.json');
    tenants = readJSON(mockDir + 'tenants.json');

    notificationsSuccessSpy = sinon.stub(EventNotifications, 'success').returns(null);
    notificationsErrorSpy = sinon.stub(EventNotifications, 'error').returns(null);
  });

  describe('Edit Blueprint Details', function () {

    beforeEach(function () {
      $rootScope.blueprint = readJSON(mockDir + 'blueprint.json');

      controller = $controller(BlueprintDetailsModal.BlueprintDetailsModalController, {
        action: 'edit',
        blueprint: $rootScope.blueprint,
        BlueprintsState: BlueprintsState,
        BlueprintOrderListService: BlueprintOrderListService,
        serviceCatalogs: serviceCatalogs,
        serviceDialogs: serviceDialogs,
        tenants: tenants,
        $state: $state,
        BrowseEntryPointModal: BrowseEntryPointModal,
        CreateCatalogModal: CreateCatalogModal,
        $uibModalInstance: modalInstance,
        EventNotifications: EventNotifications,
        sprintf: sprintf,
        $scope: $rootScope
      });
    });

    it('controller is created successfully', function () {
      expect(controller).to.be.defined;
    });

    it('should show the correct dialog title', function () {
      expect(controller.modalTitle).to.eq('Edit Blueprint Details');
    });

    it('should show General tab as active in edit mode', function () {
      expect(controller.tabs[0].title).to.eq('General');
      expect(controller.tabs[0].active).to.eq(true);
    });

    it('should show the correct General tab field values', function () {
      var modalData = controller.modalData.resource;
      expect(modalData.name).to.eq('Blueprint One');
      expect(modalData.description).to.eq('desc');
      expect(modalData.visibility.name).to.eq('Public');
      expect(controller.tagsOfItem.length).to.eq(2);
      expect(controller.tagsOfItem[0].name).to.eq('/managed/location/chicago');
      expect(controller.tagsOfItem[1].name).to.eq('/managed/service_level/gold');
      // adding new tags will be covered in the <tagging-widget> spec.
    });

    it('should show the correct Publish tab field values', function () {
      expect(controller.tabs[1].title).to.eq('Publish');
      var modalData = controller.modalData.resource;
      expect(modalData.catalog.name).to.eq('VMware Operations');
      expect(modalData.dialog.description).to.eq('OSE Installer');
      expect(modalData.provEP).to.eq('Service/Provisioning/StateMachines/ServiceProvision_Template/default');
      expect(modalData.reConfigEP).to.eq('/Grandchild 1');
    });

    it('should show the Provision and Action Order tabs', function () {
      // the 'order' functionality will be covered in the <order-list> directive spec.
      expect(controller.tabs[2].title).to.eq('Provision Order');
      expect(controller.tabs[3].title).to.eq('Action Order');
    });

    it('should show the Save button and not require catalog or dialog selected in edit mode', function () {
      expect(controller.modalBtnPrimaryLabel).to.eq('Save');
      expect(controller.isCatalogRequired()).to.eq(false);
      expect(controller.isDialogRequired()).to.eq(false);
    });

    it('should save all dialog values and update the blueprint', function () {
      var blueprint = controller.blueprint;
      var ui_properties = blueprint.ui_properties;
      var automate_entrypoints = ui_properties.automate_entrypoints;
      // modalData is what is bound to the html form fields
      var modalData = controller.modalData.resource;

      // change some modal form values
      modalData.name = "Updated Blueprint";
      modalData.description = "Updated desc";
      controller.tagsOfItem.splice(0,1);

      controller.saveBlueprintDetails();

      expect(blueprint.name).to.eq('Updated Blueprint');
      expect(blueprint.description).to.eq('Updated desc');
      expect(blueprint.tags.length).to.eq(1);
      expect(blueprint.tags[0].name).to.eq('/managed/service_level/gold');

      expect(ui_properties.visibility.name).to.eq('Public');
      expect(ui_properties.service_catalog.id).to.eq(10000000000005);
      expect(ui_properties.service_dialog.id).to.eq(10000000000002);

      expect(automate_entrypoints.Provision).to.eq('Service/Provisioning/StateMachines/ServiceProvision_Template/default');
      expect(automate_entrypoints.Reconfigure).to.eq('/Grandchild 1');
      expect(automate_entrypoints.Retirement).to.eq(null);
    });
  });

  describe('Publish Blueprint', function () {

    beforeEach(function () {
      $rootScope.blueprint = readJSON(mockDir + 'unpublished-blueprint.json');

      controller = $controller(BlueprintDetailsModal.BlueprintDetailsModalController, {
        action: 'publish',
        blueprint: $rootScope.blueprint,
        BlueprintsState: BlueprintsState,
        BlueprintOrderListService: BlueprintOrderListService,
        serviceCatalogs: serviceCatalogs,
        serviceDialogs: serviceDialogs,
        tenants: tenants,
        $state: $state,
        BrowseEntryPointModal: BrowseEntryPointModal,
        CreateCatalogModal: CreateCatalogModal,
        $uibModalInstance: modalInstance,
        EventNotifications: EventNotifications,
        sprintf: sprintf,
        $scope: $rootScope
      });
    });

    it('controller is created successfully', function () {
      expect(controller).to.be.defined;
    });

    it('should show the correct dialog title', function () {
      expect(controller.modalTitle).to.eq('Publish Blueprint One');
    });

    it('should show Publish tab as active in publish mode', function () {
      expect(controller.tabs[1].title).to.eq('Publish');
      expect(controller.tabs[1].active).to.eq(true);
    });

    it('should show the Publish button and require catalog or dialog selected in publish mode', function () {
      expect(controller.modalBtnPrimaryLabel).to.eq('Publish');
      expect(controller.isCatalogRequired()).to.eq(true);
      expect(controller.isDialogRequired()).to.eq(true);
    });

    it('should initialize and reset blueprint values correctly', function () {
      var blueprint = controller.blueprint;
      var ui_properties = blueprint.ui_properties;
      var automate_entrypoints = ui_properties.automate_entrypoints;
      // modalData is what is bound to the html form fields
      var modalData = controller.modalData.resource;

      // Initially blueprint doesn't have catalog
      expect(ui_properties.service_catalog).to.eq(undefined);
      // Initialize catalog
      modalData.catalog = {id: 10000000000003};

      controller.saveBlueprintDetails();

      expect(ui_properties.service_catalog).to.not.eq(undefined);
      expect(ui_properties.service_catalog.id).to.eq(10000000000003);

      // reset catalog and initialize dialog
      expect(ui_properties.service_dialog).to.eq(undefined);
      // Initialize dialog
      modalData.dialog = {id: 10000000000002};
      // Reset catalog
      modalData.catalog = "";

      controller.saveBlueprintDetails();

      expect(ui_properties.service_catalog).to.eq(null);
      expect(ui_properties.service_dialog.id).to.eq(10000000000002);
    });

    it('should throw an error when attempting to publish', function () {
      // 'cause it's not ready yet
      controller.saveBlueprintDetails();
      expect(notificationsSuccessSpy).not.to.have.been.called;
      expect(notificationsErrorSpy).to.have.been.called;
    });
  });
});
