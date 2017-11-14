/* global UsageGraphsService */
describe('Service: UsageGraphsFactory', () => {
  let service
  beforeEach(module('app.services', 'app.shared'))
  beforeEach(() => {
    bard.inject('UsageGraphsService')
    service = UsageGraphsService
  })
  it('should allow you to get a charts config', () => {
    const cpuChartConfig = {'units': __('MHz'), 'chartId': 'cpuChart', 'label': __('used')}
    const cpuChart = service.getChartConfig(cpuChartConfig, 100, 200)
    const expectedConfig = {
      'config': {'units': 'MHz', 'chartId': 'cpuChart'},
      'data': {'used': 100, 'total': 200},
      'label': 'used'
    }
    expect(cpuChart).to.eql(expectedConfig)
  })
  it('should convert bytes to gb', () => {
    const gb = service.convertBytestoGb(1073741824)
    expect(gb).to.eq(1.00)
  })
})
