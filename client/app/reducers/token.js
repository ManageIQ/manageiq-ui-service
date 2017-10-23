import { TOKEN } from '../constants/token'
const initialState = {}

export function TokenReducer (state = initialState, action) {
  switch (action.type) {
    case TOKEN.ADD_TOKEN:
      return Object.assign({}, state, { token: action.payload })
    default:
      return state
  }
}
