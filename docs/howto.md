# How to

## Add A Functional Area
The sum total of the following parts, a left navigation entry point, root/supporting states and root/supporting components
are the core components that make up a functional area.  As of writing, the Service UI, (SUI) contains four functional areas:
* [Dashboard](../client/app/dashboard)
* [My Services](../client/app/services)
* [My Orders](../client/app/requests)
* [Service Catalogs](../client/app/catalogs)

Each functional area has a root resource explorer and a details page corresponding to the listed resource.
This guide will identify each aspect of functional areas and explain the code patterns that make it work.  As a developer
once asked:

> What is the UX term for the "bottom right half of the screen"

It is more than a menu button, more than a navigation item, it is those things *plus* everything that makes what the user
interacts with work.

### Left Navigation (lnav) Entry Point
Each functional area is accessed by clicking on the lnav entry point.

#### Definition
The definition of the services functional area lnav entry point occurs [here](../client/app/core/navigation.config.js#L12):
```
  const services = createItem({
    title: N_('My Services'),
    originalTitle: 'My Services',
    state: 'services',
    iconClass: 'pficon pficon-service',
    badgeTooltip: N_('Total services ordered, both active and retired'),
    originalTooltip: 'Total services ordered, both active and retired',
});
```
Two points of note regarding the lnav definition code above, firstly the `N_` prefix is a [dynamic translation](http://manageiq.org/docs/guides/i18n)
flag. It is essential for the title and tooltip to support internationalization.

Secondly, pay close attention to the object name `services` and the value of the key `state`.  The former is used for setting RBAC
(discussed next) while the ladder is used for routing to the functional area (the state name must correspond directly to
 the state name declared).

#### Role Based Access Control (RBAC)
RBAC gates sui functionality based the roles that are assigned to the users active group. Product features added to roles
control what a user can and can't do within the OPS and SUI.  The lnav respects user's privileges and gates accessibility
of functional areas [here](../client/app/core/rbac.service.js#22).  In the case of the service functional area, we gate
user accessiblity on the product feature `view_service`:
```
services: {show: angular.isDefined(productFeatures.service_view)},
```
Note the key `services` directly corresponds to the above mentioned functional area definition `services`. For RBAC to
operate as desired these two values must directly match.

#### Resource Count Badge
Adding a badge count to a the service lnav item is done [here)(../client/app/core/navigation.config.js#L71):
```
NavCounts.add('services', fetchServices, refreshTimeMs);
```
The `fetchServices` function, declared later in the file, utilizes the `CollectionsApi` service to query the collection
count we wish to display.

### Routing State
Routing states are independent of the component definition and can be found [here](../client/app/states). Each functional
area has a root routing state and a series of supporting states. Supporting states directly correspond to supporting components
of a functional area. For example, you'll notice we have a [services routing state](../client/app/services).  Contained
within this folder are a number of sub-folders including `details` (a supporting state for the service details component)
and `explorer` (a supporting state for the explorer component).

#### Root State
The root state definition occurs in the root state folder, for instance
[services root routing state](../client/app/services/services.state.js). Filename is important here, `services.state.js`
that single word you used to define your functional area lnav should be reused here for the sake of continuity.  In large,
most of the root state definition can be copy and pasted for new functional areas:
```
/** @ngInject */
export function ServicesState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'services': {
      parent: 'application',
      url: '/services',
      redirectTo: 'services.explorer',
      template: '<ui-view></ui-view>',
      params: { filter: null },
    },
  };
}

```
Again, `services`, the key for the root state object is important to align with the lnav key `state`, for when you click
an lnav item you will be directed to the defined state, that we define here.  The `parent` key/value should be left alone,
as should the `template`.  `url` represents the url that will appear when this state has been activated. `redirectTo` is
is the supporting component state to load when the root state is activated, in most cases we redirect to explorer type
supporting components.  The `params` value is an object that contains can contain any contextual information that one
might desire to express in a supporting component, in the case of the services root state, we occasionally pass in default
filter values.

#### Supporting States
Once a root state is defined, any number of supporting states can be defined on it. One such state includes
[services.explorer](../client/app/states/services/explorer/explorer.state.js). The principal function of supporting states
is to server a component and the information it requires. Just as with `services.state.js`, most of the supporting
state definition can be copied verbatim:
```
/** @ngInject */
export function ServicesExplorerState(routerHelper) {
  routerHelper.configureStates(getStates());
}

function getStates() {
  return {
    'services.explorer': {
      url: '',
      template: '<service-explorer/>',
      title: __('Services Explorer'),
    },
  };
}
```
There are minor variations between supporting state definitions.  The following are the hard and fast requirements:
1. Supporting state name, in this case `services.explorer`. This is used for all routing to the state.
2. State url, `url:''`.  In this case, because the root state redirects to this supporting state, we forgo giving the
supporting state a url.
3. Supporting state template, `template: '<service-explorer/>'`. Sometimes seen as `templateUrl` when
the a large template is used, this is the hml that will render in the `<ui-view>` when the supporting state is activated.
Supporting states principally serve as routing mechanisms for components, in this case the root component `<service-explorer>`
4. Supporting state title, as in the title the page will assume when this state is active, is defined by `title: __('Services Explorer')`.
The `__` is a placeholder indicating text to be translated [see here](http://manageiq.org/docs/guides/i18n).

### Functional Component
What a user views and interacts with when activating and manipulating a functional area is in actuality a functional component.
All the other noise is supporting the expression of functional components.  Service lists, catalog explorers, shopping cart,
event notification box, these are each a different functional component. Familiarity with one way binding and
lifecycle hooks is highly encouraged prior to undertaking the authoring of a component.  For more information checkout
this [AngularJS documentation](https://docs.angularjs.org/guide/component).

#### Root Component
Root components are invoked by states (root and supporting) directly, when the supporting state`services.explorer` declares a
template of `<service-explorer/>`, that component becomes a root component. This is in contrast to a suppporting component
which is invoked by a root component rather than a root state. The pagination component when used by each explorer component
[seen here](../client/app/services/service-explorer/service-explorer.html#202) acts as a supporting component.

#### Supporting Components
Components invoked in root components typically from the html.  Examples include `<explorer-pagination>`, `<loading>`, ``<custom-dropdown>``,
and many others. When view logic becomes complex or an opportunity to reduce code redundancy has been identified, a
supporting component should be authored. The fundamental definition of a supporting component is identical to that of a
root component, the only difference beening in the invocation, via a root componet rather than a state.

#### Component Service
Component services make available all resources needed by components, crud operations as they relate to permissions/data,
 persisting user input and other functionality are handled by component services. Segmenting the concerns of data handling
  from manipulation results decreases code duplications, produces cleaner components and increases readability. Once such
  component service includes the [service component service](../client/app/services/services-state.service.js). All
  component services follow the naming convention of `component-name.service.js`.  In addition to a standard naming
  convention service components also follow the same general definition pattern as seen
  [here](../client/app/services/services-state.service.js):
  ```
  /** @ngInject */
  export function ServicesStateFactory(CollectionsApi, RBAC) {
    const permissions = getPermissions();
    const services = {};

    return {
      services: services,
      getService: getService,
      getServiceCredential: getServiceCredential,
      getServiceRepository: getServiceRepository,
      getServiceJobsStdout: getServiceJobsStdout,
      getServices: getServices,
      getServicesMinimal: getServicesMinimal,
      getPermissions: getPermissions,
      getLifeCycleCustomDropdown: getLifeCycleCustomDropdown,
      getPolicyCustomDropdown: getPolicyCustomDropdown,
      getConfigurationCustomDropdown: getConfigurationCustomDropdown,
    };

    function getService(id, { isAutoRefresh, runAutomate }) {
        ...
    }
  }

  ```
The variability of component services is high due to the specialized nature of each. Principal actions that are made
  available on the service include getting a service, getting services, getting a service credential, getting permissions
  and other supporting service actions. Each of these functions is exposed on the service and invoked by the service
  component name then the function name, `ServicesState.getPermissions();`, to be discussed at length in the
  [Component Modules](#ComponentModules) section below.

#### Component Modules
Collections of related components are clustered in a folder, for example `../client/app/services/` holds all functionality
relating to services. Each of these components is included in the app by an entry in the
[services module](../client/app/services/services.module.js) as seen below:
```
import { ConsolesFactory } from './consoles.service.js';
import { CustomButtonComponent } from './custom-button/custom-button.component.js';
import { DetailRevealComponent } from './detail-reveal/detail-reveal.component.js';
import { EditServiceModalComponent } from './edit-service-modal/edit-service-modal.component.js';
import { OwnershipServiceModalComponent } from './ownership-service-modal/ownership-service-modal.component.js';
import { PowerOperationsFactory } from './poweroperations.service.js';
import { ProcessSnapshotsModalComponent } from './process-snapshots-modal/process-snapshots-modal.component';
import { RetireRemoveServiceModalComponent } from './retire-remove-service-modal/retire-remove-service-modal.component.js';
import { RetireServiceModalComponent } from './retire-service-modal/retire-service-modal.component.js';
import { ServiceDetailsAnsibleComponent } from './service-details/service-details-ansible.component';
import { ServiceDetailsAnsibleModalComponent } from './service-details/service-details-ansible-modal.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { ServiceExplorerComponent } from './service-explorer/service-explorer.component.js';
import { ServicesStateFactory } from './services-state.service.js';
import { SharedModule } from '../shared/shared.module.js';
import { UsageGraphsComponent } from './usage-graphs/usage-graphs.component.js';
import { VmDetailsComponent } from './vm-details/vm-details.component';
import { VmSnapshotsComponent } from './vms/snapshots.component';
import { VmsService } from './vms.service.js';

export const ServicesModule = angular
  .module('app.services', [
    SharedModule,
  ])
  .component('customButton', CustomButtonComponent)
  .component('detailReveal', DetailRevealComponent)
  .component('editServiceModal', EditServiceModalComponent)
  .component('ownershipServiceModal', OwnershipServiceModalComponent)
  .component('processSnapshotsModal', ProcessSnapshotsModalComponent)
  .component('retireRemoveServiceModal', RetireRemoveServiceModalComponent)
  .component('retireServiceModal', RetireServiceModalComponent)
  .component('serviceDetails', ServiceDetailsComponent)
  .component('serviceDetailsAnsible', ServiceDetailsAnsibleComponent)
  .component('serviceDetailsAnsibleModal', ServiceDetailsAnsibleModalComponent)
  .component('serviceExplorer', ServiceExplorerComponent)
  .component('usageGraphs', UsageGraphsComponent)
  .component('vmDetails', VmDetailsComponent)
  .component('vmSnapshots', VmSnapshotsComponent)
  .factory('Consoles', ConsolesFactory)
  .factory('PowerOperations', PowerOperationsFactory)
  .factory('ServicesState', ServicesStateFactory)
  .factory('VmsService', VmsService)
  .name;
```
When a new functional area is created a new area module will need to be included in the root [app.module.js](../client/app.module.js).
The services.module.js is defined in this file as follows:
```
import { ServicesModule } from './services/services.module.js';
```
