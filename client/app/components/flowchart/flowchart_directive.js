//
// Flowchart module.
//
angular.module('flowChart', ['dragging'] )
.filter('trustAsResourceUrl', ['$sce', function($sce) {
  return function(val) {
    return $sce.trustAsResourceUrl(val);
  };
}])

//
// Directive that generates the rendered chart from the data model.
//
.directive('flowChart', function() {
  return {
    restrict: 'E',
    templateUrl: "app/components/flowchart/flowchart_template.html",
    replace: true,
    scope: {
      chart: "=chart",
    },

    //
    // Controller for the flowchart directive.
    // Having a separate controller is better for unit testing, otherwise
    // it is painful to unit test a directive without instantiating the DOM
    // (which is possible, just not ideal).
    //
    controller: 'FlowChartController',
  };
})

//
// Directive that allows the chart to be edited as json in a textarea.
//
.directive('chartJsonEdit', function() {
  return {
    restrict: 'A',
    scope: {
      viewModel: "="
    },
    link: function(scope, elem, attr) {
      //
      // Serialize the data model as json and update the textarea.
      //
      var updateJson = function() {
        if (scope.viewModel) {
          var json = JSON.stringify(scope.viewModel.data, null, 4);
          $(elem).val(json);
        }
      };

      //
      // First up, set the initial value of the textarea.
      //
      updateJson();

      //
      // Watch for changes in the data model and update the textarea whenever necessary.
      //
      scope.$watch("viewModel.data", updateJson, true);

      //
      // Handle the change event from the textarea and update the data model
      // from the modified json.
      //
      $(elem).bind("input propertychange", function() {
        var json = $(elem).val();
        var dataModel = JSON.parse(json);
        scope.viewModel = new flowchart.ChartViewModel(dataModel);

        scope.$digest();
      });
    }
  };
})

//
// Controller for the flowchart directive.
// Having a separate controller is better for unit testing, otherwise
// it is painful to unit test a directive without instantiating the DOM
// (which is possible, just not ideal).
//
.controller('FlowChartController', ['dragging', '$element', function FlowChartController(dragging, $element) {
  var vm = this;

  //
  // Init data-model variables.
  //
  vm.draggingConnection = false;
  vm.connectorSize = 6;
  vm.dragSelecting = false;

  //
  // Reference to the connection, connector or node that the mouse is currently over.
  //
  vm.mouseOverConnector = null;
  vm.mouseOverConnection = null;
  vm.mouseOverNode = null;

  //
  // The class for connections and connectors.
  //
  vm.connectionClass = 'connection';
  vm.connectorClass = 'connector';
  vm.nodeClass = 'node';

  //
  // Translate the coordinates so they are relative to the svg element.
  //
  vm.translateCoordinates = function(x, y, evt) {
    var svgElem =  $element.get(0);
    var matrix = svgElem.getScreenCTM();
    var point = svgElem.createSVGPoint();
    point.x = x - evt.view.pageXOffset;
    point.y = y - evt.view.pageYOffset;

    return point.matrixTransform(matrix.inverse());
  };

  vm.hideConnectors = false;
  vm.$on('hideConnectors', function(evt, args) {
    vm.hideConnectors = args.hideConnectors;
  });

  vm.isConnectorConnected = function(connector) {
    return (connector && connector.connected());
  };

  vm.isConnectorUnconnectedAndValid = function(connector) {
    return (connector && !connector.connected() && !connector.invalid() &&
            connector.parentNode() !== vm.connectingModeSourceNode);
  };

  // determins if a dest. connector is connected to the source node
  vm.isConnectedTo = function(connector, node) {
    var connections = vm.chart.connections;
    for (var i = 0; i < connections.length; i++) {
      var connection = connections[i];
      if (connection.dest === connector && connection.source.parentNode() === node) {
        return true;
      }
    }

    return false;
  };

  vm.availableConnections = function() {
    return vm.chart.validConnections;
  };

  //
  // Called on mouse down in the chart.
  //
  vm.mouseDown = function(evt) {
    if (vm.inConnectingMode ) {
      // camceling out of connection mode, remove unused output connector
      vm.cancelConnectingMode();
    }

    vm.chart.deselectAll();

    vm.$emit('clickOnChart');

    dragging.startDrag(evt, {

      //
      // Commence dragging... setup variables to display the drag selection rect.
      //
      dragStarted: function(x, y) {
        vm.dragSelecting = true;
        var startPoint = vm.translateCoordinates(x, y, evt);
        vm.dragSelectionStartPoint = startPoint;
        vm.dragSelectionRect = {
          x: startPoint.x,
          y: startPoint.y,
          width: 0,
          height: 0,
        };
      },

      //
      // Update the drag selection rect while dragging continues.
      //
      dragging: function(x, y) {
        var startPoint = vm.dragSelectionStartPoint;
        var curPoint = vm.translateCoordinates(x, y, evt);

        vm.dragSelectionRect = {
          x: curPoint.x > startPoint.x ? startPoint.x : curPoint.x,
          y: curPoint.y > startPoint.y ? startPoint.y : curPoint.y,
          width: curPoint.x > startPoint.x ? curPoint.x - startPoint.x : startPoint.x - curPoint.x,
          height: curPoint.y > startPoint.y ? curPoint.y - startPoint.y : startPoint.y - curPoint.y,
        };
      },

      //
      // Dragging has ended... select all that are within the drag selection rect.
      //
      dragEnded: function() {
        vm.dragSelecting = false;
        vm.chart.applySelectionRect(vm.dragSelectionRect);
        delete vm.dragSelectionStartPoint;
        delete vm.dragSelectionRect;
      },
    });
  };

  //
  // Handle nodeMouseOver on an node.
  //
  vm.nodeMouseOver = function(evt, node) {
    vm.mouseOverNode = node;
  };

  //
  // Handle nodeMouseLeave on an node.
  //
  vm.nodeMouseLeave = function(evt, node) {
    vm.mouseOverNode = null;
  };

  //
  // Handle mousedown on a node.
  //
  vm.nodeMouseDown = function(evt, node) {
    var chart = vm.chart;
    var lastMouseCoords;

    dragging.startDrag(evt, {

      //
      // Node dragging has commenced.
      //
      dragStarted: function(x, y) {
        lastMouseCoords = vm.translateCoordinates(x, y, evt);

        //
        // If nothing is selected when dragging starts,
        // at least select the node we are dragging.
        //
        if (!node.selected()) {
          chart.deselectAll();
          node.select();
        }
      },

      //
      // Dragging selected nodes... update their x,y coordinates.
      //
      dragging: function(x, y) {
        var curCoords = vm.translateCoordinates(x, y, evt);
        var deltaX = curCoords.x - lastMouseCoords.x;
        var deltaY = curCoords.y - lastMouseCoords.y;

        chart.updateSelectedNodesLocation(deltaX, deltaY);

        lastMouseCoords = curCoords;
      },

      //
      // The node wasn't dragged... it was clicked.
      //
      clicked: function() {
        chart.handleNodeClicked(node, evt.ctrlKey);
      },

    });
  };

  //
  // Handle click on a node action
  //
  vm.nodeActionClick = function(evt, node, nodeAction) {
    console.log("Node Action '" + nodeAction.name() + "' executed on " + node.name());
    if (nodeAction.name() === "connect") {
      vm.startConnectingMode(node);
    }
  };

  vm.inConnectingMode = false;
  vm.connectingModeOutputConnector = null;
  vm.connectingModeSourceNode = null;

  vm.startConnectingMode = function(node) {
    vm.inConnectingMode = true;
    vm.hideConnectors = false;
    // emit up to parent components so that they may enable/disable controls based on
    // canvas connecting mode status
    vm.$emit('inConnectingMode', {'inConnectingMode': vm.inConnectingMode});
    vm.connectingModeSourceNode = node;
    vm.connectingModeOutputConnector = node.getOutputConnector();
    vm.chart.updateValidNodesAndConnectors(vm.connectingModeSourceNode);
  };

  vm.cancelConnectingMode = function() {
    // if output connector not connected to something, remove it
    if (!vm.connectingModeOutputConnector.connected()) {
      vm.chart.removeOutputConnector(vm.connectingModeOutputConnector);
    }
    vm.stopConnectingMode();
  };

  vm.stopConnectingMode = function() {
    vm.inConnectingMode = false;
    vm.chart.resetValidNodesAndConnectors();
    vm.$emit('inConnectingMode', {'inConnectingMode': vm.inConnectingMode});
  };

  //
  // Handle connectionMouseOver on an connection.
  //
  vm.connectionMouseOver = function(evt, connection) {
    if (!vm.draggingConnection) {  // Only allow 'connection mouse over' when not dragging out a connection.
      vm.mouseOverConnection = connection;
    }
  };

  //
  // Handle connectionMouseLeave on an connection.
  //
  vm.connectionMouseLeave = function(evt, connection) {
    vm.mouseOverConnection = null;
  };

  //
  // Handle mousedown on a connection.
  //
  vm.connectionMouseDown = function(evt, connection) {
    var chart = vm.chart;
    chart.handleConnectionMouseDown(connection, evt.ctrlKey);

    // Don't let the chart handle the mouse down.
    evt.stopPropagation();
    evt.preventDefault();
  };

  //
  // Handle connectorMouseOver on an connector.
  //
  vm.connectorMouseOver = function(evt, node, connector, connectorIndex, isInputConnector) {
    vm.mouseOverConnector = connector;
  };

  //
  // Handle connectorMouseLeave on an connector.
  //
  vm.connectorMouseLeave = function(evt, node, connector, connectorIndex, isInputConnector) {
    vm.mouseOverConnector = null;
  };

  //
  // Handle mousedown on an input connector.
  //
  vm.connectorMouseDown = function(evt, node, connector, connectorIndex, isInputConnector) {
    if (vm.inConnectingMode && node !== vm.connectingModeSourceNode) {
      vm.chart.createNewConnection(vm.connectingModeOutputConnector, vm.mouseOverConnector);
      vm.stopConnectingMode();
    }

    //
    // Initiate dragging out of a connection.
    /*
    dragging.startDrag(evt, {

      //
      // Called when the mouse has moved greater than the threshold distance
      // and dragging has commenced.
      //
      dragStarted: function(x, y) {
        var curCoords = controller.translateCoordinates(x, y, evt);

        $scope.draggingConnection = true;
        $scope.dragPoint1 = flowchart.computeConnectorPos(node, connectorIndex, isInputConnector);
        $scope.dragPoint2 = {
          x: curCoords.x,
          y: curCoords.y
        };
        $scope.dragTangent1 = flowchart.computeConnectionSourceTangent($scope.dragPoint1, $scope.dragPoint2);
        $scope.dragTangent2 = flowchart.computeConnectionDestTangent($scope.dragPoint1, $scope.dragPoint2);
      },

      //
      // Called on mousemove while dragging out a connection.
      //
      dragging: function(x, y, evt) {
        var startCoords = controller.translateCoordinates(x, y, evt);
        $scope.dragPoint1 = flowchart.computeConnectorPos(node, connectorIndex, isInputConnector);
        $scope.dragPoint2 = {
          x: startCoords.x,
          y: startCoords.y
        };
        $scope.dragTangent1 = flowchart.computeConnectionSourceTangent($scope.dragPoint1, $scope.dragPoint2);
        $scope.dragTangent2 = flowchart.computeConnectionDestTangent($scope.dragPoint1, $scope.dragPoint2);
      },

      //
      // Clean up when dragging has finished.
      //
      dragEnded: function() {
        if ($scope.mouseOverConnector && $scope.mouseOverConnector !== connector) {
          //
          // Dragging has ended...
          // The mouse is over a valid connector...
          // Create a new connection.
          //
          $scope.chart.createNewConnection(connector, $scope.mouseOverConnector);
        }

        $scope.draggingConnection = false;
        delete $scope.dragPoint1;
        delete $scope.dragTangent1;
        delete $scope.dragPoint2;
        delete $scope.dragTangent2;
      }
    });
    */
  };
}])
;
