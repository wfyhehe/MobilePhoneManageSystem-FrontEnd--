<template>
  <div class="navigator">
    <el-menu default-active="2"
             class="navigator-menu"
             @open="handleOpen"
             @close="handleClose"
             :router="true"
             theme="dark">
      <p class="title">手机进销存管理系统</p>
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
      <el-submenu index="1">
        <template slot="title">导航一</template>
        <el-menu-item index="1-1">选项1</el-menu-item>
        <el-menu-item index="1-2">选项2</el-menu-item>
        <el-menu-item index="1-3">选项3</el-menu-item>
        <el-submenu index="1-4">
          <template slot="title">选项4</template>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="2">导航二</el-menu-item>
      <el-menu-item index="3">导航三</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import {getToken, getUserInfo, deleteToken, deleteUserInfo} from '@/common/cache'
  import axios from 'axios'
  import {backEndUrl, SUCCESS, validateToken} from '@/common/config'

  export default {
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      };
    },
    computed: {
      isLogin() {
        for (let any in this.user) {
          return true
        }
        return false
      },
      username() {
        if (this.user && this.user.username) {
          return this.user.username
        } else {
          return ''
        }
      },
      ...mapGetters([
        'user',
        'tokenModel'
      ])
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
            userId: self.tokenModel.userId,
            token: self.tokenModel.token
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            deleteToken()
            deleteUserInfo()
            self.setUser(null)
            self.$router.push('/login')
          }
        })
      },
      ...mapMutations({
        setUser: "SET_USER",
        setTokenModel: "SET_TOKEN_MODEL"
      })
    },
    mounted() {
      this.setUser(getUserInfo())
      this.setTokenModel(getToken())
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
    margin: 30px 10px;
    float: top;
    color: #F9FAFC;
    font-size: large;
    font-family: 方正综艺简体;
  }

  .login-register-logout {
    float: top;
    margin: 18px auto;
    cursor: pointer;
  }

  .navigator .navigator-menu {
  }
</style>
