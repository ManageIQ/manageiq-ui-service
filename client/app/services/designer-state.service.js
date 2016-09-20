(function() {
  'use strict';

  angular.module('app.services')
    .factory('DesignerState', DesignerStateFactory);

  /** @ngInject */
  function DesignerStateFactory($filter, CollectionsApi, $state, sprintf, $q) {
    var designer = {};

    designer.getDesignerToolboxTabs = function(srvTemplates) {
      var toolboxTabs = [
        {
          preTitle: 'Compute', title: 'Cloud',
          subtabs: [
            {title: 'AWS'},
            {title: 'Azure'},
            {title: 'GCE'},
            {title: 'OpenStack'},
            {
              title: 'Generic',
              newItem: {
                name: 'Instance',
                type: 'generic',
                icon: "pficon-virtual-machine",
                fontFamily: "PatternFlyIcons-webfont",
                fontContent: "\ue90f",
              },
            },
          ],
        },
        {
          preTitle: 'Compute', title: 'Containers',
          subtabs: [
            {title: 'Kubernetes'},
            {title: 'OSE'},
          ],
        },
        {
          preTitle: 'Compute', title: 'Infrastructure',
          subtabs: [
            {title: 'OpenStack'},
            {title: 'RHEV'},
            {title: 'SCVMM'},
            {title: 'VMware'},
            {
              title: 'Generic',
              newItem: {
                name: 'VM',
                type: 'generic',
                icon: "pficon-virtual-machine",
                fontFamily: "PatternFlyIcons-webfont",
                fontContent: "\ue90f",
              },
            },
          ],
        },
        {
          preTitle: 'Configuration', title: 'Management',
          subtabs: [
            {title: 'Ansible'},
            {title: 'Chef'},
            {title: 'Puppet'},
            {title: 'Satellite'},
          ],
        },
        {
          title: 'Storage',
          subtabs: [
            {title: 'NetApp'},
            {title: 'USM'},
          ],
        },
        {
          title: 'Middleware',
          subtabs: [
            {title: 'Hawkular'},
          ],
        },
        {
          title: 'Network',
          subtabs: [
            {title: 'Neutron'},
            {title: 'Nuage'},
            {
              title: 'Generic',
              newItem: {
                name: 'Load Balancer',
                type: 'generic',
                icon: "pficon-network",
                fontFamily: "PatternFlyIcons-webfont",
                fontContent: "\ue909",
              },
            },
          ],
        },
        {
          title: 'Orchestration',
          subtabs: [
            {
              title: 'Azure Stacks',
              subtabs: [
                {title: 'One'},
                {
                  title: 'Two',
                  newItem: {
                    name: 'Generic Two Item',
                    type: 'generic',
                    icon: "pficon-regions",
                    fontFamily: "PatternFlyIcons-webfont",
                    fontContent: "\ue909",
                  }
                }
              ]
            },
            {title: 'CloudFormation'},
            {title: 'Heat Templates'},
          ],
        },
        {
          title: 'Bundles',
          active: true,
        },
      ];

      var bundleTabIndex = 8;

      matchServiceTemplatesToTabs(srvTemplates);

      return toolboxTabs;

      function matchServiceTemplatesToTabs(srvTemplates) {
        for (var i = 0; i < srvTemplates.length; i++) {
          if (srvTemplates[i].service_type === 'composite') {
            addToBundleTab(srvTemplates[i]);
          } else {
            matchAtomicServiceItemToTabs(srvTemplates[i]);
          }
        }
      }

      function matchAtomicServiceItemToTabs(srvTemplate) {
        var subTab;
        var newItem;
        if (srvTemplate.service_type === 'atomic') {
          if (srvTemplate.prov_type !== 'generic') {
            subTab = findSubTabByProvType(srvTemplate.prov_type);
          } else {
            subTab = findSubTabByGenericSubType(srvTemplate.generic_subtype);
          }
          if (subTab) {
            addToSubTab(subTab, srvTemplate);
          }
        }
      }

      function findSubTabByProvType(provType) {
        for (var i = 0; i < toolboxTabs.length; i++) {
          if (toolboxTabs[i].subtabs) {
            for (var s = 0; s < toolboxTabs[i].subtabs.length; s++) {
              if (toolboxTabs[i].subtabs[s].title.toLowerCase() === provType.toLowerCase()) {
                return toolboxTabs[i].subtabs[s];
              }
            }
          }
        }

        console.log("Couldn't Find Designer Toolbox Tab for prov_type: " + provType);

        return null;
      }

      function findSubTabByGenericSubType(genericSubType) {
        for (var i = 0; i < toolboxTabs.length; i++) {
          if (toolboxTabs[i].subtabs) {
            for (var s = 0; s < toolboxTabs[i].subtabs.length; s++) {
              if (toolboxTabs[i].title.toLowerCase() === 'network'
                && toolboxTabs[i].subtabs[s].title.toLowerCase() === 'generic'
                && genericSubType === 'load_balancer') {
                return toolboxTabs[i].subtabs[s];
              }

              if (toolboxTabs[i].preTitle
                && toolboxTabs[i].preTitle.toLowerCase() === 'compute'
                && toolboxTabs[i].title.toLowerCase() === 'infrastructure'
                && toolboxTabs[i].subtabs[s].title.toLowerCase() === 'generic'
                && genericSubType === 'vm') {
                return toolboxTabs[i].subtabs[s];
              }
            }
          }
        }

        // console.log("Couldn't Find Designer Toolbox Tab for generic subtype: " + genericSubType);

        return null;
      }

      function addToBundleTab(srvTemplate) {
        var newBundle = {
          name: srvTemplate.name,
          id: srvTemplate.id,
          bundle: true,
          fontFamily: "FontAwesome",
          fontContent: "\uf06b",
        };

        if (srvTemplate.picture && srvTemplate.picture.image_href) {
          newBundle.image = srvTemplate.picture.image_href;
        }

        var bundleTab = toolboxTabs[bundleTabIndex];
        if (!bundleTab.items) {
          bundleTab.items = [];
        }
        bundleTab.items.push(newBundle);
        // console.log("--> Added " + newBundle.name + " to Bundle Tab");
      }

      function addToSubTab(subTab, srvTemplate) {
        var newItem = {name: srvTemplate.name, id: srvTemplate.id};
        if (srvTemplate.picture && srvTemplate.picture.image_href) {
          newItem.image = srvTemplate.picture.image_href;
        } else {
          newItem.image = "images/service.png";
        }
        if (!subTab.items) {
          subTab.items = [];
        }
        subTab.items.push(newItem);
        // console.log("--> Added " + newItem.name + " to " + subTab.title + " Tab");
      }
    };

    return designer;
  }
})();
