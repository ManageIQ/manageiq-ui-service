/* eslint camelcase: "off" */

export function BlueprintCanvasDirective() {
  return {
    restrict: 'AE',
    templateUrl: "app/components/blueprints/blueprint-canvas/blueprint-canvas.html",
    scope: {
      draggedItem: '=',
      readOnly: "=",
      inConnectingMode: "=",
      chartDataModel: "=",
      chartViewModel: "=",
    },
    controller: BlueprintCanvasController,
    controllerAs: 'vm',
    bindToController: true,
  };
}

/** @ngInject */
function BlueprintCanvasController($scope, $filter, DesignerState, BlueprintsState, $q, CollectionsApi, $log) {
  var vm = this;
  var newNodeCount = 0;

  // Create the view-model for the chart and attach to the scope.
  vm.chartViewModel = new flowchart.ChartViewModel(vm.chartDataModel);

  vm.addNodeToCanvas = function(newNode) {
    newNode.backgroundColor = '#fff';
    vm.chartViewModel.addNode(newNode);
  };

  vm.dropCallback = function(event, ui) {
    var newNode = BlueprintsState.prepareNodeForCanvas(vm.draggedItem);
    newNode.x = event.clientX - 350;
    newNode.y = event.clientY - 200;
    vm.addNodeToCanvas(newNode);
  };

  $scope.$on('addNodeToCanvas', function(evt, args) {
    var newNode = args.newNode;
    newNode.x = 250 + (newNodeCount * 4 + 160);
    newNode.y = 200 + (newNodeCount * 4 + 160);
    vm.addNodeToCanvas(newNode);
    newNodeCount++;
  });

  $scope.$on('duplicateSelectedItem', function(evt, args) {
    duplicateSelected();
  });

  $scope.$on('removeSelectedItems', function(evt, args) {
    vm.deleteSelected();
  });

  function duplicateSelected() {
    var dupNode = angular.copy(vm.chartViewModel.getSelectedNodes()[0]);

    if (!dupNode) {
      return;
    }

    dupNode.data.id = getNewId();

    var copyName = getCopyName(dupNode.data.name);

    dupNode.data.name = copyName.name;
    dupNode.data.title = copyName.name;
    dupNode.data.x = dupNode.data.x + 15 * copyName.numDups;
    dupNode.data.y = dupNode.data.y + 15 * copyName.numDups;

    vm.addNodeToCanvas(dupNode.data);
  }

  vm.deleteSelected = function() {
    var selectedNodes = vm.chartViewModel.getSelectedNodes();

    // Re-Enable selectedNodes in toolbox
    for (var i = 0; i < selectedNodes.length; i++) {
      var tabItem = DesignerState.getTabItemById(selectedNodes[i].id());
      if (tabItem) {
        tabItem.disableInToolbox = false;
      }
    }

    vm.chartViewModel.deleteSelected();
  };

  vm.selectAll = function() {
    vm.chartViewModel.selectAll();
  };

  vm.deselectAll = function() {
    vm.chartViewModel.deselectAll();
  };

  function getNewId() {
    // random number between 1 and 600
    return Math.floor((Math.random() * 600) + 1);
  }

  function getCopyName(baseName) {
    var baseNameLength = baseName.indexOf(' Copy');

    if (baseNameLength === -1) {
      baseNameLength = baseName.length;
    }

    baseName = baseName.substr(0, baseNameLength);

    var filteredArray = $filter('filter')(vm.chartViewModel.data.nodes, {name: baseName}, false);

    var copyName = baseName + " Copy" + ((filteredArray.length === 1) ? "" : " " + filteredArray.length);
    var numDups = filteredArray.length;

    return {'name': copyName, 'numDups': numDups};
  }

  /*
    *    FlowChart Vars and Methods
    */

  //
  // Code for the delete key.
  //
  var deleteKeyCode = 46;

  //
  // Code for control key.
  //
  var ctrlKeyCode = 17;

  //
  // Set to true when the ctrl key is down.
  //
  var ctrlDown = false;

  //
  // Code for A key.
  //
  var aKeyCode = 65;

  //
  // Code for D key
  //
  var dKeyCode = 68;

  //
  // Code for esc key.
  //
  var escKeyCode = 27;

  //
  // Event handler for key-down on the flowchart.
  //
  $scope.$on('bodyKeyDown', function(evt, args) {
    if (args.origEvent.keyCode === ctrlKeyCode) {
      ctrlDown = true;
      args.origEvent.stopPropagation();
      args.origEvent.preventDefault();
    }

    if (args.origEvent.keyCode === aKeyCode && ctrlDown) {
      //
      // Ctrl + A
      //
      vm.selectAll();
      args.origEvent.stopPropagation();
      args.origEvent.preventDefault();
    }

    if (args.origEvent.keyCode === dKeyCode && ctrlDown) {
      //
      // Ctrl + D
      //
      if (vm.chartViewModel.getSelectedNodes().length === 1) {
        vm.duplicateSelected();
      }
      args.origEvent.stopPropagation();
      args.origEvent.preventDefault();
    }
  });

  //
  // Event handler for key-up on the flowchart.
  //

  $scope.$on('bodyKeyUp', function(evt, args) {
    if (args.origEvent.keyCode === deleteKeyCode) {
      //
      // Delete key.
      //
      vm.deleteSelected();
    }

    if (args.origEvent.keyCode === escKeyCode) {
      // Escape.
      vm.deselectAll();
    }

    if (args.origEvent.keyCode === ctrlKeyCode) {
      ctrlDown = false;
      args.origEvent.stopPropagation();
      args.origEvent.preventDefault();
    }
  });

  //
  // Event handler for zoom.
  //

  $scope.$on('zoomIn', function(evt, args) {
    vm.chartViewModel.zoom.in();
  });

  $scope.$on('zoomOut', function(evt, args) {
    vm.chartViewModel.zoom.out();
  });
}
