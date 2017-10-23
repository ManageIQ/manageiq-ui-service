/* global $http, CollectionsApi */
describe('Collections API', () => {
  beforeEach(() => {
    module('app.core')
    bard.inject('CollectionsApi', '$http')
  })
  const successResponse = {
    'data': {
      'status': 'success'
    }
  }

  it('should allow a query to be run', (done) => {
    sinon.stub($http, 'get').returns(Promise.resolve(successResponse))
    CollectionsApi.query('services', '1', {}).then((data) => {
      done()

      expect(data).to.eql({'status': 'success'})
    })
  })
  it('should allow a get request to be run', (done) => {
    sinon.stub($http, 'get').returns(Promise.resolve(successResponse))
    CollectionsApi.get('services', {}).then((data) => {
      done()

      expect(data).to.eql({'status': 'success'})
    })
  })
  it('should allow a post request to be run', (done) => {
    sinon.stub($http, 'post').returns(Promise.resolve(successResponse))
    CollectionsApi.post('services', {}).then((data) => {
      done()
      expect(data).to.eql({'status': 'success'})
    })
  })
  it('should allow a delete request to be run', (done) => {
    sinon.stub($http, 'delete').returns(Promise.resolve(successResponse))
    CollectionsApi.delete('services', '1', {}).then((data) => {
      done()

      expect(data).to.eql({'status': 'success'})
    })
  })
  it('should build up a delete request with id', (done) => {
    const getSpy = sinon.stub($http, 'delete').returns(Promise.resolve(successResponse))
    const options = {auto_refresh: true}
    CollectionsApi.delete('services', '101', options)
    done()

    expect(getSpy.getCall(0).args[0]).to.eq('http://localhost:9876/api/services/101')
  })
  it('should build up a delete request without id', (done) => {
    const getSpy = sinon.stub($http, 'delete').returns(Promise.resolve(successResponse))
    CollectionsApi.delete('services')
    done()

    expect(getSpy.getCall(0).args[0]).to.eq('http://localhost:9876/api/services/')
  })
  it('should build up a get request', (done) => {
    const getSpy = sinon.stub($http, 'get').returns(Promise.resolve(successResponse))
    const options = {
      limit: 10,
      offset: 10,
      format_attributes: ['option1', 'option2']
    }
    CollectionsApi.get('services', '1', options)
    done()

    expect(getSpy).to.have.been.calledWith('http://localhost:9876/api/services/1?limit=10&offset=10&format_attributes=option1%2Coption2')
  })
})
