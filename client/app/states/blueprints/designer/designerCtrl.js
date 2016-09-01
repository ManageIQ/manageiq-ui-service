angular.module('app.states')
    .controller('designerCtrl', ['$scope', '$timeout', 'BlueprintsState', 'BlueprintDetailsModal', 'SaveBlueprintModal', '$rootScope',
                '$state', 'CollectionsApi', 'Notifications',
    function($scope, $timeout, BlueprintsState, BlueprintDetailsModal, SaveBlueprintModal, $rootScope, $state, CollectionsApi, // jshint ignore:line
             Notifications) {
      // dev level debug output
      var debug = false;

      $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (toState.name === 'login') {
          return;
        }

        if (fromState.name === "blueprints.designer" && toState.name !== "blueprints.designer") {
          if (debug) {
            console.log("Changing from blueprints design state");
            console.log("    !defaultPrevented = : " + !event.defaultPrevented);
            console.log("    !fromState.okToNavAway = " + !fromState.okToNavAway);
          }
          var origBlueprint = angular.copy(BlueprintsState.getBlueprintById(blueprintId));
          if (debug) {
            console.log("    !angular.equals(origBlueprint, $scope.blueprint: " + !angular.equals(origBlueprint, $scope.blueprint));
            console.log("        Orig            : " + angular.toJson(origBlueprint, true));
            console.log("        $scope.blueprint: " + angular.toJson($scope.blueprint, true));
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
      $scope.chartViewModel = {};

      var blueprintDirty = false;

      var blueprintId = $scope.$parent.vm.blueprintId;
      if (blueprintId) {
        $scope.blueprint = angular.copy(BlueprintsState.getBlueprintById(blueprintId));
        if (!$scope.blueprint) {
          console.log("Error getting blueprint " + blueprintId);
        }
      } else {
        $scope.blueprint = angular.copy(newBlueprint());
        blueprintId = $scope.blueprint.id;
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

      function newBlueprint() {
        var blueprint = BlueprintsState.getNewBlueprintObj();
        blueprintDirty = true;
        $state.current.okToNavAway = false;

        return blueprint;
      }

      $scope.saveBlueprint = function() {
        BlueprintsState.saveBlueprint($scope.blueprint);

        // get another copy to work, different obj from what was saved
        $scope.blueprint = angular.copy($scope.blueprint);

        $timeout(function() {
          blueprintDirty = false;
          $state.current.okToNavAway = false;
          $( "#saveBtm" ).blur();
          if (debug) {
            console.log("saving blueprint - $state.current: " + angular.toJson($state.current, true));
          }
        });
      };

      $scope.editDetails = function() {
        BlueprintDetailsModal.showModal('edit', $scope.blueprint);
      };

      $scope.itemsSelected = function() {
        if ($scope.chartViewModel && $scope.chartViewModel.getSelectedNodes) {
          return $scope.chartViewModel.getSelectedNodes().length > 0;
        } else {
          return false;
        }
      };

      $scope.onlyOneTtemSelected = function() {
        if ($scope.chartViewModel && $scope.chartViewModel.getSelectedNodes) {
          return $scope.chartViewModel.getSelectedNodes().length === 1;
        } else {
          return false;
        }
      };

      $scope.duplicateSelectedItem = function() {
        $scope.$broadcast('duplicateSelectedItem');
        $( "#duplicateItem" ).blur();
      };

      $scope.removeSelectedItemsFromCanvas = function() {
        $scope.$broadcast('removeSelectedItems');
        $( "#removeItems" ).blur();
      };

      /*  Catalog Editor Toolbox Methods */

      $scope.toolboxVisible = false;

      $scope.showToolbox = function() {
        $scope.toolboxVisible = true;
        // add class to subtabs to apply PF style and
        // focus to filter input box

        $timeout(function() {
          $( "#subtabs>ul" ).addClass('nav-tabs-pf');
          $( "#filterFld" ).focus();
        });
      };

      $scope.hideToolbox = function() {
        $scope.toolboxVisible = false;
      };

      $scope.$on('clickOnChart', function(evt) {
        $scope.hideToolbox();
      });

      $scope.tabClicked = function() {
        $( "#filterFld" ).focus();
      };

      $scope.inConnectingMode = false;
      $scope.hideConnectors = false;

      // broadcast hideConnectors change down to canvas
      $scope.toggleshowHideConnectors = function() {
        $scope.$broadcast('hideConnectors', {hideConnectors: $scope.hideConnectors});
      };

      // listen for in connecting mode from canvas
      $scope.$on('inConnectingMode', function(evt, args) {
        $scope.inConnectingMode = args.inConnectingMode;
        $scope.hideConnectors = false;
      });

      $scope.tabs = [
            { preTitle: 'Compute', title: 'Cloud', subtabs: [
                {title: 'Amazon Web Services', items: [
                  {title: 'AWS', image: 'assets/images/blueprint-designer/AWS-Logo.svg'}
                ]},
                {title: 'Azure', items: [
                  {title: 'Azure', image: 'assets/images/blueprint-designer/Azure-Logo.svg'}
                ]},
                {title: 'GCE', items: [
                  {title: 'GCE', image: 'assets/images/blueprint-designer/GCE_Logo.png'}
                ]},
                {title: 'OpenStack', items: [
                  {title: 'OpenStack', image: 'assets/images/blueprint-designer/Openstack-Logo.svg'}
                ]},
                {title: 'Generic',
                 items: [],
                 newItem: {title: 'Instance',
                           type: 'generic',
                           icon: "pficon-virtual-machine",
                           fontFamily: "PatternFlyIcons-webfont",
                           fontContent: "\ue90f"}}
            ]
            },
            { preTitle: 'Compute', title: 'Containers', subtabs: [
                {title: 'Kubernetes', items: [
                    {title: 'Kubernetes', image: 'assets/images/blueprint-designer/kubernetes-Logo.svg'}
                   ]},
                {title: 'OSE', items: [
                  {title: 'OpenShift', image: 'assets/images/blueprint-designer/OpenShift-Logo-NoText.svg'}
                ]}
            ]
            },
            { preTitle: 'Compute', title: 'Infrastructure', subtabs:
              [
                {title: 'OpenStack', items: [
                  {title: 'OpenStack', image: 'assets/images/blueprint-designer/Openstack-Logo.svg'}
                ]},
                {title: 'RHEV', items: [
                  {title: 'RHEV', image: 'assets/images/blueprint-designer/RHEV_Logo.svg'}
                ]},
                {title: 'SCVMM'},
                {title: 'VMware', items: [
                  {title: 'Vmware', image: 'assets/images/blueprint-designer/Vmware-Logo.svg'}
                ]},
                {title: 'Generic',
                 items: [],
                 newItem: {title: 'VM',
                           type: 'generic',
                           icon: "pficon-virtual-machine",
                           fontFamily: "PatternFlyIcons-webfont",
                           fontContent: "\ue90f"}}
              ]
            },
            { preTitle: 'Configuration', title: 'Management', subtabs:
                [
                  {title: 'Ansible', items: [
                    {title: 'Ansible', image: 'assets/images/blueprint-designer/Ansible_Logo.svg'}
                  ]},
                  {title: 'Chef', items: [
                    {title: 'Chef', image: 'assets/images/blueprint-designer/Chef-Logo.png'}
                  ]},
                  {title: 'Puppet', items: [
                    {title: 'Puppet', image: 'assets/images/blueprint-designer/Puppet-Logo.svg'}
                  ]},
                  {title: 'Satellite', items: [
                    {title: 'Satellite', image: 'assets/images/blueprint-designer/Satellite_Logo.svg'}
                  ]}
                ]
            },
            { title: 'Storage', subtabs:
              [
                {title: 'NetApp', items: [
                  {title: 'NetApp', image: 'assets/images/blueprint-designer/NetApp_Logo.svg'}
                ]},
                {title: 'USM', items: [
                  {title: 'Storage', image: 'assets/images/blueprint-designer/Storage_Logo.svg'}
                ]}
              ]
            },
            { title: 'Middleware', subtabs:
                [
                  {title: 'Hawkular'}
                ]
            },
            { title: 'Network', subtabs:
              [
                {title: 'Neutron', items: [
                   {title: 'OpenStack Neutron', image: 'assets/images/blueprint-designer/Openstack-Neutrons-Logos.svg'}
                ]},
                {title: 'Nuage', items: [
                  {title: 'Nuage', image: 'assets/images/blueprint-designer/Nuage-Logo.svg'}
                ]},
                {title: 'Generic',
                 items: [],
                 newItem: {title: 'Load Balancer',
                           type: 'generic',
                           icon: "pficon-network",
                           fontFamily: "PatternFlyIcons-webfont",
                           fontContent: "\ue909"}}
              ]
            },
            { title: 'Orchestration', subtabs:
                [
                    {title: 'Azure Stacks'},
                    {title: 'CloudFormation', items: [
                      {title: 'Cloudformation', image: 'assets/images/blueprint-designer/Cloudformation-Logo.svg'}
                    ]},
                    {title: 'Heat Templates', items: [
                      {title: 'Openstack Heat', image: 'assets/images/blueprint-designer/Openstack-Heat-Logos.svg'}
                    ]}
                ]
            },
            { title: 'Bundles', active: true, items: [
                {title: 'Bundle 1', bundle: true, fontFamily: "FontAwesome", fontContent: "\uf06b"},
                {title: 'Bundle 2', bundle: true, fontFamily: "FontAwesome", fontContent: "\uf06b"},
                {title: 'Bundle 3', bundle: true, fontFamily: "FontAwesome", fontContent: "\uf06b"},
                {title: 'Bundle 4', bundle: true, fontFamily: "FontAwesome", fontContent: "\uf06b"},
                {title: 'Bundle 5', bundle: true, fontFamily: "FontAwesome", fontContent: "\uf06b"}
              ],
              newItem: {title: 'Bundle', type: 'generic', bundle: true, fontFamily: "FontAwesome", fontContent: "\uf06b"}
            }
        ];

      retrieveDesignerTabs();

      function retrieveDesignerTabs() {
        var attributes = ['picture', 'picture.image_href', 'service_type', 'prov_type', 'service_template_catalog.name'];
        var options = {
          expand: 'resources',
          filter: ['service_template_catalog_id>0', 'display=true'],
          attributes: attributes};

        var srvTemplates = CollectionsApi.query('service_templates', options);

        srvTemplates.then(function(data) {
          srvTemplates = data.resources;
          var bundles = getBundles(srvTemplates);
          if (bundles.length > 0) {
            var origBundleItems = $scope.tabs[$scope.tabs.length - 1].items;
            $scope.tabs[$scope.tabs.length - 1].items = bundles.concat(origBundleItems);
          }

          matchAtomicServiceItemsToSubTabs(srvTemplates);
        });
      }

      function getBundles(srvTemplates) {
        var bundles = [];
        for (var i = 0; i<srvTemplates.length; i++) {
          if (srvTemplates[i].service_type === 'composite') {
            var newBundle = {title: srvTemplates[i].service_template_catalog.name, bundle: true};
            if (srvTemplates[i].picture && srvTemplates[i].picture.image_href) {
              newBundle.image = srvTemplates[i].picture.image_href;
            }
            bundles.push(newBundle);
          }
        }

        return bundles;
      }

      function matchAtomicServiceItemsToSubTabs(srvTemplates) {
        var subTab;
        var newItem;
        for (var i = 0; i<srvTemplates.length; i++) {
          if (srvTemplates[i].service_type === 'atomic') {
            if (srvTemplates[i].prov_type === 'openstack') {
              subTab = findSubTabByProvType(srvTemplates[i].prov_type);
              if (subTab) {
                addToSubTab(subTab, srvTemplates[i]);
              }
            } else if (srvTemplates[i].prov_type === 'generic') {
              subTab = findSubTabByCatalogName(srvTemplates[i].service_template_catalog.name);
              if (subTab) {
                addToSubTab(subTab, srvTemplates[i]);
              }
            }
          }
        }
      }

      function addToSubTab(subTab, srvTemplate) {
        var newItem = {title: srvTemplate.service_template_catalog.name};
        if (srvTemplate.picture && srvTemplate.picture.image_href) {
          newItem.image = srvTemplate.picture.image_href;
        } else {
          newItem.image = "images/service.png";
        }
        subTab.items.push(newItem);
      }

      function findSubTabByProvType(title) {
        for (var i = 0; i<$scope.tabs.length; i++) {
          for (var s = 0; s<$scope.tabs[i].subtabs.length; s++) {
            if ($scope.tabs[i].subtabs[s].title.toLowerCase() === title.toLowerCase() ) {
              return $scope.tabs[i].subtabs[s];
            }
          }
        }

        return null;
      }

      function findSubTabByCatalogName(catalogName) {
        var firstWordOfCat = catalogName.split(" ")[0];
        for (var i = 0; i<$scope.tabs.length; i++) {
          if ($scope.tabs[i].subtabs) {
            for (var s = 0; s < $scope.tabs[i].subtabs.length; s++) {
              var firstWordOfTab = $scope.tabs[i].subtabs[s].title;
              firstWordOfTab = firstWordOfTab.split(" ")[0];
              if (firstWordOfTab.toLowerCase() === firstWordOfCat.toLowerCase()) {
                return $scope.tabs[i].subtabs[s];
              }
            }
          }
        }

        console.log("Couldn't Find Sub-Tab for service_template: " + catalogName);

        return null;
      }

      $scope.getNewItem = function() {
        var activeTab = $scope.activeTab();
        var activeSubTab = $scope.activeSubTab();

        if (activeTab && !activeSubTab && activeTab.newItem) {
          return activeTab.newItem;
        }

        if (activeTab && activeSubTab && activeSubTab.newItem) {
          return activeSubTab.newItem;
        }

        return {title: 'Item', image: 'assets/images/blueprint-designer/catalogItem.png'};
      };

      $scope.activeTab = function() {
        return $scope.tabs.filter(function(tab) {
          return tab.active;
        })[0];
      };

      $scope.activeSubTab = function() {
        var activeTab = $scope.activeTab();
        if (activeTab && activeTab.subtabs) {
          return activeTab.subtabs.filter(function(subtab) {
            return subtab.active;
          })[0];
        }
      };
    }]);
