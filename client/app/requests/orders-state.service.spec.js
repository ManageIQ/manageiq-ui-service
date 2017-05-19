describe('Orders state', function() {
const successResponse = {
      message: "Success"
    };
  beforeEach(function() {
    module('app.states', 'app.requests');
    bard.inject('OrdersState','ListConfiguration','ListView', 'RBAC', 'CollectionsApi');
  });

   it('should be able to get permissions', () =>{
      const permissions=OrdersState.getPermissions();
      const expectedPermissions = { approve: false, delete: false, copy: false };
      expect(permissions).to.eql(expectedPermissions);
    });

    it('should be able to get record Counts ', () => {
      const collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse));
      OrdersState.getMinimal();
        expect(collectionsApiSpy).to.have.been.calledWith(
         'service_orders', { auto_refresh: true, filter: ['state=ordered'], hide: 'resources' }
        );
    });

    it('should be able to query for orders and sort results', () => {

      const collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse));
      ListView.createSortField('name', __('Name'), 'alpha');
      OrdersState.setSort({'id':'name', 'title':'Name','sortType':'alpha'}, 'asc');
      OrdersState.getOrders(5, 0, {}, 'name', true, false);

        expect(collectionsApiSpy).to.have.been.calledWith(
          'service_orders',
          {
            auto_refresh: false,
            attributes: [],
            expand: ['resources', 'service_requests'],
            filter: ['state=ordered'],
            limit: 5,
            offset: '0',
            sort_by: 'name',
            sort_options: 'ignore_case',
            sort_order: 'asc'
          }
        );
    });
    it('should be able to query for orders by name filter', () => {
      const collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse));
      const nameFilter = { 
        id: 'name',
        title: 'Name',
        placeholder: 'Filter by Name',
        filterType: 'text',
        value: 'test',
      };
    
      OrdersState.setFilters([nameFilter]);
      OrdersState.getOrders(5, 0, [nameFilter], 'name', true, false);

        expect(collectionsApiSpy).to.have.been.calledWith(
          'service_orders',
          {
            auto_refresh: false,
            attributes: [],
            expand: ['resources', 'service_requests'],
            filter: ['state=ordered',"name='%test%'"],
            limit: 5,
            offset: '0',
            sort_by: 'placed_at',
            sort_options: '',
            sort_order: 'asc'
          }
        );
    });
    it('should be able to query for orders by other filter', () => {
      const collectionsApiSpy = sinon.stub(CollectionsApi, 'query').returns(Promise.resolve(successResponse));
      const idFilter = { 
        id: 'id',
        title: 'Order ID',
        placeholder: 'Filter by ID',
        filterType: 'text',
        value: '12345',
      };
    
      OrdersState.setFilters([idFilter]);
      OrdersState.getOrders(5, 0, [idFilter], 'name', true, false);

        expect(collectionsApiSpy).to.have.been.calledWith(
          'service_orders',
          {
            auto_refresh: false,
            attributes: [],
            expand: ['resources', 'service_requests'],
            filter: ['state=ordered','id=12345'],
            limit: 5,
            offset: '0',
            sort_by: 'placed_at',
            sort_options: '',
            sort_order: 'asc'
          }
        );
    });
});
