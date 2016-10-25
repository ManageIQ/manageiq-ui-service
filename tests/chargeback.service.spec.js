describe('Chargeback', function() {
  beforeEach(function() {
    module('app.core', 'gettext');
    bard.inject('Chargeback');
  });

  describe('adjustRelativeCost', function() {
    var items = [
      {
        chargeback: {
          used_cost_sum: 4,
        },
      },
      {
        chargeback: {
          used_cost_sum: 1,
        },
      },
      {
        chargeback: {
          used_cost_sum: 3,
        },
      },
      {
        chargeback: {
          used_cost_sum: 2,
        },
      },
      {
        chargeback: {
          used_cost_sum: 0,
        },
      },
    ];

    it('assigns chargeback_relative_cost correctly', function() {
      Chargeback.adjustRelativeCost(items);

      items.forEach(function(item) {
        expect(item).to.have.property('chargeback_relative_cost');
      });

      expect(items[0].chargeback_relative_cost).to.equal('$$$$');
      expect(items[1].chargeback_relative_cost).to.equal('$');
      expect(items[2].chargeback_relative_cost).to.equal('$$$');
      expect(items[3].chargeback_relative_cost).to.equal('$$');
      expect(items[4].chargeback_relative_cost).to.equal('');
    });
  });

  describe('currentReport', function() {
    var item = {
      chargeback: null,
      chargeback_report: {
        results: [
          {
            start_date: '2016-10-01T00:00:00.000Z',
            vm_name: "foo",
            random_used_cost: 123,
          },
          {
            start_date: '2016-10-01T00:00:00.000Z',
            vm_name: "bar",
            random_used_cost: 456,
          },
          {
            start_date: '2016-09-01T00:00:00.000Z',
            vm_name: "bar",
            random_used_cost: 789,
          },
        ],
      },
    };

    it('picks only the latest start_date', function() {
      var report = Chargeback.currentReport(item);

      expect(report.start_date).to.equal('2016-10-01T00:00:00.000Z');
      expect(report.used_cost_sum).to.equal(579);
      expect(report.vms).to.have.length(2);
    });
  });

  describe('processReports', function() {
    var item = {
      chargeback: null,
      chargeback_report: {
        results: [
          {},
          {},
        ],
      },
    };
    var currentReportSpy;

    beforeEach(function() {
      currentReportSpy = sinon.stub(Chargeback, 'currentReport').returns({});
    });

    it('calls currentReport', function() {
      Chargeback.processReports(item);
      expect(currentReportSpy).to.have.been.calledWith(item);
    });

    it('assigns to item.chargeback', function() {
      Chargeback.processReports(item);
      expect(item.chargeback).to.be.a('object');
    });
  });

  describe('reportUsedCost', function() {
    var report = {
      "start_date": "2016-10-01T00:00:00.000Z",
      "display_range": "Oct 2016",
      "vm_name": "ansible",
      "cpu_allocated_cost": 743.9999999999998,
      "cpu_used_metric": 1567.4222693677066,
      "cpu_used_cost": 23323.243368191466,
      "memory_allocated_cost": 0,
      "memory_used_metric": 493.88106349984287,
      "memory_used_cost": 7348.95022487766,
      "disk_io_used_metric": 0,
      "disk_io_used_cost": 0,
      "net_io_used_metric": 1.5441550960835662,
      "net_io_used_cost": 371.9999999999999,
      "storage_allocated_metric": 85899345920,
      "storage_allocated_cost": 0,
      "storage_used_metric": 5971099648,
      "storage_used_cost": 0.011122039794921875,
    };

    it('sums used costs', function() {
      var sum = Chargeback.reportUsedCost(report);
      expect(sum).to.equal(31044.20471510892);
    });
  });
});
