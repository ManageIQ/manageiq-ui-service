describe('TagList component', () => {
  let parentScope, element;

  beforeEach(module('app.shared'));

  beforeEach(inject(($compile, $rootScope) => {
    parentScope = $rootScope.$new();
    parentScope.tags = [
      { categorization: { displayName: 'Location: Chicago' } },
      { categorization: { displayName: 'Service Level: Gold' } },
    ];

    element = angular.element(`
      <tag-list tags="tags"></tag-list>
    `);
    $compile(element)(parentScope);
    parentScope.$digest();
  }));

  it('displays a tag for each tag in the list', () => {
    const numTags = parentScope.tags.length;
    const tags = element[0].querySelectorAll('.label');

    expect(tags.length).to.eq(numTags);
  });
});
