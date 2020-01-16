/* global $rootScope, $compile */
describe('SiteSwitcher test', () => {
  const sites = [{
    title: 'Launch Operations UI',
    tooltip: 'Launch Operations UI',
    iconClass: 'fa-cogs',
    url: 'http://www.google.com'
  }, {
    title: 'Launch Service UI',
    tooltip: 'Launch Service UI',
    iconClass: 'fa-cog',
    url: 'http://www.cnn.com'
  }, {
    title: 'Home',
    tooltip: 'Home',
    iconClass: 'fa-home',
    url: 'http://www.redhat.com'
  }];

  describe('component', () => {
    let scope, compile, compiledElement;
    beforeEach(() => {
      module('app.core', []);
      bard.inject('$rootScope', '$compile');
      scope = $rootScope.$new();
      compile = $compile;

      scope.sites = sites;
      compiledElement = compile(
        angular.element(
          `<miq-site-switcher site="sites">
              </miq-site-switcher>`
        ))(scope);
      scope.$digest();
    });

    it('creates site switcher with embedded hrefs', () => {
      let header = compiledElement[0].querySelector('.miq-siteswitcher');
      expect(header).toBeDefined();
      expect(header.querySelectorAll('.miq-siteswitcher-icon').length).toBe(1);
    });
  });
});
