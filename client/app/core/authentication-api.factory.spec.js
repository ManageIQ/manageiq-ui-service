describe('Authentication API', function() {
  beforeEach(function() {
    module('app.core');
    bard.inject(this, 'AuthenticationApi', '$http', 'Session', 'Notifications');
  });

  describe('Authentication factory', function() {

    let mockDir = 'tests/mock/authentication-api/';
    const successResponse = readJSON(mockDir + 'success.json');
    let authApiSpy;
    let sessionSpy;
    it('should call auth method', function() {   
        authApiSpy = sinon.stub($http, 'get').returns(Promise.resolve(successResponse));
        AuthenticationApi.login('test','test');
        expect(authApiSpy).to.have.been.calledWith(
        'http://localhost:9876/api/auth?requester_type=ui',{
        'headers': {
            'Authorization': "Basic dGVzdDp0ZXN0",
            'X-Auth-Token': undefined,
            'X-Miq-Group': undefined
	    }});
    });

    it('should Login successfully', function() {
        authApiSpy = sinon.stub($http, 'get').returns(Promise.resolve(successResponse));
       return AuthenticationApi.login('test','test').then(function(data){
        expect(Session.active()).to.eq('81e0fa13cde428f3d0f94a76960abc7f');
       });
    });
  });  
  describe('failure case', function(){
     let mockDir = 'tests/mock/authentication-api/';
     let authApiFailureSpy;
     const errorResponse = readJSON(mockDir + 'failure.json');
     it('should fail Login', function() {
        Session.destroy();
        authApiFailureSpy = sinon.stub($http, 'get').returns(Promise.reject(errorResponse));
        return AuthenticationApi.login('test','test').then(function(data){
            expect(Session.active()).to.eq(false);
        });
    });    
  });
});
