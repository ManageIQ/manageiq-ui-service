describe('Component: blueprintCanvas', function() {

  beforeEach(function() {
    module('app.states', 'app.config', 'app.services', 'gettext');
    bard.inject('Session', '$httpBackend', '$compile', '$rootScope', 'BlueprintsState', 'DesignerState');
  });

  describe('with $compile', function() {
    this.timeout(15000);
    let element;
    let isoScope;
    let scope;


    beforeEach(inject(function($compile, $rootScope) {
      let mockDir = 'tests/mock/blueprint-canvas/';

      scope = $rootScope.$new();
      element = angular.element('<blueprint-canvas dragged-item="draggedItem" in-connecting-mode="false"  chart_data_model="chartDataModel"'
        + ' chart_view_model="chartViewModel"/>');

      Session.create({
        auth_token: 'b10ee568ac7b5d4efbc09a6b62cb99b8',
      });
      $httpBackend.whenGET('').respond(200);

      scope.chartDataModel = readJSON(mockDir + 'chart-data-model.json');
      scope.chartViewModel = {};
      scope.draggedItem = {};

      let el = $compile(element)(scope);
      scope.$apply();
      isoScope = el.isolateScope();
    }));

    it('should show the correct nodes on the canvas', function() {
      // Initially canvas contains 2 nodes
      let nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(2);

      // correct node titles
      let nodeTitles = element.find(".node-header > p");
      expect(nodeTitles.length).to.eq(2);
      expect(nodeTitles[0].textContent).to.eq("Deploy RHEL7 with PostgreSQL");
      expect(nodeTitles[1].textContent).to.eq("Hybrid Cloud Application");

      /* These worked in Chrome, but not PhantomJS ?!
       // correct node images
       let nodeImages = element.find("image");
       expect(nodeImages.length).to.eq(2);
       expect(nodeImages[0].outerHTML).to.contain("10r4.jpg");
       expect(nodeImages[1].outerHTML).to.contain("10r10.png");

       // They are bundles so should have the sm top left bundle icons
       let bundleIcons = element.find('.bundle-icon');
       expect(bundleIcons.length).to.eq(2);
       */
    });

    it('should add a node to the canvas', function() {
      // Initially canvas contains 2 nodes
      let nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(2);

      let newNode = {
        "name": "RHEL7 on Amazon AWS",
        "id": 10000000000018,
        "image": "http://localhost:8001/pictures/10r14.png",
        "x": 410,
        "y": 360
      };

      isoScope.vm.addNodeToCanvas(newNode);
      $rootScope.$apply();

      // Should now be 3 nodes on canvas
      nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(3);

      /* This worked in Chrome, but not PhantomJS ?!
       // New node is not a bundle, so still should only be two bundle icons
       let bundleIcons = element.find('.bundle-icon');
       expect(bundleIcons.length).to.eq(2);
       */
    });

    it('should remove a node from the canvas', function() {
      // Initially canvas contains 2 nodes
      let nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(2);

      selectNode(nodes[0]);
      scope.$apply();

      isoScope.vm.deleteSelected();
      scope.$apply();

      // Should now be 1 node on canvas
      nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(1);
    });

    it('should select all nodes', function() {
      // Initially no nodes are selected
      let selectedNodes = element.find('.selected-node-rect');
      expect(selectedNodes.length).to.eq(0);

      isoScope.vm.selectAll();
      scope.$apply();

      // 2 nodes should be selected
      selectedNodes = element.find('.selected-node-rect');
      expect(selectedNodes.length).to.eq(2);
    });

    it('should deselect all nodes', function() {
      // Initially no nodes are selected
      let selectedNodes = element.find('.selected-node-rect');
      expect(selectedNodes.length).to.eq(0);

      isoScope.vm.selectAll();
      scope.$apply();

      // 2 nodes should be selected
      selectedNodes = element.find('.selected-node-rect');
      expect(selectedNodes.length).to.eq(2);

      isoScope.vm.deselectAll();
      scope.$apply();

      // no nodes should be selected
      selectedNodes = element.find('.selected-node-rect');
      expect(selectedNodes.length).to.eq(0);
    });

    it('should show the node toolbar when mouse over node', function() {
      // Initially canvas contains 2 nodes
      let nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(2);

      // Initially no node toolbars displayed
      let nodeToolbars = element.find('.node-toolbar');
      expect(nodeToolbars.length).to.eq(0);

      mouseOverNode(nodes[0]);
      scope.$apply();

      // node toolbar should be displayed
      nodeToolbars = element.find('.node-toolbar');
      expect(nodeToolbars.length).to.eq(1);
    });

    it('should hide the node toolbar when mouse leaves node', function() {
      // Initially canvas contains 2 nodes
      let nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(2);

      // Initially no node toolbars displayed
      let nodeToolbars = element.find('.node-toolbar');
      expect(nodeToolbars.length).to.eq(0);

      mouseOverNode(nodes[0]);
      scope.$apply();

      // node toolbar should be displayed
      nodeToolbars = element.find('.node-toolbar');
      expect(nodeToolbars.length).to.eq(1);

      mouseLeaveNode(nodes[0]);
      scope.$apply();

      // node toolbar should be hidden
      nodeToolbars = element.find('.node-toolbar');
      expect(nodeToolbars.length).to.eq(0);
    });
  });

  function selectNode(node) {
    angular.element(node).parent().triggerHandler({type: 'mousedown', pageX: 0, pageY: 0});
    angular.element(node).parent().trigger('mousedown');
  }

  function mouseOverNode(node) {
    angular.element(node).parent().triggerHandler({type: 'mouseover'});
  }

  function mouseLeaveNode(node) {
    angular.element(node).parent().triggerHandler({type: 'mouseleave'});
  }
});
