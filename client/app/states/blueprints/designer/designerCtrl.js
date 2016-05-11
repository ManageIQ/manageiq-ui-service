angular.module('app.states')
    .controller('designerCtrl', ['$scope', '$timeout', 'BlueprintsState', 'BlueprintDetailsModal', 'SaveBlueprintModal', '$rootScope',
                '$state', 'Notifications',
    function($scope, $timeout, BlueprintsState, BlueprintDetailsModal, SaveBlueprintModal, $rootScope, $state, Notifications) {
      // dev level debug output
      var debug = false;

      $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (fromState.name === "blueprints.designer" && toState.name !== "blueprints.designer") {
          if (debug) {
            console.log("Changing from blueprints design state");
            console.log("    defaultPrevented = : " + event.defaultPrevented);
            console.log("    fromState.okToNavAway = " + fromState.okToNavAway);
          }
          var origBlueprint = angular.copy(BlueprintsState.getBlueprintById(blueprintId));
          if (debug) {
            console.log("    angular.equals(origBlueprint, $scope.blueprint: " + angular.equals(origBlueprint, $scope.blueprint));
          }
          if (!angular.equals(origBlueprint, $scope.blueprint) && !event.defaultPrevented && !fromState.okToNavAway) {
            if (debug) {
              console.log("  ---> Somethings changed, stopping progression to handle it");
            }
            SaveBlueprintModal.showModal($scope.blueprint, toState, toParams, fromState, fromParams);
            event.preventDefault();
          }
        }
      });

      $scope.blueprint = {};
      var blueprintDirty = false;

      var blueprintId = $scope.$parent.vm.blueprintId;
      if (blueprintId) {
        $scope.blueprint = angular.copy(BlueprintsState.getBlueprintById(blueprintId));
        if (!$scope.blueprint) {
          console.log("Error getting blueprint " + blueprintId);
        }
      }

      $scope.$watch("blueprint", function(oldValue, newValue) {
        if (debug) {
          console.log("blueprint change event captured");
        }

        if (!angular.equals(oldValue, newValue, true)) {
          blueprintDirty = true;
          $state.current.okToNavAway = false;
          if (debug) {
            console.log("blueprint is dirty");
          }
        } else {
          if (debug) {
            console.log("blueprint is NOT dirty");
          }
        }
      }, true);

      $scope.$on('BlueprintCanvasChanged', function(evt, args) {
        if (args.chartDataModel && !angular.equals($scope.blueprint.chartDataModel, args.chartDataMode)) {
          $scope.blueprint.chartDataModel = args.chartDataModel;
          blueprintDirty = true;
          if (debug) {
            console.log("blueprint.chartDataModel updated");
          }
        }
      });

      $scope.blueprintUnchanged = function() {
        return !blueprintDirty;
      };

      $scope.saveBlueprint = function() {
        BlueprintsState.saveBlueprint($scope.blueprint);

        // get another copy to work, different obj from what was saved
        $scope.blueprint = angular.copy($scope.blueprint);

        $timeout(function() {
          blueprintDirty = false;
          $state.current.okToNavAway = false;
          if (debug) {
            console.log("saving blueprint - $state.current: " + angular.toJson($state.current, true));
          }
        });
      };

      $scope.deleteBlueprint = function() {
        BlueprintsState.deleteBlueprint($scope.blueprint.id);
        Notifications.success($scope.blueprint.name + __(' was deleted.'));
        $state.go('blueprints.list');
      };

      $scope.editDetails = function() {
        BlueprintDetailsModal.showModal('edit', $scope.blueprint);
      };

      /*  Catalog Editor Toolbox Methods */

      $scope.toolboxVisible = false;

      $scope.showToolbox = function() {
        $scope.toolboxVisible = true;

        // add class to subtabs to apply PF style

        $timeout(function() {
          $( "#subtabs>ul" ).addClass('nav-tabs-pf');
        });
      };

      $scope.hideToolbox = function() {
        $scope.toolboxVisible = false;
      };

      $scope.$on('clickOnChart', function(evt) {
        $scope.hideToolbox();
      });

      $scope.tabs = [
            { preTitle: 'Compute', title: 'Cloud', subtabs: [
                {title: 'AWS', items: [
                    {title: 'Ansible', image: 'assets/images/blueprint-designer/Ansible_Logo.svg'},
                    {title: 'AWS', image: 'assets/images/blueprint-designer/AWS-Logo.svg'},
                    {title: 'Azure', image: 'assets/images/blueprint-designer/Azure-Logo.svg'},
                    {title: 'Chef', image: 'assets/images/blueprint-designer/Chef-Logo.png'},
                    {title: 'Cloudformation', image: 'assets/images/blueprint-designer/Cloudformation-Logo.svg'},
                    {title: 'GCE', image: 'assets/images/blueprint-designer/GCE_Logo.png'},
                    {title: 'Kubernetes', image: 'assets/images/blueprint-designer/kubernetes-Logo.svg'},
                    {title: 'NetApp', image: 'assets/images/blueprint-designer/NetApp_Logo.svg'},
                    {title: 'Nuage', image: 'assets/images/blueprint-designer/Nuage-Logo.svg'},
                    {title: 'OpenShift', image: 'assets/images/blueprint-designer/OpenShift-Logo-NoText.svg'},
                    {title: 'Openstack Heat', image: 'assets/images/blueprint-designer/Openstack-Heat-Logos.svg'},
                    {title: 'OpenStack', image: 'assets/images/blueprint-designer/Openstack-Logo.svg'},
                    {title: 'Openstack Neutrons', image: 'assets/images/blueprint-designer/Openstack-Neutrons-Logos.svg'},
                    {title: 'Puppet', image: 'assets/images/blueprint-designer/Puppet-Logo.svg'},
                    {title: 'RedHat', image: 'assets/images/blueprint-designer/RedHat_logo.svg'},
                    {title: 'Atomic', image: 'assets/images/blueprint-designer/RH_Atomic-Logo-NoText.svg'},
                    {title: 'RHEV', image: 'assets/images/blueprint-designer/RHEV_Logo.svg'},
                    {title: 'Satellite', image: 'assets/images/blueprint-designer/Satellite_Logo.svg'},
                    {title: 'Storage', image: 'assets/images/blueprint-designer/Storage_Logo.svg'},
                    {title: 'Vmware', image: 'assets/images/blueprint-designer/Vmware-Logo.svg'}
                  ]
                },
                {title: 'Azure', items: [
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'}]},
                {title: 'GCE', items: [
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'}]},
                {title: 'OpenStack', items: [
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'}]}
            ]
            },
            { preTitle: 'Compute', title: 'Containers', subtabs: [
                {title: 'AP', items: [
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'}]},
                {title: 'Kubernetes', items: [
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'}]},
                {title: 'OSE', items: [
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'},
                    {title: 'Service Item', image: 'assets/images/blueprint-designer/catalogItem.png'}]}
            ]
            },
            { preTitle: 'Compute', title: 'Infrastructure', subtabs:
              [
                {title: 'OpenStack'},
                {title: 'RHEV'},
                {title: 'SCVMM'},
                {title: 'VMware'}
              ]
            },
            { title: 'Storage', subtabs:
              [
                {title: 'NetApp'},
                {title: 'USM'}
              ]
            },
            { title: 'Network', subtabs:
              [
                {title: 'Azure Stacks'},
                {title: 'CloudFormation'},
                {title: 'Heat Templates'}
              ]
            },
            { title: 'Orchestration', subtabs:
                [
                    {title: 'Ansible'},
                    {title: 'Satellite'}
                ]
            },
            { title: 'Middleware', subtabs:
                [
                    {title: 'Hawkular'}
                ]
            },
            // 'uf06b' is the font awesome varible content for the 'gift'
            { title: 'Bundles', items: [
                {title: 'Bundle', bundle: true},
                {title: 'Bundle', bundle: true},
                {title: 'Bundle', bundle: true},
                {title: 'Bundle', bundle: true},
                {title: 'Bundle', bundle: true},
                {title: 'Bundle', bundle: true},
                {title: 'Bundle', bundle: true},
                {title: 'Bundle', bundle: true}]
            }
        ];

      $scope.newItem = {title: 'New Item', image: 'assets/images/blueprint-designer/catalogItem.png'};
    }]);
