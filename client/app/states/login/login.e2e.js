describe('pages with login', function () {
  it('should log in with a non-Angular page', function () {
    console.log('Executing login Test')
    browser.driver.executeScript('return window.localStorage.getItem("ngStorage-token");').then(function (retValue) {
      console.log('Token value =>' + retValue)
      expect(retValue).not.toBe(null)
    })
  })
})
