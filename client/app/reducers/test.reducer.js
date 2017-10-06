const initialState = []

export function TodosReducer (state = initialState, action) {
  switch (action.type) {
    case 'test':
      return 'test'
    case 'test2':
      return [
      ]
    default:
      return state
  }
}
