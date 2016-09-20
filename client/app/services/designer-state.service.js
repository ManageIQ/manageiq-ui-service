(function() {
  'use strict';

  angular.module('app.services')
      .factory('DesignerState', DesignerStateFactory);

  /** @ngInject */
  function DesignerStateFactory($filter, CollectionsApi, $state, sprintf, $q) {
    var designer = {};

    designer.getDesignerToolboxTabs = function(srvTemplates) {
      designer.tabItems = [];
      var toolboxTabs = [
        {
          title: 'Compute',
          subtabs: [
            {
              title: 'Cloud',
              subtabs: [
                {title: 'AWS', prov_type: 'amazon'},
                {title: 'Azure', prov_type: 'azure'},
                {title: 'GCE', prov_type: 'google'},
                {title: 'OpenStack', prov_type: 'openstack'},
              ],
            },
            {
              title: 'Infrastructure',
              subtabs: [
                {title: 'RHEV', prov_type: 'redhat'},
                {title: 'SCVMM', prov_type: 'microsoft'},
                {title: 'VMware', prov_type: 'vmware'},
              ],
            },
            {
              title: 'Generic',
              generic_subtype: 'vm',
              newItem: {
                name: 'Instance',
                type: 'generic',
                generic_subtype: 'vm',
                icon: "pficon-virtual-machine",
                fontFamily: "PatternFlyIcons-webfont",
                fontContent: "\ue90f",
              },
            },
          ],
        },
        {
          preTitle: 'Configuration',
          title: 'Management',
          subtabs: [
            {
              title: 'Generic',
              generic_subtype: 'playbook',
              newItem: {
                name: 'Playbook',
                type: 'generic',
                generic_subtype: 'playbook',
                icon: "pficon-virtual-machine",
                fontFamily: "PatternFlyIcons-webfont",
                fontContent: "\ue90f",
              },
            },
          ],
        },
        {
          title: 'Storage',
          subtabs: [
            {
              title: 'Generic',
              generic_subtype: 'storage'
            },
          ],
        },
        {
          title: 'Network',
          subtabs: [
            {
              title: 'Generic',
              generic_subtype: 'load_balancer'
            },
          ],
        },
        {
          title: 'Bundles',
          active: true,
        },
      ];

      var bundleTabIndex = 4;

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
        if (srvTemplate.service_type === 'atomic') {
          if (srvTemplate.prov_type !== 'generic') {
            subTab = findSubTabByProvType(srvTemplate.prov_type);
            if (!subTab) {
              console.log("Couldn't find toolbox Tab for Prov_Type: " + srvTemplate.prov_type);
            }
          } else if (srvTemplate.generic_subtype) {
            subTab = findSubTabByGenericSubType(srvTemplate.generic_subtype);
            if (!subTab) {
              console.log("Couldn't find toolbox Tab for Generic_Subtype: " + srvTemplate.generic_subtype);
            }
          } else {
            console.log("Error: No generic_subtype for Generic " + srvTemplate.name);
          }
          if (subTab) {
            addToSubTab(subTab, srvTemplate);
          }
        }
      }

      function findSubTabByProvType(provType) {
        var subTab = null;
        for (var i = 0; i < toolboxTabs.length; i++) {
          if (toolboxTabs[i].subtabs) {
            subTab =  matchSubTabs(toolboxTabs[i].subtabs, {prov_type: provType});
          }
          if (subTab) {
            return subTab;
          }
        }
      }

      function findSubTabByGenericSubType(genericSubType) {
        var subTab = null;
        for (var i = 0; i < toolboxTabs.length; i++) {
          if (toolboxTabs[i].subtabs) {
            subTab = matchSubTabs(toolboxTabs[i].subtabs, {generic_subtype: genericSubType});
          }
          if (subTab) {
            return subTab;
          }
        }
      }

      function matchSubTabs(subTabs, matchObj) {
        var subTab = null;

        for (var i = 0; i < subTabs.length; i++) {
          if (subTab) {
            break;
          }
          if (subTabs[i].subtabs) {
            subTab = matchSubTabs(subTabs[i].subtabs, matchObj);
          } else {
            if (matchObj.prov_type && subTabs[i].prov_type) {
              if (subTabs[i].prov_type.toLowerCase() === matchObj.prov_type.toLowerCase()) {
                return subTabs[i];
              }
            } else if (matchObj.generic_subtype && subTabs[i].generic_subtype) {
              if (subTabs[i].generic_subtype.toLowerCase() === matchObj.generic_subtype.toLowerCase()) {
                return subTabs[i];
              }
            }
          }
        }

        return subTab;
      }

      function addToBundleTab(srvTemplate) {
        var newBundle = {
          name: srvTemplate.name,
          id: srvTemplate.id,
          bundle: true,
          icon: "pf pficon-bundle",
          fontFamily: "PatternFlyIcons-webfont",
          fontContent: "\ue918",
        };

        if (srvTemplate.picture && srvTemplate.picture.image_href) {
          newBundle.image = srvTemplate.picture.image_href;
        }

        if (srvTemplate.disableInToolbox !== undefined) {
          newBundle.disableInToolbox = srvTemplate.disableInToolbox;
        }

        var bundleTab = toolboxTabs[bundleTabIndex];
        if (!bundleTab.items) {
          bundleTab.items = [];
        }
        bundleTab.items.push(newBundle);
        designer.tabItems.push(newBundle);
        // console.log("--> Added " + newBundle.name + " to Bundle Tab");
      }

      function addToSubTab(subTab, srvTemplate) {
        var newItem = {name: srvTemplate.name, id: srvTemplate.id};
        if (srvTemplate.picture && srvTemplate.picture.image_href) {
          newItem.image = srvTemplate.picture.image_href;
        } else {
          newItem.image = "images/service.png";
        }
        if (srvTemplate.disableInToolbox !== undefined) {
          newItem.disableInToolbox = srvTemplate.disableInToolbox;
        }
        if (!subTab.items) {
          subTab.items = [];
        }
        subTab.items.push(newItem);
        designer.tabItems.push(newItem);
        // console.log("--> Added " + newItem.name + " to " + subTab.title + " Tab");
      }
    };

    designer.getTabItemById = function(id) {
      var tabItems = $filter('filter')(designer.tabItems, {id: id});

      return tabItems[0];
    };

    return designer;
  }
})();
