import * as chai from 'chai'
import sinonChai from 'sinon-chai'

chai.use(sinonChai)

// Expose as individual globals that tests and karma-sinon expect
window.chai   = chai
window.expect = chai.expect
window.assert = chai.assert
window.should = chai.should()
