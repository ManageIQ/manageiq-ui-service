# How to

## Add A Functional Zone
[My Services](../client/app/services), [My Orders](../client/app/requests) and [Service Catalogs](../client/app/catalogs)
are each unique functional zones of the Service User Interface (sui).  Each has a root resource explorer and a details
page corresponding to each resource listed.  This guide will identify each aspect of a functional zone and explain the
code patterns that make it work.

### Left Navigation (lnav) Entry Point
Each functional zone is accessed by clicking on the lnav entry point.

#### Definition
The definition of the services functional zone lnav entry point occurs [here](../client/app/core/navigation.config.js#L12):
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
(discussed next) while the ladder is used for routing to the functional zone (the state name must correspond directly to
 the state name declared).

#### Role Based Access Control (RBAC)
RBAC gates sui functionality based the roles that are assigned to the users active group. Product features added to roles
control what a user can and can't do within the OPS and SUI.  The lnav respects user's privileges and gates accessibility
of functional zones [here](../client/app/core/rbac.service.js#22).  In the case of the service functional zone, we gate
user accessiblity on the product feature `view_service`:
```
services: {show: angular.isDefined(productFeatures.service_view)},
```
Note the key `services` directly corresponds to the above mentioned functional zone definition `services`. For RBAC to
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
zone has a root routing state and a series of supporting states. Supporting states directly correspond to supporting components
of a functional zone. For example, you'll notice we have a [services routing state](../client/app/services).  Contained
within this folder are a number of sub-folders including `details` (a supporting state for the service details component)
and `explorer` (a supporting state for the explorer component).

#### Root State
The root state definition occurs in the root state folder, for instance
[services root routing state](../client/app/services/services.state.js). Filename is important here, `services.state.js`
that single word you used to define your functional zone lnav should be reused here for the sake of continuity.  In large,
most of the root state definition can be copy and pasted for new functional zones:
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
What a user views and interacts with when activating and manipulating a functional zone is in actuality a functional component.
All the other noise is supporting the expression of functional components.  Service lists, catalog explorers, shopping cart,
event notification box, these are each a different functional component. Familiarity with one way binding and
lifecycle hooks is highly encouraged prior to undertaking the authoring of a component.  For more information checkout
this [AngularJS documentation](https://docs.angularjs.org/guide/component).

#### Root Component
Root components had states invoking them directly, in this case, when the supporting state`services.explorer` declares a
template of `<service-explorer/>`, that component becomes a root component.

#### Supporting Components
These are components that are used by root components, examples include `<pagination>`, `<loading>`, etc

#### Component Service
Components handel displaying data modifying views, fetching permissions and data persisting are handled by component services.
