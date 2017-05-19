describe('Shopping cart service', function() {
 beforeEach(function() {
    module('app.core');
    bard.inject('ShoppingCart','RBAC','$http','CollectionsApi');
  });
  it('should allow you to add an item to cart', () => {
   // const postSpy = sinon.spy(CollectionsApi, 'post');
    const successResponse = {
        'results':[
            {
             'service_request_id':'1',
             'success': true,
             'message': 'added to cart'
            }
        ]
    };
    const postSpy = sinon.stub(CollectionsApi,'post').returns(Promise.resolve(successResponse));
    const item = {'description':'Deploy RHEL7 with PostgreSQL','data':{'service_template_href':'/api/service_templates/10000000000004','vm_name':'changeme','limit':'1','param_postgresql_databases':"[{'name': 'database'}]",'param_postgresql_users':"[{'name': 'test','password': 'test'}]"}};
    ShoppingCart.add(item);
    const expectedPostParameter = {
          action: "add",
	  resources: [
          item.data
      ]
    };
    expect(postSpy).to.have.been.calledWith('service_orders/cart/service_requests', null, null, expectedPostParameter);
  });

  describe('basic cart functions', () => {
     beforeEach(function() {
       // ShoppingCart.state = [{"description":"Deploy RHEL7 with PostgreSQL","data":{"service_template_href":"/api/service_templates/10000000000004","vm_name":"changeme","limit":"1","param_postgresql_databases":"[{'name': 'database'}]","param_postgresql_users":"[{'name': 'test','password': 'test'}]"}}];
    });
    it('should allow a cart item to be reset ', () => {
       const successResponse = {'status':'success'};
       const postSpy = sinon.stub(CollectionsApi,'post').returns(Promise.resolve(successResponse));
       ShoppingCart.reset();
       expect(postSpy).to.have.been.calledWith('service_orders', 'cart', null, { action: 'clear' });
      postSpy.restore();
      // console.log(ShoppingCart.state);
    });
    it('should allow a cart to be deleted ', () => {
       const successResponse = {'status':'success'};
       const deleteSpy = sinon.stub(CollectionsApi,'delete').returns(Promise.resolve(successResponse));
       ShoppingCart.delete();
       expect(deleteSpy).to.have.been.calledWith('service_orders', 'cart', null);
    });
    it('should allow a cart to be reloaded ', () => {
       const successResponse = {'status':'success'};
       const itemsSpy = sinon.stub(CollectionsApi,'query').returns(Promise.resolve(successResponse));
       ShoppingCart.reload();
       expect(itemsSpy).to.have.been.calledWith('service_orders/cart/service_requests', { expand: 'resources' });
    });
    it('should allow a cart to allow items to be counted', () =>{
        const successfulAddResponse = {
            'results': [
                {
                'service_request_id':'1',
                'success': true,
                'message': 'added to cart',
                }
            ]
        };
        const postSpy = sinon.stub(CollectionsApi,'post').returns(Promise.resolve(successfulAddResponse));
        const item = {'description':'Deploy RHEL7 with PostgreSQL','data':{'service_template_href':'/api/service_templates/10000000000004','vm_name':'changeme','limit':'1','param_postgresql_databases':"[{'name': 'database'}]",'param_postgresql_users':"[{'name': 'test','password': 'test'}]"}};
        return ShoppingCart.add(item).then((data)=>{
            const count = ShoppingCart.count();
            expect(count).to.eq(1);
        });
    });
    it('should successfully allow an item to be removed from the cart', () => {
       const successResponse = {
           'results':[
            {
             'service_request_id':'1',
             'success': true,
             'message': 'removed from cart'
            }
        ]
       };
       const postSpy = sinon.stub(CollectionsApi,'post').returns(Promise.resolve(successResponse));
        ShoppingCart.removeItem({'id':'1'});
        expect(postSpy).to.have.been.calledWith('service_orders/cart/service_requests', null, null, { action: 'remove', resources: [{ id: '1' }] });
    });
    it('should fail when an item is removed from the cart unsuccessfully', () => {
       const successResponse = {
           'results':[
            {
             'service_request_id':'1',
             'success': false,
             'message': 'failed'
            }
        ]
       };
       const postSpy = sinon.stub(CollectionsApi,'post').returns(Promise.resolve(successResponse));
          return ShoppingCart.removeItem({'id':'1'}).should.be.rejectedWith('failed')
    });
    it('should allow a shopping cart to be submitted', () => {
        const postSpy = sinon.spy(CollectionsApi, 'post');
        ShoppingCart.submit();
        expect(postSpy).to.have.been.calledWith('service_orders', 'cart', null, { action: 'order' });
    });
    it('should check to see if the user has permission to cart', () => {
        const RBACSpy = sinon.stub(RBAC,'has').returns(true);
        const isShoppingAllowed = ShoppingCart.allowed();
        expect(isShoppingAllowed).to.eq(true);
    });
    it('should check for a duplicate cart item and not find one', () => {
       const item = {'description':'Deploy RHEL7 with PostgreSQL','data':{'service_template_href':'/api/service_templates/10000000000004','vm_name':'changeme','limit':'1','param_postgresql_databases':"[{'name': 'database'}]",'param_postgresql_users':"[{'name': 'test','password': 'test'}]"}};
       const isDuplicate = ShoppingCart.isDuplicate(item);
       expect(isDuplicate).to.be.false;
    });
    it('should check for a duplicate cart item and find one', () => {
       const item = {'description':'Deploy RHEL7 with PostgreSQL','data':{'service_template_href':'/api/service_templates/10000000000004','vm_name':'changeme','limit':'1','param_postgresql_databases':"[{'name': 'database'}]",'param_postgresql_users':"[{'name': 'test','password': 'test'}]"}};
       const successfulAddResponse = {
            'results': [
                {
                'service_request_id':'1',
                'success': true,
                'message': 'added to cart',
                }
            ]
        };
        const postSpy = sinon.stub(CollectionsApi,'post').returns(Promise.resolve(successfulAddResponse));

        return ShoppingCart.add(item).then((data)=>{
            const isDuplicate = ShoppingCart.isDuplicate(item.data);
            expect(isDuplicate).to.be.true;
        });
    });

  });

});
