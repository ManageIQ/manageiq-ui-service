describe('Usage Graph component', () => {
  let parentScope, element;

  beforeEach(module('app.services','app.shared'));

  beforeEach(inject(($compile, $rootScope, $state, CollectionsApi) => {
    parentScope = $rootScope.$new();
    parentScope.charts = {
        cpuChart: {
            config: {
                units: 'mhz',
            },
            data: {
                'used': '1000',
                'total': '2000',
            },
            label: 'used',
        },
        memoryChart: {
            config: {
                units: 'GB',
            },
            data: {
                'used': '2',
                'total': '8',
            },
            label: 'used',
        },
        storageChart: {
            config: {
                units: 'GB',
            },
            data: {
                'used': '2',
                'total': '40',
            },
            label: 'used',
            chartId: 'storageChart'
        }
    };

    element = angular.element(`
      <usage-graphs cpu-chart="charts.cpuChart" memory-chart="charts.memoryChart" storage-chart="charts.storageChart"></usage-graphs>
    `);
    $compile(element)(parentScope);
    parentScope.$digest();
  }));

  it('displays 3 Graphs', () => {
    const graphs = element[0].querySelectorAll('pf-donut-pct-chart');
    expect(graphs.length).to.eq(3);
  });
  it('Chart availble values match', () => {
     const graphs = element[0].querySelectorAll('.metric-number');
        expect(graphs[0].innerHTML).to.eq("1000");
        expect(graphs[1].innerHTML).to.eq("6");
        expect(graphs[2].innerHTML).to.eq("38");
  })
});
