<template>
  <div class="navigator">
    <el-menu default-active="2"
             class="navigator-menu"
             @open="handleOpen"
             @close="handleClose"
             :router="true"
             theme="dark">
      <router-link tag="p" to="/" class="title">手机进销存管理系统</router-link>
      <div class="login-register-logout" v-show="!isLogin">
        <router-link to="/login" tag="span">登录</router-link>
        <span>&nbsp;/&nbsp;</span>
        <router-link to="/register" tag="span">注册</router-link>
      </div>
      <div class="login-register-logout" v-show="isLogin">
        <router-link to="/user_info" tag="span">{{username}}</router-link>
        <span>&nbsp;/&nbsp;</span>
        <span @click="logout">注销</span>
      </div>
      <el-submenu :index="menu.name || ''" v-for="(menu, i) in menus" :key="i"
                  v-loading.body="loading">
        <template slot="title">{{menu.name}}</template>
        <el-menu-item :index="submenu.path? '/' + submenu.path : ''"
                      v-for="(submenu, subi) in menu.children"
                      :key="subi"
                      v-if="menu.type === 'PARENT'">
          {{submenu.name}}
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import {getToken, getUserInfo, deleteToken, deleteUserInfo, TokenUtil} from '@/common/cache'
  import axios from 'axios'
  import {backEndUrl, SUCCESS} from '@/common/config'

  export default {
    data() {
      return {
        menus: [],
        user: {},
        token: '',
        loading: true
      };
    },
    computed: {
      isLogin() {
        return JSON.stringify(this.user) !== '{}'
      },
      username() {
        if (this.user && this.user.username) {
          return this.user.username
        } else {
          return ''
        }
      },
//      ...mapGetters([
//        'user',
//        'token'
//      ])
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      logout() {
        let logoutUrl = `${backEndUrl}/user/logout.do`
        let self = this
        axios.get(logoutUrl, {
          params: {
            token: self.token
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            deleteToken()
            deleteUserInfo()
//            self.setUser(null)
            self.$router.push('/login')
//            self.setUser({})
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
//      ...mapMutations({
//        setUser: "SET_USER",
//        setToken: "SET_TOKEN"
//      })
    },
    mounted() {
      this.loading = true
      let menuUrl = `${backEndUrl}/menu/get_menus.do`
      let self = this
//      this.setUser(getUserInfo())
//      this.setToken(getToken())
      this.token = getToken()
      TokenUtil.parseUserId(this.token)
      axios.get(menuUrl, {
        params: {}
      }).then((response) => {
        if (response.data.status === SUCCESS) {
          self.menus = response.data.data
          self.loading = false
        } else {
          self.$message.error(response.data.msg)
        }
      })
    }
  }
</script>

<style scoped>
  * {
    margin: 0;
  }

  .navigator {
    font-family: 微软雅黑;
    font-size: x-small;
    color: #D3DCE6;
  }

  .title {
    text-align: center;
    margin: 30px 10px;
    cursor: pointer;
    float: top;
    color: #F9FAFC;
    font-size: large;
    font-family: 方正综艺简体;
  }

  .login-register-logout {
    text-align: center;
    float: top;
    margin: 18px auto;
    cursor: pointer;
  }

  .navigator .navigator-menu {
  }
</style>
