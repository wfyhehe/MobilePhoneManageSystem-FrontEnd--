import CookieUtil from '@/common/cookie'

const TOKEN = '__token__'

const USER = '__user__'

const LOGIN_USER = '__loginUser__'

const TOKEN_SEPARATOR = '#'

export function setToken(token) {
  localStorage.setItem(TOKEN, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN)
}

export function TokenUtil() {
}

TokenUtil.parseUserId = (token) => {
  if (!token) {
    return ''
  }
  return token.split(TOKEN_SEPARATOR)[0]
}

TokenUtil.parseUuid = (token) => {
  if (!token) {
    return ''
  }
  return token.split(TOKEN_SEPARATOR)[1]
}

TokenUtil.stringifyToken = (token) => {
  if (token && token['userId'] && token['credentials']) {
    return token['userId'] + TOKEN_SEPARATOR + token['credentials']
  }
  return ''
}

export function deleteToken() {
  localStorage.removeItem(TOKEN)
}

export function getLoginUser() {
  return CookieUtil.getCookie(LOGIN_USER)
}

export function setLoginUser(username) {
  CookieUtil.setCookie(LOGIN_USER, username)
}

/*export function setUserInfo(userInfo) {
  localStorage.setItem(USER, JSON.stringify(userInfo))
}

export function getUserInfo() {
  return JSON.parse(localStorage.getItem(USER))
}

export function deleteUserInfo() {
  localStorage.removeItem(USER)
}*/
