const R = require('ramda')

const initialState = {
  cards: [],
  drafts: [],
}

export function mainReducer(state = R.clone(initialState), action) {
  switch (action.type) {
    case 'UPDATE_CARDS':
      state = { ...state, cards: action.payload }
      return state
    case 'UPDATE_DRAFTS':
      state = { ...state, drafts: action.payload }
      return state
    default:
      return state
  }
}
