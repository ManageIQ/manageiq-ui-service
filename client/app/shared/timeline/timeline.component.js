import './_timeline.sass';

export const TimelineComponent = {
  bindings: {
    data: '<',
    options: '<',
  },
  controller: TimelineController,
  controllerAs: 'vm',
};

/** @ngInject */
function TimelineController($element, $window) {
  const vm = this;
  const d3 = $window.d3;

  vm.$onChanges = (changes) => {
    vm.data = [{
      "name": "",
      "data": [
        {"date": "", "details": {"event": "", "object": ""}},
      ],
      "display": true,
    }];

    angular.element($element[0]).find('div.timeline').remove();
    const config = buildConfig(changes.options.currentValue ? changes.options.currentValue : vm.options);
    buildTimeline(config, changes.data.currentValue ? changes.data.currentValue : vm.data);
  };

  function buildConfig(options = {}) {
    const hour = 60 * 60 * 1000;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;

    const {
      start = new Date(0),
      end = new Date(),
      minScale = week / month,
      maxScale = week / hour,
      width = 800,
      padding = {top: 30, left: 40, bottom: 40, right: 40},
      lineHeight = 40,
      contextHeight = 50,
      locale = null,
      axisFormat = null,
      tickFormat = [
        ['.%L', (d) => d.getMilliseconds()],
        [':%S', (d) => d.getSeconds()],
        ['%I:%M', (d) => d.getMinutes()],
        ['%I %p', (d) => d.getHours()],
        ['%b %d', (d) => d.getMonth() && d.getDate()],
        ['%b', (d) => d.getMonth()],
        ['%Y', () => true],
      ],
      eventHover = null,
      eventZoom = null,
      eventClick = null,
      eventLineColor = (_d, i) => {
        switch (i % 5) {
          case 0:
            return "#00659c";
          case 1:
            return "#0088ce";
          case 2:
            return "#3f9c35";
          case 3:
            return "#ec7a08";
          case 4:
            return "#cc0000";
        }
      },
      eventColor = null,
      eventShape = (d) => {
        if (d.hasOwnProperty("events")) {
          return '\uf140';
        } else {
          return '\uf111';
        }
      },
      eventPopover = null,
      context = true,
      slider = true,
      eventGrouping = 60000,
    } = options;

    return d3.chart.timeline()
      .start(start)
      .end(end)
      .minScale(minScale)
      .maxScale(maxScale)
      .width(width)
      .padding(padding)
      .lineHeight(lineHeight)
      .contextHeight(contextHeight)
      .locale(locale)
      .axisFormat(axisFormat)
      .tickFormat(tickFormat)
      .eventHover(eventHover)
      .eventZoom(eventZoom)
      .eventClick(eventClick)
      .eventColor(eventColor)
      .eventLineColor(eventLineColor)
      .eventShape(eventShape)
      .eventPopover(eventPopover)
      .context(context)
      .slider(slider)
      .eventGrouping(eventGrouping);
  }

  function buildTimeline(config, data) {
    d3.select($element[0])
      .append('div').attr('class', 'timeline')
      .datum(data)
      .call(config);
  }
}
