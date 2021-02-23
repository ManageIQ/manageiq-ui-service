import './_site-switcher.sass';
import template from './site-switcher.html';

/**
 * @description
 *    Component for showing a site switcher drop down for moving between different UI's.
 *    Settings object example:
 *    ```javascript
 *    {
 *      sites: [{
 *        title: 'Launch Operations UI',
 *        tooltip: 'Launch Operations UI',
 *        iconClass: 'fa-cogs',
 *        url: 'http://www.manageiq.com'
 *      }, {
 *        title: 'Launch Service UI',
 *        tooltip: 'Launch Service UI',
 *        iconClass: 'fa-cog',
 *        url: 'http://www.manageiq.com'
 *      }, {
 *        title: 'Home',
 *        tooltip: 'Home',
 *        iconClass: 'fa-home',
 *        url: 'http://www.manageiq.com'
 *      }]
 *    }
 *    ```
 * @memberof miqStaticAssets
 * @ngdoc component
 * @name miqSiteSwitcher
 * @attr {Array} sites
 *     An array of sites to display in the switcher, tooltip is optional
 *
 * @example
 * <miq-site-switcher sites="sites">
 * </miq-site-switcher>
 */
export const SiteSwitcher = {
  template,
  controllerAs: 'ctrl',
  bindings: {
    sites: '<',
  },
};
