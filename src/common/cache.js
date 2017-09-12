const TOKEN = '__token__'

const USER = '__user__'

export function setToken(tokenModel) {
  localStorage.setItem(TOKEN, tokenModel)
}

export function getToken() {
  return localStorage.getItem(TOKEN)
}

export function TokenUtil() {
}

TokenUtil.parseUserId = (token) => {
  return token.split('#')[0]
}

TokenUtil.parseUuid = (token) => {
  return token.split('#')[1]
}

export function deleteToken() {
  localStorage.removeItem(TOKEN)
}

export function setUserInfo(userInfo) {
  localStorage.setItem(USER, JSON.stringify(userInfo))
}

export function getUserInfo() {
  return JSON.parse(localStorage.getItem(USER))
}

export function deleteUserInfo() {
  localStorage.removeItem(USER)
}
