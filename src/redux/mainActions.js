export const updateCards = (cards) => ({ type: 'UPDATE_CARDS', payload: cards })
export const updateDrafts = (drafts) => ({
  type: 'UPDATE_DRAFTS',
  payload: drafts,
})

export const updateScrapboards = (scrapboards) => ({
  type: 'UPDATE_SCRAPBOARDS',
  payload: scrapboards,
})

export const updateScrapboard = (index, data) => ({
  type: 'UPDATE_SCRAPBOARD',
  payload: { data, index },
})

export const updateUnits = (data) => ({
  type: 'UPDATE_UNITS',
  payload: data,
})

export const updateGlobalTargetCount = (data) => ({
  type: 'UPDATE_GLOBAL_TARGET_COUNT',
  payload: data,
})
