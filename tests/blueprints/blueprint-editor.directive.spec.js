describe('app.components.blueprints.blueprint-editor.blueprint-editor-directive', function() {
  var element;
  var successResponse = {
    message: 'Success!'
  };

  beforeEach(function () {
    module('app.services', 'app.components', 'app.config', 'app.states', 'gettext', 'app.services');
    bard.inject('$state', 'Session', '$httpBackend', '$compile', '$rootScope', '$controller', 'BlueprintsState', 'DesignerState',
        'SaveBlueprintModal', '$controller', '$document', 'BlueprintDetailsModal');
  });

  var compileHTML = function (markup, scope) {
    element = angular.element(markup);
    $compile(element)(scope);

    scope.$digest();
  };

  beforeEach(function () {
    Session.create({
      auth_token: 'b10ee568ac7b5d4efbc09a6b62cb99b8',
    });
    $httpBackend.whenGET('').respond(200);
  });

  describe('Blueprints Editor: Existing Blueprint', function() {
    beforeEach(function () {
      var mockDir = 'tests/mock/blueprint-editor/';
      $rootScope.blueprint = readJSON(mockDir + 'blueprint.json');
      $rootScope.serviceTemplates = readJSON(mockDir + 'service-templates.json');

      var htmlTmp = '<blueprint-editor blueprint="blueprint" service-templates="serviceTemplates"/>';

      compileHTML(htmlTmp, $rootScope);
    });

    it('should display the correct blueprint name and enable save btn when name changed', function () {
      var blueprintName = element.find('#blueprintName');
      expect(blueprintName.val()).to.equal("Blueprint One");
      var saveButton = element.find('#saveBtm');
      expect(saveButton.hasClass('disabled')).to.eq(true);

      // Save Btn becomes enabled when blueprint name changed
      blueprintName.val("Updated Blueprint Name").trigger('input');
      expect(saveButton.hasClass('disabled')).to.eq(false);
    });


    it('should show/hide toolbox', function () {
      var toolbox = element.find('#toolbox');
      var addItemBtn = element.find('#toggleToolbox');

      // Toolbox initially hidden
      expect(toolbox.length).to.eq(0);

      // Toolbox shown when button clicked
      addItemBtn.click();
      toolbox = element.find('#toolbox');
      expect(toolbox.length).to.eq(1);
    });

    it('should show toolbox items disabled if they have been added to the canvas', function () {
      var toolbox = element.find('#toolbox');
      var addItemBtn = element.find('#toggleToolbox');

      // Toolbox initially hidden
      expect(toolbox.length).to.eq(0);

      // Toolbox shown when button clicked
      addItemBtn.click();
      toolbox = element.find('#toolbox');
      expect(toolbox.length).to.eq(1);

      // 3 items already on canvas
      var nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(3);

      // 3 items in toolbox should be disabled because they are on the canvas
      var disabledToolboxItems = element.find('.not-draggable');
      expect(disabledToolboxItems.length).to.eq(3);
    });

    it('should show toolbox items enabled when they are removed from the canvas', function () {
      var toolbox = element.find('#toolbox');
      var addItemBtn = element.find('#toggleToolbox');

      // Toolbox initially hidden
      expect(toolbox.length).to.eq(0);

      // Toolbox shown when button clicked
      addItemBtn.click();
      toolbox = element.find('#toolbox');
      expect(toolbox.length).to.eq(1);

      // 3 canvas nodes
      var nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(3);

      // 3 items in toolbox should be disabled because they are on the canvas
      var disabledToolboxItems = element.find('.not-draggable');
      expect(disabledToolboxItems.length).to.eq(3);

      // select and remove a node
      var removeBtn = element.find('#removeItems');
      selectNode(nodes[0]);
      expect(removeBtn.hasClass('disabled')).to.eq(false);
      removeBtn.click();

      // Should now be only two nodes on canvas
      nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(2);

      // Should now be only two disabled toolbox items
      disabledToolboxItems = element.find('.not-draggable');
      expect(disabledToolboxItems.length).to.eq(2);
    });

    it('should filter toolbox items', function () {
      var toolbox = element.find('#toolbox');
      var addItemBtn = element.find('#toggleToolbox');

      // Toolbox initially hidden
      expect(toolbox.length).to.eq(0);

      // Toolbox shown when button clicked
      addItemBtn.click();
      toolbox = element.find('#toolbox');
      expect(toolbox.length).to.eq(1);

      // Initially there should be 6 toolbox items
      var toolboxItems = element.find('.catalog-item');
      expect(toolboxItems.length).to.eq(6);

      // After filter is applied there should only be one toolbox item
      var filterFld = element.find('#filterFld');
      filterFld.val("RHEL7 on VMware").trigger('input');
      toolboxItems = element.find('.catalog-item');
      expect(toolboxItems.length).to.eq(1);
    });
  });

  describe('Blueprints Editor: New Blueprint', function() {
    beforeEach(function () {
      var mockDir = 'tests/mock/blueprint-editor/';
      $rootScope.blueprint = readJSON(mockDir + 'new-blueprint.json');
      $rootScope.serviceTemplates = readJSON(mockDir + 'service-templates.json');

      var htmlTmp = '<blueprint-editor blueprint="blueprint" service-templates="serviceTemplates"/>';

      compileHTML(htmlTmp, $rootScope);
    });

    it('should initially display empty name and save btn disabled, enable save when name entered', function () {
      var blueprintName = element.find('#blueprintName');
      var saveButton = element.find('#saveBtm');
      expect(blueprintName.val()).to.equal("");
      expect(saveButton.hasClass('disabled')).to.eq(true);

      // Save Btn becomes enabled when blueprint name entered
      blueprintName.val("Blueprint Four").trigger('input');
      expect(saveButton.hasClass('disabled')).to.eq(false);
    });

    it('should add toolbox items to the canvas when they are clicked', function () {
      var toolbox = element.find('#toolbox');
      var addItemBtn = element.find('#toggleToolbox');

      // Toolbox initially hidden
      expect(toolbox.length).to.eq(0);

      // Toolbox shown when button clicked
      addItemBtn.click();
      toolbox = element.find('#toolbox');
      expect(toolbox.length).to.eq(1);

      // Initially canvas is empty
      var nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(0);

      // Click on toolbox item to add it to canvas
      var toolboxItems = element.find('.catalog-item');
      toolboxItems[1].click();
      nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(1);

      // Toolbox item can only be added once
      expect(angular.element(toolboxItems[1]).hasClass('not-draggable')).to.eq(true);
    });

    it('should call save blueprint service when save button pressed', function () {
      var BlueprintsStateSpy = sinon.stub(BlueprintsState, 'saveBlueprint').returns(Promise.resolve({message: 'success'}));
      var blueprintName = element.find('#blueprintName');
      var saveButton = element.find('#saveBtm');
      blueprintName.val("Blueprint Four").trigger('input');
      saveButton.click();
      expect(BlueprintsStateSpy).to.have.been.called;
    });

    it('should launch details dlg. when details button pressed', function () {
      var BlueprintDetailsModalSpy = sinon.stub(BlueprintDetailsModal, 'showModal').returns(Promise.resolve());
      var detailsButton = element.find('.blueprint-details-btn');
      detailsButton.click();
      expect(BlueprintDetailsModalSpy).to.have.been.called;
    });

    it('should ask for confirmation when navigating away from a modified blueprint', function () {
      var stateGoSpy = sinon.spy($state, 'go');
      var saveModalSpy = sinon.stub(SaveBlueprintModal, 'showModal').returns(Promise.resolve());

      // edit blueprint name
      var blueprintName = element.find('#blueprintName');
      blueprintName.val("Blueprint Four").trigger('input');

      // attempt to nav away
      $state.go('designer.blueprints.list');

      expect(stateGoSpy).to.have.been.calledWith('designer.blueprints.list');
      expect(saveModalSpy).to.have.been.called;
    });

    it('should NOT ask for confirmation when navigating away from an unchanged blueprint', function () {
      var stateGoSpy = sinon.spy($state, 'go');
      var saveModalSpy = sinon.stub(SaveBlueprintModal, 'showModal').returns(Promise.resolve());

      // attempt to nav away
      $state.go('designer.blueprints.list');

      expect(stateGoSpy).to.have.been.calledWith('designer.blueprints.list');
      expect(saveModalSpy).to.not.have.been.called;
    });

    it('should handle single and multiple canvas selections', function () {
      var toolbox = element.find('#toolbox');
      var addItemBtn = element.find('#toggleToolbox');

      // Toolbox initially hidden
      expect(toolbox.length).to.eq(0);

      // Toolbox shown when button clicked
      addItemBtn.click();
      toolbox = element.find('#toolbox');
      expect(toolbox.length).to.eq(1);

      // Initially canvas is empty
      var nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(0);

      // Click on toolbox items to add them to canvas
      var toolboxItems = element.find('.catalog-item');
      toolboxItems[1].click();
      toolboxItems[2].click();
      nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(2);

      // With no nodes selected Duplicate and Remove buttons should be disabled
      var duplicateBtn = element.find('#duplicateItem');
      var removeBtn = element.find('#removeItems');
      expect(duplicateBtn.hasClass('disabled')).to.eq(true);
      expect(removeBtn.hasClass('disabled')).to.eq(true);

      // Single Node Selection should enable the Duplicate and Remove buttons
      selectNode(nodes[0]);

      // Should now be one node selected
      var selectedNodes = element.find('.selected-node-rect');
      expect(selectedNodes.length).to.eq(1);

      expect(duplicateBtn.hasClass('disabled')).to.eq(false);
      expect(removeBtn.hasClass('disabled')).to.eq(false);

      selectAnotherNode(nodes[1]);

      // Should now be two nodes selected
      selectedNodes = element.find('.selected-node-rect');
      expect(selectedNodes.length).to.eq(2);

      // Multiple node selections should disable the Duplicate button, but
      // the Remove button should remain enabled
      expect(duplicateBtn.hasClass('disabled')).to.eq(true);
      expect(removeBtn.hasClass('disabled')).to.eq(false);
    });

    it('should remove a selected node from the canvas', function () {
      var toolbox = element.find('#toolbox');
      var addItemBtn = element.find('#toggleToolbox');

      // Toolbox initially hidden
      expect(toolbox.length).to.eq(0);

      // Toolbox shown when button clicked
      addItemBtn.click();
      toolbox = element.find('#toolbox');
      expect(toolbox.length).to.eq(1);

      // Initially canvas is empty
      var nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(0);

      // Click on toolbox items to add them to canvas
      var toolboxItems = element.find('.catalog-item');
      toolboxItems[1].click();
      toolboxItems[2].click();

      // Should be two nodes on canvas
      nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(2);

      // select and click on the remove button
      var removeBtn = element.find('#removeItems');
      selectNode(nodes[0]);
      expect(removeBtn.hasClass('disabled')).to.eq(false);
      removeBtn.click();

      // Should now be only one node on canvas
      nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(1);
    });

    it('should zoom canvas in and out', function () {
      // Initial button state
      var transform = element.find('svg g');
      var zoomOutBtn = element.find('#zoomOut');
      var zoomInBtn = element.find('#zoomIn');

      // Initial button state
      expect(zoomOutBtn.hasClass('disabled')).to.eq(false);
      expect(zoomInBtn.hasClass('disabled')).to.eq(true);
      expect(transform[0].transform.baseVal.getItem(0).matrix.a).to.eq(1);

      // Zoom out at 75%
      zoomOutBtn.click();
      expect(zoomOutBtn.hasClass('disabled')).to.eq(false);
      expect(zoomInBtn.hasClass('disabled')).to.eq(false);
      expect(transform[0].transform.baseVal.getItem(0).matrix.a).to.eq(0.75);

      // Zoom out at 50%
      zoomOutBtn.click();
      expect(zoomOutBtn.hasClass('disabled')).to.eq(true);
      expect(zoomInBtn.hasClass('disabled')).to.eq(false);
      expect(transform[0].transform.baseVal.getItem(0).matrix.a).to.eq(0.5);

      // Zoom in at 75%
      zoomInBtn.click();
      expect(zoomOutBtn.hasClass('disabled')).to.eq(false);
      expect(zoomInBtn.hasClass('disabled')).to.eq(false);
      expect(transform[0].transform.baseVal.getItem(0).matrix.a).to.eq(0.75);

      // Zoom in at 100%
      zoomInBtn.click();
      expect(zoomOutBtn.hasClass('disabled')).to.eq(false);
      expect(zoomInBtn.hasClass('disabled')).to.eq(true);
      expect(transform[0].transform.baseVal.getItem(0).matrix.a).to.eq(1);
    });
  });

  describe('Blueprints Editor: Published Blueprint', function() {
    beforeEach(function () {
      var mockDir = 'tests/mock/blueprint-editor/';
      $rootScope.blueprint = readJSON(mockDir + 'published-blueprint.json');
      $rootScope.serviceTemplates = readJSON(mockDir + 'service-templates.json');

      var htmlTmp = '<blueprint-editor blueprint="blueprint" service-templates="serviceTemplates"/>';

      compileHTML(htmlTmp, $rootScope);
    });

    it('should display the top controls as read-only', function () {
      var label = element.find('#blueprintNameLabel');
      expect(label.length).to.eq(1);

      // no Save button
      var saveButton = element.find('#saveBtm');
      expect(saveButton.length).to.eq(0);

      label = element.find('#blueprintStatusLabel');
      expect(label.length).to.eq(1);

      var toolbox = element.find('#toolbox');
      var addItemBtn = element.find('#toggleToolbox');

      // Toolbox and Add Item button hidden
      expect(toolbox.length).to.eq(0);
      expect(addItemBtn.length).to.eq(0);
    });

    it('should set canvas as read-only', function () {
      // should be three nodes on published canvas
      var nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(3);

      // Node selection should be disabled
      selectNode(nodes[0]);

      // Shouldn't be any selected nodes
      var selectedNodes = element.find('.selected-node-rect');
      expect(selectedNodes.length).to.eq(0);
    });
  });

  function selectNode(node) {
    angular.element(node).parent().triggerHandler({type: 'mousedown', pageX: 0, pageY:0});
    angular.element(node).parent().trigger('mousedown');
  }

  function selectAnotherNode(node) {
    angular.element(node).parent().triggerHandler({type: 'mousedown', ctrlKey: true, pageX: 0, pageY:0});
    angular.element(node).parent().trigger('mousedown');
  }

});
