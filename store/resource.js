// state
export const state = () => ({
  dataResource: [],
  metaResource: {}
})

// getters
export const getters = {
  dataResource: state => state.dataResource,
  metaResource: state => state.metaResource
}

// mutations
export const mutations = {
  SET_RESOURCE (state, payload) {
    state.dataResource = payload.data
    state.metaResource = payload.meta
  }
}
