import * as types from './mutation-types'

const mutations = {
  [types.SET_TOKEN_MODEL](state, tokenModel) {
    state.tokenModel = tokenModel
  }
}

export default mutations
