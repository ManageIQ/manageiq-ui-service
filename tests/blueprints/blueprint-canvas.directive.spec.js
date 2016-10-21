describe('app.components.blueprints.blueprint-canvas.directive', function() {
  var element;
  var isoScope;

  beforeEach(function () {
    module('app.services', 'app.components', 'app.config', 'gettext');
    bard.inject('Session', '$httpBackend', '$compile', '$rootScope', 'BlueprintsState', 'DesignerState');
  });

  var compileHTML = function (markup, scope) {
    element = angular.element(markup);
    var el = $compile(element)(scope);

    scope.$digest();
    isoScope = el.isolateScope();
  };

  beforeEach(function () {
    Session.create({
      auth_token: 'b10ee568ac7b5d4efbc09a6b62cb99b8',
    });
    $httpBackend.whenGET('').respond(200);
  });

  describe('canvas operations', function() {
    beforeEach(function () {
      var mockDir = 'tests/mock/blueprint-canvas/';
      $rootScope.chartDataModel = readJSON(mockDir + 'chart-data-model.json');
      $rootScope.chartViewModel = {};
      $rootScope.draggedItem = {};

      var htmlTmp = '<blueprint-canvas dragged-item="draggedItem"'
                                   + ' in-connecting-mode="false"'
                                   + ' chart_data_model="chartDataModel"'
                                   + ' chart_view_model="chartViewModel"/>';

      compileHTML(htmlTmp, $rootScope);
    });

    it('should show the correct nodes on the canvas', function () {
      // Initially canvas contains 2 nodes
      var nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(2);

      // correct node titles
      var nodeTitles = element.find(".node-header > p");
      expect(nodeTitles.length).to.eq(2);
      expect(nodeTitles[0].textContent).to.eq("Deploy RHEL7 with PostgreSQL");
      expect(nodeTitles[1].textContent).to.eq("Hybrid Cloud Application");

      /* These worked in Chrome, but not PhantomJS ?!
        // correct node images
        var nodeImages = element.find("image");
        expect(nodeImages.length).to.eq(2);
        expect(nodeImages[0].outerHTML).to.contain("10r4.jpg");
        expect(nodeImages[1].outerHTML).to.contain("10r10.png");

        // They are bundles so should have the sm top left bundle icons
        var bundleIcons = element.find('.bundle-icon');
        expect(bundleIcons.length).to.eq(2);
       */
    });

    it('should add a node to the canvas', function () {
      // Initially canvas contains 2 nodes
      var nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(2);

      var newNode = {
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
        var bundleIcons = element.find('.bundle-icon');
        expect(bundleIcons.length).to.eq(2);
      */
    });

    it('should remove a node from the canvas', function () {
      // Initially canvas contains 2 nodes
      var nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(2);

      selectNode(nodes[0]);
      $rootScope.$apply();

      isoScope.vm.deleteSelected();
      $rootScope.$apply();

      // Should now be 1 node on canvas
      nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(1);
    });

    it('should select all nodes', function () {
      // Initially no nodes are selected
      var selectedNodes = element.find('.selected-node-rect');
      expect(selectedNodes.length).to.eq(0);

      isoScope.vm.selectAll();
      $rootScope.$apply();

      // 2 nodes should be selected
      selectedNodes = element.find('.selected-node-rect');
      expect(selectedNodes.length).to.eq(2);
    });

    it('should deselect all nodes', function () {
      // Initially no nodes are selected
      var selectedNodes = element.find('.selected-node-rect');
      expect(selectedNodes.length).to.eq(0);

      isoScope.vm.selectAll();
      $rootScope.$apply();

      // 2 nodes should be selected
      selectedNodes = element.find('.selected-node-rect');
      expect(selectedNodes.length).to.eq(2);

      isoScope.vm.deselectAll();
      $rootScope.$apply();

      // no nodes should be selected
      selectedNodes = element.find('.selected-node-rect');
      expect(selectedNodes.length).to.eq(0);
    });

    it('should show the node toolbar when mouse over node', function () {
      // Initially canvas contains 2 nodes
      var nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(2);

      // Initially no node toolbars displayed
      var nodeToolbars = element.find('.node-toolbar');
      expect(nodeToolbars.length).to.eq(0);

      mouseOverNode(nodes[0]);
      $rootScope.$apply();

      // node toolbar should be displayed
      nodeToolbars = element.find('.node-toolbar');
      expect(nodeToolbars.length).to.eq(1);
    });

    it('should hide the node toolbar when mouse leaves node', function () {
      // Initially canvas contains 2 nodes
      var nodes = element.find('.node-rect');
      expect(nodes.length).to.eq(2);

      // Initially no node toolbars displayed
      var nodeToolbars = element.find('.node-toolbar');
      expect(nodeToolbars.length).to.eq(0);

      mouseOverNode(nodes[0]);
      $rootScope.$apply();

      // node toolbar should be displayed
      nodeToolbars = element.find('.node-toolbar');
      expect(nodeToolbars.length).to.eq(1);

      mouseLeaveNode(nodes[0]);
      $rootScope.$apply();

      // node toolbar should be hidden
      nodeToolbars = element.find('.node-toolbar');
      expect(nodeToolbars.length).to.eq(0);
    });
  });

  function selectNode(node) {
    angular.element(node).parent().triggerHandler({type: 'mousedown', pageX: 0, pageY:0});
    angular.element(node).parent().trigger('mousedown');
  }

  function mouseOverNode(node) {
    angular.element(node).parent().triggerHandler({type: 'mouseover'});
  }

  function mouseLeaveNode(node) {
    angular.element(node).parent().triggerHandler({type: 'mouseleave'});
  }
});
