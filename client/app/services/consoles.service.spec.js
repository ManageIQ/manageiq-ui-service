/* global CollectionsApi, Consoles, EventNotifications, $timeout */
describe('Service: ConsolesFactory', function () {
  beforeEach(function () {
    module('app.services')
    bard.inject('Consoles', '$http', 'CollectionsApi', 'EventNotifications', '$timeout', '$window')
  })
  const successResponse = {
    'success': true,
    'message': 'launching console',
    'task_id': '1'
  }

  it('should try and open up a console', (done) => {
    const collectionsApiSpy = sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse))
    const requestOptions = {action: 'request_console', resource: {protocol: 'html5'}}
    Consoles.open('12345')
    done()

    expect(collectionsApiSpy).to.have.been.calledWith('vms', '12345', {}, requestOptions)
  })

  it('should give an error if it failed but has a 200 status code', (done) => {
    const failureResponse = {
      'message': 'failed'
    }
    const eventNotificationsFailureSpy = sinon.spy(EventNotifications, 'error')
    sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(failureResponse))
    Consoles.open('12345').then((data) => {
      done()

      expect(eventNotificationsFailureSpy).to.have.been.calledWith('There was an error opening the console. failed')
    })
  })
  it('should give a success notification if it was called and was successful', (done) => {
    sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse))
    const eventNotificationsSpy = sinon.spy(EventNotifications, 'info')
    Consoles.open('12345').then((data) => {
      done()

      expect(eventNotificationsSpy).to.have.been.calledWith('Waiting for the console to become ready. ', 'launching console')
    })
  })

  it('should successfully start a spice session', function (done) {
    const taskResponse = {
      'state': 'Finished',
      'status': 'Ok',
      'task_results': {
        'proto': 'spice',
        'url': 'blah',
        'secret': 'blah'
      }
    }
    sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse))
    const collectionsApiGetSpy = sinon.stub(CollectionsApi, 'get').returns(Promise.resolve(taskResponse))
    Consoles.open('12345').then((data) => {
      $timeout.flush()
      done()

      expect(collectionsApiGetSpy).to.have.been.calledWith('tasks', '1', {attributes: 'task_results'})
    })
  })
  it('should successfully start a vnc session', function (done) {
    const taskResponse = {
      'state': 'Finished',
      'status': 'Ok',
      'task_results': {
        'proto': 'vnc',
        'url': 'blah',
        'secret': 'blah'
      }
    }
    sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse))
    const collectionsApiGetSpy = sinon.stub(CollectionsApi, 'get').returns(Promise.resolve(taskResponse))
    Consoles.open('12345').then((data) => {
      $timeout.flush()
      done()

      expect(collectionsApiGetSpy).to.have.been.calledWith('tasks', '1', {attributes: 'task_results'})
    })
  })
  it('should successfully start a native session', function(done) {
    const taskResponse = {
      'state': 'Finished',
      'status': 'Ok',
      'task_results': {
        'proto': 'native',
        'connection': 'blah',
        'name': 'blah',
        'type': 'blah'
      }
    }
    sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse))
    const collectionsApiGetSpy = sinon.stub(CollectionsApi, 'get').returns(Promise.resolve(taskResponse))
    Consoles.open('12345').then((data) => {
      $timeout.flush()
      done()

      expect(collectionsApiGetSpy).to.have.been.calledWith('tasks', '1', {attributes: 'task_results'})
    })
  }) 
  it('should successfully start a remote session', function (done) {
    const taskResponse = {
      'state': 'Finished',
      'status': 'Ok',
      'task_results': {
        'proto': 'remote',
        'remote_url': 'blah'
      }
    }
    sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse))
    const collectionsApiGetSpy = sinon.stub(CollectionsApi, 'get').returns(Promise.resolve(taskResponse))
    Consoles.open('12345').then((data) => {
      $timeout.flush()
      done()

      expect(collectionsApiGetSpy).to.have.been.calledWith('tasks', '1', {attributes: 'task_results'})
    })
  })
  it('should fail if a unknown protocol is sent', function (done) {
    const taskResponse = {
      'state': 'Finished',
      'status': 'Ok',
      'task_results': {
        'proto': 'fds',
        'remote_url': 'blah'
      }
    }
    sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse))
    const collectionsApiGetSpy = sinon.stub(CollectionsApi, 'get').returns(Promise.resolve(taskResponse))
    sinon.spy(EventNotifications, 'error')
    Consoles.open('12345').then((data) => {
      $timeout.flush()
      done()

      expect(collectionsApiGetSpy).to.have.been.calledWith('tasks', '1', {attributes: 'task_results'})
    })
  })
  it('should rerun if state is queued', function (done) {
    const taskResponse = {
      'id': '1',
      'state': 'Queued',
      'status': 'Ok',
      'task_results': {
        'proto': 'fds',
        'remote_url': 'blah'
      }
    }
    sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse))
    const collectionsApiGetSpy = sinon.stub(CollectionsApi, 'get').returns(Promise.resolve(taskResponse))
    sinon.spy(EventNotifications, 'error')
    Consoles.open('12345').then((data) => {
      $timeout.flush()
      done()

      expect(collectionsApiGetSpy).to.have.been.calledWith('tasks', '1', {attributes: 'task_results'})
    })
  })
  it('should throw an error if task fails', function (done) {
    const taskResponse = {
      'id': '1',
      'state': 'Queued',
      'status': 'failed',
      'task_results': {
        'proto': 'fds',
        'remote_url': 'blah'
      }
    }
    sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse))
    const collectionsApiGetSpy = sinon.stub(CollectionsApi, 'get').returns(Promise.resolve(taskResponse))
    sinon.spy(EventNotifications, 'error')
    Consoles.open('12345').then((data) => {
      $timeout.flush()
      done()
      expect(collectionsApiGetSpy).to.have.been.calledWith('tasks', '1', {attributes: 'task_results'})
    })
  })
})
