// state
export const state = () => ({
  role: false
})

// getters
export const getters = {
  role: state => state.role
}

// mutations
export const mutations = {
  set_role (state, role) {
    state.role = role
  }
}
