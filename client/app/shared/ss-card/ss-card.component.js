import './_ss-card.sass'
import template from './ss-card.html';

export const SSCardComponent = {
  bindings: {
    header: '<',
    subHeader: '<',
    description: '<',
    image: '<'
  },
  controllerAs: 'vm',
  template,
}
