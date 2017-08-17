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
export function validateToken(self, success) {
  let tokenModel = getToken()
  if(!tokenModel) {
    self.$router.push('/login')
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
      self.$router.push('/login')
      self.$message.warning(response.data.msg)
    } else {
      if (success) {
        success()
      }
    }
  }).catch(function (err) {
    self.$router.push('/login')
    console.log(err)
  })
  return tokenModel
}
