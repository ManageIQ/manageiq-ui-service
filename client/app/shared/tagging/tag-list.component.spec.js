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
      <tag-list tags="tags" dismissible="dismissible"></tag-list>
    `);
    $compile(element)(parentScope);
    parentScope.$digest();
  }));

  it('displays a tag for each tag in the list', () => {
    const numTags = parentScope.tags.length;
    const tags = element[0].querySelectorAll('.tag-list__tag');

    expect(tags.length).to.eq(numTags);
  });

  it('displays icons to dismiss tags when the list is dismissible', () => {
    parentScope.dismissible = true;
    parentScope.$digest();

    const numTags = parentScope.tags.length;
    const icons = element[0].querySelectorAll('.tag-list__dismiss-icon');

    expect(icons.length).to.eq(numTags);
  });

  it('displays a default message when there are no tags provided', () => {
    parentScope.tags = [];
    parentScope.$digest();

    const text = findIn(element, '.tag-list__empty-state').text();

    expect(text).to.eq('There are no tags for this item.');
  });

  it('emits a "tag.dismissed" event when dismissible tag is clicked', () => {
    const spy = sinon.spy();
    parentScope.$on('tag.dismissed', spy);
    parentScope.dismissible = true;
    parentScope.$digest();

    const dismissIcon = findIn(element, '.pficon-close');
    dismissIcon.triggerHandler('click');

    expect(spy).to.have.been.calledWith(sinon.match.any);
  });
});
