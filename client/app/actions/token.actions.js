function addToken (token) {
  return {
    type: 'ADD_TOKEN',
    payload: token
  }
}

export default { addToken }
