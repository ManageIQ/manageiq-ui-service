export const TimelineComponent = {
  bindings: {
    data: '=',
    options: '<?',
  },
  controller: TimelineController,
  controllerAs: 'vm',
};

/** @ngInject */
function TimelineController($element) {
  const vm = this;
  vm.$onInit = activate;

  function activate() {
    var timelineChart = d3.chart.timeline()
      .width(600);
      // .context(false);
    // .slider(false)


    d3.select($element[0])
      .datum(vm.data)
      .call(timelineChart);
  }

  // Private functions
}
