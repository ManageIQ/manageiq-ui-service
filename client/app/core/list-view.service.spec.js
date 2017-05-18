describe('ListView Service ', function() {
  beforeEach(function() {
    module('app.core','app.requests');
    bard.inject('OrdersState', 'ListView');
  });
  it('should be able to apply filters', () => {
    const filters = [
        {
            'id': 'name',
            'title': 'Name',
            'value': 'test'
        }
    ];
    const orders = [
        {
            'name': 'test 1'
        }
    ];
    const sampleMatchFilter = function (item, filter) {
    if (filter.id === 'name') {
      return item.name.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
    } else if (filter.id === 'id') {
      return String(item.id).toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
    } else if (filter.id === 'placed_at') {
      return $filter('date')(item.placed_at || item.updated_at).toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
    }

    return false;
  };
    
   const filteredList = ListView.applyFilters(filters, orders, orders, OrdersState,sampleMatchFilter );
   expect(filteredList).to.eql(orders);
  });

  it('should return original list of items if no filter is applied', () =>{
      const orders = [
        {
            'name': 'test 1'
        }
    ];
    const sampleMatchFilter = function (item, filter) {
    return false;
  };
    
   const filteredList = ListView.applyFilters([], orders, orders, OrdersState,sampleMatchFilter );
   expect(filteredList).to.have.lengthOf(1);
  });
  it('should allow you to create a filter field', () => {
      const id = 'name';
      const title = 'Name';
      const placeholder = 'Filter by Name';
      const filterType = 'text';

      const expectedFilter = {
          'id': id,
          'title': title,
          'placeholder': placeholder,
          'filterType': filterType,
          'filterValues': '',
      }
      const createdFilter = ListView.createFilterField(id, title, placeholder, filterType, '');
      expect(createdFilter).to.eql(expectedFilter);
  });
  it('should allow you to create a sort field', () => {
    //'name', __('Name'), 'alpha'
    const id = 'name';
    const title = 'Name';
    const sortType = 'alpha';
    const expectedSortField = {
      'id': id,
      'title': title,
      'sortType': sortType,
    };
    const createdFilter = ListView.createSortField(id, title, sortType);
    expect(createdFilter).to.eql(expectedSortField);
  });
});
