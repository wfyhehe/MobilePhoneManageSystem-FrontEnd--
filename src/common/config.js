import {getToken, setToken} from '@/common/cache'
import axios from 'axios'

export const backEndUrl = "http://localhost:8080"
export const SUCCESS = 0

/**
 *
 * @param self: just input 'this'
 * @param success: a function which will execute when response.status === SUCCESS
 * @returns an object token:{ userId, token }
 */
export function validateToken(self, success, fail) {
  let token = getToken()
  if(!token) {
    if(fail) {
      fail()
    }
    return null
  }
  let validateTokenUrl = `${backEndUrl}/user/validate_token.do`
  axios.get(validateTokenUrl, {
    params: {
      token
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
  return token
}
