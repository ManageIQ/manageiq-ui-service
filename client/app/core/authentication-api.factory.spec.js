/* global readJSON, $http, AuthenticationApi, Session */
describe('Authentication API', () => {
  beforeEach(() => {
    module('app.core')
    bard.inject(this, 'AuthenticationApi', '$http', 'Session', 'Notifications')
  })

  describe('Authentication factory', () => {
    let mockDir = 'tests/mock/authentication-api/'
    const successResponse = readJSON(mockDir + 'success.json')
    let authApiSpy

    it('should call auth method', (done) => {
      authApiSpy = sinon.stub($http, 'get').returns(Promise.resolve(successResponse))
      AuthenticationApi.login('test', 'test')
      done()

      expect(authApiSpy).to.have.been.calledWith(
        'http://localhost:9876/api/auth?requester_type=ui', {
          'headers': {
            'Authorization': 'Basic dGVzdDp0ZXN0',
            'X-Auth-Token': undefined
          }
        })
    })

    it('should Login successfully', (done) => {
      authApiSpy = sinon.stub($http, 'get').returns(Promise.resolve(successResponse))
      AuthenticationApi.login('test', 'test').then(function (data) {
        done()

        expect(Session.active()).to.eq('81e0fa13cde428f3d0f94a76960abc7f')
      })
    })
  })

  describe('failure case', () => {
    let mockDir = 'tests/mock/authentication-api/'
    const errorResponse = readJSON(mockDir + 'failure.json')

    it('should fail Login', () => {
      Session.destroy()
      sinon.stub($http, 'get').returns(Promise.reject(errorResponse))

      return AuthenticationApi.login('test', 'test')
        .then(() => expect(false).to.eq(true)) // login didn't fail if the promise succeeds
        .catch(() => expect(Session.active()).to.eq(false));
    })
  })
})
