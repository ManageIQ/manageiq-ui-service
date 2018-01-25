/* global $state, readJSON, RBAC, $httpBackend, $controller, CollectionsApi */
/* eslint-disable no-unused-expressions */
describe('State: dashboard', () => {
  const permissions = readJSON('tests/mock/rbac/allPermissions.json')
  beforeEach(() => {
    module('app.core', 'app.states', 'app.orders', 'app.services')
    bard.inject('$location', '$rootScope', '$state', '$templateCache', '$httpBackend', '$q', 'RBAC')
    RBAC.set(permissions)
  })

  beforeEach(() => {
    let d = new Date()
    d.setMinutes(d.getMinutes() + 30)
    d = d.toISOString()
    d = d.substring(0, d.indexOf('.'))

    $httpBackend.whenGET('').respond(200)
  })

  describe('route', () => {
    beforeEach(() => {
      bard.inject('$location', '$rootScope', '$state', '$templateCache')
    })

    it('should work with $state.go', () => {
      $state.go('dashboard')
      expect($state.is('dashboard'))
    })
  })

  describe('controller', () => {
    let controller, dashboardState
    const resolveServicesWithDefinedServiceIds = {}
    const retiredServices = {}
    const resolveNonRetiredServices = {}
    const expiringServices = {}
    const resolveAllRequests = []

    beforeEach(() => {
      bard.inject('$controller', '$log', '$state', '$rootScope', 'CollectionsApi', 'RBAC')

      const controllerResolves = {
        definedServiceIdsServices: resolveServicesWithDefinedServiceIds,
        retiredServices: retiredServices,
        nonRetiredServices: resolveNonRetiredServices,
        expiringServices: expiringServices,
        allRequests: resolveAllRequests
      }
      dashboardState = $state.get('dashboard')
      controller = $controller(dashboardState.controller, controllerResolves)
    })

    it('should be created successfully', () => {
      expect(controller).to.be.defined
    })

    describe('resolveExpiringServices', () => {
      it('makes a query request using the CollectionApi', () => {
        const clock = sinon.useFakeTimers(new Date('2016-01-01').getTime())
        let collectionsApiSpy = sinon.stub(CollectionsApi)

        dashboardState.resolve.expiringServices(collectionsApiSpy, RBAC)

        expect(collectionsApiSpy.query).to.have.been.calledWith('services', {
          hide: 'resources',
          filter: [
            'retired=false',
            'retires_on>2016-01-01T00:00:00.000Z',
            'retires_on<2016-01-31T00:00:00.000Z'
          ]
        })

        clock.restore()
      })
    })
  })
})
