import { TOKEN } from '../constants/token'
function addToken (token) {
  return {
    type: TOKEN.ADD_TOKEN,
    payload: token
  }
}

export default { addToken }
