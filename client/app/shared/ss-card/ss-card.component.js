import './_ss-card.sass';
import templateUrl from './ss-card.html';

export const SSCardComponent = {
  bindings: {
    header: '<',
    description: '<',
    image: '<',
  },
  templateUrl,
};
