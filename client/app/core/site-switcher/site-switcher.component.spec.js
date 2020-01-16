/* global $rootScope, $compile */
describe('SiteSwitcher test', () => {
  let scope, compile, compiledElement;

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

  beforeEach(() => {
    module('app.core');
    bard.inject('$rootScope', '$compile');

    scope = $rootScope.$new();
    compile = $compile;

    scope.sites = sites;

    const element = angular.element('<miq-site-switcher site="sites"></miq-site-switcher>');
    compiledElement = compile(element)(scope);

    scope.$digest();
  });

  it('creates site switcher with embedded hrefs', () => {
    let header = compiledElement[0].querySelector('.miq-siteswitcher');
    expect(header).to.not.be.empty
    expect(header.querySelectorAll('.miq-siteswitcher-icon').length).to.be.eq(1);
  });
});
