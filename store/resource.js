// state
export const state = () => ({
  dataResource: [],
  metaResource: {}
})

// mutations
export const mutations = {
  SET_RESOURCE (state, payload) {
    state.dataResource = payload.data
    state.metaResource = payload.meta
  }
}
