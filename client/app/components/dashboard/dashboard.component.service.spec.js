/* global , CollectionsApi, DashboardService */
describe('Service: DashboardService', () => {
  let clock

  beforeEach(() => {
    module('app.core', 'app.components')
    bard.inject('DashboardService', 'CollectionsApi')
    clock = sinon.useFakeTimers(new Date('2016-01-01').getTime())
  })
  const successResponse = {
    message: 'Success'
  }
  afterEach(() => { clock.restore() })

  it('should query for services', () => {
    let d = new Date()
    d.setMinutes(d.getMinutes() + 30)
    d = d.toISOString()
    d = d.substring(0, d.indexOf('.'))
    let collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse))
    DashboardService.allServices()
    expect(collectionsApiSpy.getCall(2).args).to.eql(['services', {
      hide: 'resources',
      filter: [
        'retired=false',
        'retires_on>2016-01-01T00:00:00.000Z',
        'retires_on<2016-01-31T00:00:00.000Z',
        'visible=true'
      ]
    }]
    )
  })

  it('should query for requests', () => {
    let collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse))
    DashboardService.allRequests()
    expect(collectionsApiSpy.getCall(3).args).to.eql(['requests', {
      filter: ['type=ServiceReconfigureRequest', 'approval_state=approved'],
      hide: 'resources'
    }
    ])
  })
})
