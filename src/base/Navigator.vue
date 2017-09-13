<template>
  <div class="navigator">
    <el-menu default-active="2"
             class="navigator-menu"
             @open="handleOpen"
             @close="handleClose"
             :router="true"
             theme="dark">
      <router-link tag="p" to="/" class="title">手机进销存管理系统</router-link>
      <div class="sign_in-sign_up-sign_out" v-show="!isSignIn">
        <router-link to="/sign_in" tag="span">登录</router-link>
        <span>&nbsp;/&nbsp;</span>
        <router-link to="/sign_up" tag="span">注册</router-link>
      </div>
      <div class="sign_in-sign_up-sign_out" v-show="isSignIn">
        <router-link to="/user_info" tag="span">{{username}}</router-link>
        <span>&nbsp;/&nbsp;</span>
        <span @click="signOut">注销</span>
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
  import {getToken, deleteToken, TokenUtil, getLoginUser, setLoginUser} from '@/common/cache'
  import axios from 'axios'
  import {backEndUrl, SUCCESS} from '@/common/config'

  export default {
    data() {
      return {
        menus: [],
        loading: true
      }
    },
    computed: {
      isSignIn() {
        return this.username
      },
      ...mapGetters([
        'username'
      ])
    },
    watch: {
      username(newVal, oldVal) {
        if (!oldVal && newVal) {
          this.getMenus()
        }
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath)
      },
      signOut() {
        let signOutUrl = `${backEndUrl}/auth/sign_out.do`
        let self = this
        axios.get(signOutUrl, {
          params: {}
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            deleteToken()
            self.setUsername(null)
            self.$router.push('/sign_in')
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      getMenus() {
        this.loading = true
        let menuUrl = `${backEndUrl}/menu/get_menus.do`
        let self = this
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
      },
      ...mapMutations({
        setUsername: "SET_USERNAME"
      })
    },
    mounted() {
      this.setUsername(getLoginUser())
      this.getMenus()
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

  .sign_in-sign_up-sign_out {
    text-align: center;
    float: top;
    margin: 18px auto;
    cursor: pointer;
  }

  .navigator .navigator-menu {
  }
</style>
