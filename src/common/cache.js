const TOKEN = '__token__'

const USER = '__user__'

export function setToken(tokenModel) {
  localStorage.setItem(TOKEN, JSON.stringify(tokenModel))
}

export function getToken() {
  return JSON.parse(localStorage.getItem(TOKEN))
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
