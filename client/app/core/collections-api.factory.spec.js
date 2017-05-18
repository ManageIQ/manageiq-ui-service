describe('Collections API', function() {
    beforeEach(function() {
        module('app.core');
        bard.inject('CollectionsApi', '$http');
    });
    const successResponse = {
     'data':{
            'status': 'success' 
            } 
    };

    it('should allow a query to be run', () => {
      const getSpy = sinon.stub($http, 'get').returns(Promise.resolve(successResponse));
        return CollectionsApi.query('services', '1', {}).then((data) => {
        expect(data).to.eql({'status':'success'});
        });
    });
    it('should allow a get request to be run', () => {
      const getSpy = sinon.stub($http, 'get').returns(Promise.resolve(successResponse));
        return CollectionsApi.get('services', {}).then((data) => {
        expect(data).to.eql({'status':'success'});
        });
    });
    it('should allow a post request to be run', () => {
      const postSpy = sinon.stub($http, 'post').returns(Promise.resolve(successResponse));
        return CollectionsApi.post('services', {}).then((data) => {
        expect(data).to.eql({'status':'success'});
        });
    });
    it('should allow a options request to be run', () => {
      const getSpy = sinon.stub($http, 'get').returns(Promise.resolve(successResponse));
        return CollectionsApi.options('services', {}).then((data) => {
        expect(data).to.eql({'status':'success'});
        });
    });
    it('should allow a delete request to be run', () => {
      const deleteSpy = sinon.stub($http, 'delete').returns(Promise.resolve(successResponse));
        return CollectionsApi.delete('services','1',{}).then((data) => {
        expect(data).to.eql({'status':'success'});
        });
    });
    it('should build up a get request', () => {
        const getSpy = sinon.stub($http, 'get').returns(Promise.resolve(successResponse)); 
        const options = {
            limit: 10,
            offset: 10,
            format_attributes: ['option1','option2']
        }
         CollectionsApi.get('services', '1', options);
         expect(getSpy).to.have.been.calledWith('http://localhost:9876/api/services/1?format_attributes=option1%2Coption2&limit=10&offset=10',{});
    });
});
