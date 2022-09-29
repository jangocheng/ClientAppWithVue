import api from '@/api'
import { setToken, removeToken } from '@/utils/token'
import router from '@/router'

const user = {
  state: {
    userInfo: {}
  },
  mutations: {
    /** 设置用户信息 */
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
      if (userInfo) {
        window.sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
      } else {
        window.sessionStorage.removeItem('userInfo')
      }
    }
  },
  actions: {
    login ({ commit, getters }, { username, password }) {
      return new Promise(async (resolve, reject) => {
        try {
          const {
            data: {
              data: {
                avatar,
                userName,
                token
              }, data: result
            }
          } = await api.login({ username, password })
          const { access_token: accessToken, refresh_token: refreshToken } = token
          setToken(accessToken, refreshToken)
          // const userInfo = await api.getUser()
          commit('SET_USER_INFO', {
            avatar,
            userName
          })
          commit('SET_PERMISSION_ROUTER', 'TENANT_ADMIN')
          router.push({ path: getters.permissionRouter[0].path })
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
    },
    logout ({ commit }) {
      return new Promise(resolve => {
        removeToken()
        commit('SET_PERMISSION_ROUTER')
        commit('SET_USER_INFO')
        resolve()
      })
    }
  }
}
export default user
