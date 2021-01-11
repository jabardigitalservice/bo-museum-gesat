// state
export const state = () => ({
  isActiveSidebar: false
})

// getters
export const getters = {
  isActiveSidebar: state => state.isActiveSidebar
}

// mutations
export const mutations = {
  SET_MENU (state, payload) {
    state.isActiveSidebar = payload
  }
}

// actions
export const actions = {

}
