import {getToken, setToken} from '@/common/cache'
import axios from 'axios'

export const backEndUrl = "http://localhost:8080/ManageSystem"
export const SUCCESS = 0

/**
 *
 * @param self: just input 'this'
 * @param success: a function which will execute when response.status === SUCCESS
 * @returns an object tokenModel:{ userId, token }
 */
export function validateToken(self, success, fail) {
  let tokenModel = getToken()
  if(!tokenModel) {
    if(fail) {
      fail()
    }
    return null
  }
  let validateTokenUrl = `${backEndUrl}/user/validate_token.do`
  axios.get(validateTokenUrl, {
    params: {
      userId: tokenModel.userId,
      token: tokenModel.token
    }
  }).then((response) => {
    if (response && response.data.status !== SUCCESS) {
      if(fail) {
        fail()
      }
      self.$message.warning(response.data.msg)
    } else {
      if (success) {
        success()
      }
    }
  }).catch(function (err) {
    if(fail) {
      fail()
    }
    console.log(err)
  })
  return tokenModel
}
