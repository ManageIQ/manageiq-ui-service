import * as chai from 'chai'
import sinonChai from 'sinon-chai'

chai.use(sinonChai)

// Expose as individual globals that tests and karma-sinon expect
window.expect = chai.expect
