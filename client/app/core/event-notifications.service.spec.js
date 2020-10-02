/* global readJSON, RBAC, EventNotifications, CollectionsApi */
/* eslint-disable no-unused-expressions */
describe('Event Notifications Service', () => {
  const permissions = readJSON('tests/mock/rbac/allPermissions.json')

  beforeEach(() => {
    module('app.core')
    bard.inject('CollectionsApi', 'EventNotifications', 'RBAC')
    EventNotifications.setToastDisplay(true)
    RBAC.set(permissions)
  })
  const successResponse = {}
  it('should allow a batch of notifications to be added', () => {
    const successSpy = sinon.spy(EventNotifications, 'success')
    const failureSpy = sinon.spy(EventNotifications, 'error')
    const events = [
      {
        success: true,
        message: 'it works'
      },
      {
        success: false,
        message: 'it fails'
      }
    ]
    EventNotifications.batch(events)
    expect(successSpy).to.have.been.called
    expect(failureSpy).to.have.been.called
  })
  it('should allow for a message to be displayed for more than 6 notifications', () => {
    const infoSpy = sinon.spy(EventNotifications, 'info')
    const events = [
      {success: true, message: 'it works'},
      {success: false, message: 'it fails'},
      {success: true, message: 'it works'},
      {success: false, message: 'it fails'},
      {success: true, message: 'it works'},
      {success: false, message: 'it fails'},
      {success: true, message: 'it works'},
      {success: false, message: 'it fails'}
    ]
    EventNotifications.batch(events)
    expect(infoSpy).to.have.been.called
  })
  it('should allow for warning messages to be created', () => {
    EventNotifications.warn('warning message', {persistent: true})
    const notificationsState = EventNotifications.state()
    expect(notificationsState.toastNotifications).to.have.lengthOf(1)
    const warningMessage = notificationsState.toastNotifications[0]
    expect(warningMessage.message).to.eq('warning message')
  })
  it('should allow for Info messages to be created', () => {
    const sampleMessage = 'Info Message'
    EventNotifications.info(sampleMessage, {persistent: true}, 1)
    const notificationsState = EventNotifications.state()
    expect(notificationsState.toastNotifications).to.have.lengthOf(1)
    const infoMessage = notificationsState.toastNotifications[0]
    expect(infoMessage.message).to.eq(sampleMessage)
  })
  it('should allow for Success messages to be created', () => {
    const sampleMessage = 'Success Message'
    EventNotifications.success(sampleMessage, {persistent: true}, 1)
    const notificationsState = EventNotifications.state()
    expect(notificationsState.toastNotifications).to.have.lengthOf(1)
    const successMessage = notificationsState.toastNotifications[0]
    expect(successMessage.message).to.eq(sampleMessage)
  })
  it('should allow for Error messages to be created', () => {
    const sampleMessage = 'Error Message'
    EventNotifications.error(sampleMessage, {persistent: true}, 1, true)
    const notificationsState = EventNotifications.state()
    expect(notificationsState.toastNotifications).to.have.lengthOf(1)
    const errorMessage = notificationsState.toastNotifications[0]
    expect(errorMessage.message).to.eq(sampleMessage)
  })
  describe('Marking messsages as read and unread', () => {
    const warningGroupIndex = 3
    let notificationsState = {}
    let warningGroup = {}
    beforeEach(() => {
      EventNotifications.warn('warning message', {persistent: false, unread: true}, 1)
      notificationsState = EventNotifications.state()
      warningGroup = notificationsState.groups[warningGroupIndex]
    })
    it('should allow for message to be marked as read', () => {
      EventNotifications.markRead(warningGroup.notifications[0], warningGroup)
      const currentNotificationsState = EventNotifications.state()
      const currentWarningGroupStatus = currentNotificationsState.groups[warningGroupIndex]
      expect(currentWarningGroupStatus.unreadCount).to.eq(0)
      expect(currentWarningGroupStatus.notifications.length).to.eq(1)
    })
    it('should allow for message to be marked as Unread', () => {
      EventNotifications.markUnread(warningGroup.notifications[0], warningGroup)
      const currentNotificationsState = EventNotifications.state()
      const currentWarningGroupStatus = currentNotificationsState.groups[warningGroupIndex]
      expect(currentWarningGroupStatus.unreadCount).to.eq(1)
    })
    it('should allow all messages for a group to be marked as read', (done) => {
      sinon.stub(CollectionsApi, 'post').returns(Promise.resolve(successResponse))
      EventNotifications.markAllRead(warningGroup)
      const currentNotificationsState = EventNotifications.state()
      const currentWarningGroupStatus = currentNotificationsState.groups[warningGroupIndex]
      done()

      expect(currentWarningGroupStatus.unreadCount).to.eq(0)
    })
    it('should allow all messages for a group to be marked as Unread', () => {
      EventNotifications.markAllRead(warningGroup)
      EventNotifications.markAllUnread(warningGroup)
      const currentNotificationsState = EventNotifications.state()
      const currentWarningGroupStatus = currentNotificationsState.groups[warningGroupIndex]
      expect(currentWarningGroupStatus.unreadCount).to.eq(1)
    })
    it('should allow for a message to be cleared', () => {
      EventNotifications.clear(warningGroup.notifications[0], warningGroup)
      const currentNotificationsState = EventNotifications.state()
      const currentWarningGroupStatus = currentNotificationsState.groups[warningGroupIndex]
      expect(currentWarningGroupStatus.notifications.length).to.eq(0)
    })
    it('should allow for all messages in a group to be cleared', () => {
      EventNotifications.warn('warning message 2', {persistent: false, unread: true}, 2)
      EventNotifications.clearAll(warningGroup)
      const currentNotificationsState = EventNotifications.state()
      const currentWarningGroupStatus = currentNotificationsState.groups[warningGroupIndex]
      expect(currentWarningGroupStatus.notifications.length).to.eq(0)
    })
  })
  describe('Handling toasts', () => {
    const warningGroupIndex = 3
    let notificationsState = {}
    let warningGroup = {}
    beforeEach(() => {
      EventNotifications.warn('warning message', {persistent: false, unread: true}, 1)
      notificationsState = EventNotifications.state()
      warningGroup = notificationsState.groups[warningGroupIndex]
    })
    it('should should allow you to set viewing state', () => {
      warningGroup.notifications[0].show = false
      EventNotifications.setViewingToast(warningGroup.notifications[0], false)
      const currentNotificationsState = EventNotifications.state()
      expect(currentNotificationsState.toastNotifications.length).to.eq(0)
    })
    it('should should allow you to set dismiss a toast', () => {
      EventNotifications.dismissToast(warningGroup.notifications[0])
      const currentNotificationsState = EventNotifications.state()
      expect(currentNotificationsState.toastNotifications.length).to.eq(0)
    })
    it('should allow you to turn off display of toasts', () => {
      EventNotifications.setToastDisplay(false)
      const currentNotificationsState = EventNotifications.state()
      expect(currentNotificationsState.toastsEnabled).to.be.false
    })
    it('should hide toasts if you turn off display', () => {
      EventNotifications.setToastDisplay(false)
      EventNotifications.clearAll(warningGroup)
      EventNotifications.success('success', {persistent: true}, 1)
      const currentNotificationsState = EventNotifications.state()
      expect(currentNotificationsState.toastNotifications.length).to.eq(0)
    })
  })
})
