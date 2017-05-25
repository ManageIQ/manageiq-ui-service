describe('Usage Graph Service', () => {
      let service;
      beforeEach(module('app.services','app.shared'));
      beforeEach( () => {
          bard.inject('UsageGraphsService');
          service = UsageGraphsService;
      });
      it('should allow you to get CPU config chart' ,() => {
        const cpuChart = service.cpuChartConfig(100,200);
        const expectedConfig = {'config':{'units': 'MHz'}, 'data': {'used': 100, 'total': 200}, 'label': 'used'};
        expect(cpuChart).to.eql(expectedConfig);
      });
      it('should allow you to get Memory config chart' ,() => {
        const memoryChart = service.memoryChartConfig(100,200);
        const expectedConfig = {'config':{'units': 'GB','chartId': 'memoryChart'}, 'data': {'used': 100, 'total': 200}, 'label': 'used'};
        expect(memoryChart).to.eql(expectedConfig);
      });
      it('should allow you to get Storage config chart' ,() => {
        const storageChart = service.storageChartConfig(100,200);
        const expectedConfig = {'config':{'units': 'GB','chartId': 'storageChart',}, 'data': {'used': 100, 'total': 200}, 'label': 'used'};
        expect(storageChart).to.eql(expectedConfig);
      });
      it('should convert bytes to gb', () =>{
        const gb = service.convertBytestoGb(1073741824);
        expect (gb).to.eq('1.00');
      });
});
