import * as types from './mutation-types'

const mutations = {
  [types.SET_TOKEN_MODEL](state, tokenModel) {
    state.tokenModel = tokenModel
  },
  [types.SET_USER](state, user) {
    state.user = user
  },
  [types.SET_USERNAME](state, username) {
    state.username = username
  }
}

export default mutations
