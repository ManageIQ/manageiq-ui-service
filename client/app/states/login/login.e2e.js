/* eslint angular/log: 0 */
/* eslint no-console: 0 */

describe('pages with login', function() {
  it('should log in with a non-Angular page', function() {
    browser.sleep(10000);
   //       browser.driver.executeScript('return window.sessionStorage.getItem("ngStorage-token");').then(function(retValue) {
   // console.log(retValue);
// });
    console.log("Executing login Test");
    browser.driver.executeScript('return window.sessionStorage.getItem("ngStorage-token");').then(function(retValue) {
      console.log("Token value =>" + retValue);
      expect(retValue).not.toBe(null);
    });
  });
});
