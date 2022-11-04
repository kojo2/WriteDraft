const R = require('ramda')

const initialState = {
  cards: [],
  drafts: [],
  scrapboards: [],
  units: { units: 'word', fractions: false },
  globalTargetCount: 50000,
}

export function mainReducer(state = R.clone(initialState), action) {
  switch (action.type) {
    case 'UPDATE_CARDS':
      state = { ...state, cards: action.payload }
      return state
    case 'UPDATE_DRAFTS':
      state = { ...state, drafts: action.payload }
      return state
    case 'UPDATE_GLOBAL_TARGET_COUNT':
      state = { ...state, globalTargetCount: action.payload }
      return state
    case 'UPDATE_UNITS':
      state = {
        ...state,
        units: {
          units: action.payload.units,
          fractions: action.payload.fractions,
        },
      }
      return state
    case 'UPDATE_SCRAPBOARD':
      let index = action.payload.index
      let _scrapboards = [...state.scrapboards]
      let s = _scrapboards.findIndex((x) => x.index === index)
      if (s > -1) {
        _scrapboards[s] = { ...action.payload.data }
      }
      state = { ...state, scrapboards: _scrapboards }
      return state
    case 'UPDATE_SCRAPBOARDS':
      state = { ...state, scrapboards: action.payload }
      return state
    default:
      return state
  }
}
