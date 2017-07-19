import './_timeline.sass';

export const TimelineComponent = {
  bindings: {
    data: '=',
    options: '<?',
  },
  controller: TimelineController,
  controllerAs: 'vm',
};

/** @ngInject */
function TimelineController($element, $window) {
  const vm = this;
  const d3 = $window.d3;

  vm.$onInit = function() {
    const {
      start = new Date(0),
      end = new Date(),
      minScale = 0,
      maxScale = Infinity,
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
      eventPopover = (d) => {
        let popover = '';
        if (d.hasOwnProperty("events")) {
          popover = `Group of ${d.events.length} events`;
        } else {
          for (const i in d.details) {
            popover = popover + i.charAt(0).toUpperCase() + i.slice(1) + ': ' + d.details[i] + '<br>';
          }
          popover = popover + 'Date: ' + d.date;
        }

        return popover;
      },
      context = true,
      slider = true,
      eventGrouping = 60000,
    } = vm.options;

    const timelineChart = d3.chart.timeline()
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

    d3.select($element[0])
      .append('div').attr('class', 'timeline')
      .datum(vm.data)
      .call(timelineChart);
  };
}
