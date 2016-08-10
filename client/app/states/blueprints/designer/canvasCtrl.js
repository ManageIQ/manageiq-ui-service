angular.module('app.states').controller('canvasCtrl', ['$scope', '$filter',
  function($scope, $filter) {
    var chartDataModel = {};
    if ($scope.$parent.blueprint.chartDataModel) {
      chartDataModel = $scope.$parent.blueprint.chartDataModel;
    }

    // Create the view-model for the chart and attach to the scope.
    $scope.chartViewModel = new flowchart.ChartViewModel(chartDataModel);
    $scope.$parent.chartViewModel = $scope.chartViewModel;

    $scope.$watch("chartViewModel.data", function(oldValue, newValue) {
      if (!angular.equals(oldValue, newValue)) {
        $scope.$emit('BlueprintCanvasChanged', {'chartDataModel': $scope.chartViewModel.data});
      }
    }, true);

    $scope.startCallback = function(event, ui, item) {
      $scope.draggedItem = item;
    };

    $scope.dropCallback = function(event, ui) {
      var newNode = angular.copy($scope.draggedItem);
      newNode.id = nextNodeID++;
      if (newNode.type && newNode.type === 'generic') {
        newNode.name = 'New ' + newNode.title;
      } else {
        newNode.name = newNode.title;
      }
      newNode.backgroundColor = '#fff';
      newNode.x = event.clientX - 350;
      newNode.y = event.clientY - 200;
      $scope.addNewNode(newNode);
    };

    $scope.addNodeByClick = function(item) {
      var newNode = angular.copy(item);
      newNode.id = nextNodeID++;
      if (newNode.type && newNode.type === 'generic') {
        newNode.name = 'New ' + newNode.title;
      } else {
        newNode.name = newNode.title;
      }
      newNode.backgroundColor = '#fff';
      newNode.x = 250 + (nextNodeID * 4 + 160);
      newNode.y = 200 + (nextNodeID * 4 + 160);
      $scope.addNewNode(newNode);
    };

    $scope.addNewNode = function(newNode) {
      $scope.chartViewModel.addNode(newNode);
    };

    $scope.$on('duplicateSelectedItem', function(evt, args) {
      $scope.duplicateSelected();
    });

    $scope.$on('removeSelectedItems', function(evt, args) {
      $scope.deleteSelected();
    });

    $scope.duplicateSelected = function() {
      var dupNode = angular.copy($scope.chartViewModel.getSelectedNodes()[0]);

      if (!dupNode) {
        return;
      }

      dupNode.data.id = getNewId();

      var copyName = getCopyName(dupNode.data.name);

      dupNode.data.name = copyName.name;
      dupNode.data.x = dupNode.data.x + 15 * copyName.numDups;
      dupNode.data.y = dupNode.data.y + 15 * copyName.numDups;

      $scope.addNewNode(dupNode.data);
    };

    $scope.deleteSelected = function() {
      $scope.chartViewModel.deleteSelected();
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

      var filteredArray = $filter('filter')( $scope.chartViewModel.data.nodes, {name: baseName}, false);

      var copyName = baseName + " Copy" + ((filteredArray.length === 1) ? "" : " " + filteredArray.length) ;
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
    // Selects the next node id.
    //
    var nextNodeID = 10;

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
        $scope.chartViewModel.selectAll();
        args.origEvent.stopPropagation();
        args.origEvent.preventDefault();
      }

      if (args.origEvent.keyCode === dKeyCode && ctrlDown) {
        //
        // Ctrl + D
        //
        if ($scope.chartViewModel.getSelectedNodes().length === 1) {
          $scope.duplicateSelected();
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
        $scope.deleteSelected();
      }

      if (args.origEvent.keyCode === escKeyCode) {
        // Escape.
        $scope.chartViewModel.deselectAll();
      }

      if (args.origEvent.keyCode === ctrlKeyCode) {
        ctrlDown = false;
        args.origEvent.stopPropagation();
        args.origEvent.preventDefault();
      }
    });
  }]);
