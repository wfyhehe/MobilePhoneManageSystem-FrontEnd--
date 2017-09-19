<template>
  <div class="login">
    <div class="login-form">
      <h2>登录</h2>
      <!--<el-button @click="test">test</el-button>-->
      <el-form :model="loginForm" :rules="loginRule" ref="loginForm"
               :label-position="labelPosition" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verificationCode">
          <el-input v-model="loginForm.verificationCode"></el-input>
        </el-form-item>
        <el-form-item class="buttons">
          <el-button type="primary" @click="submitForm('loginForm')">提交</el-button>
          <el-button @click="signUp">注册</el-button>
          <span class="v-code">
            <img :src="verificationCodeUrl" ref="vCode" @click="refreshImage"/>
            <a href="javascript:void(0);" @click="refreshImage">看不清，换一张</a>
          </span>
        </el-form-item>
      </el-form>
      <div class="notes">
        <el-button class="add" size="small" v-if="isSuperAdmin" @click="addInfo">
          <i class="el-icon-plus"></i>添加信息
        </el-button>
        <ul>
          <div class="li" v-for="info in infos" :key="info.id">
            <li>{{info.content}}</li>
            <el-button :plain="true" type="info" icon="edit" size="small" class="delete"
                       v-if="isSuperAdmin" @click="editInfo(info)"></el-button>
            <el-button :plain="true" type="danger" icon="delete" size="small" class="delete"
                       v-if="isSuperAdmin" @click="deleteInfo(info.id)"></el-button>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import {backEndUrl, SUCCESS} from '@/common/config'
  import {setToken, TokenUtil, setLoginUser} from '@/common/cache'
  import CookieUtil from '@/common/cookie'
  import {mapMutations, mapGetters} from 'vuex'
  import {isSuperAdmin} from '@/common/util'
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";

  export default {
    components: {ElButton},
    data() {
      let validateVerificationCode = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入验证码'))
        }
        if (!/^\w{4}$/.test(value)) {
          callback(new Error('请输入4位字母或数字'))
        } else {
          callback()
        }
      }
      let validateUsername = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入用户名'));
        } else if (!/^\w{5,18}$/.test(value)) {
          callback(new Error('用户名必须由5-18位数字、字母、下划线组成'));
        } else {
          callback();
        }
      }
      let validatePassword = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'))
        } else if (!/^.{5,18}$/.test(value)) {
          callback(new Error('密码长度必须为5-18位'))
        } else {
          callback()
        }
      }
      return {
        labelPosition: 'left',
        loginForm: {
          username: '',
          password: '',
          verificationCode: ''
        },
        infos: [],
        loginRule: {
          username: [
            {validator: validateUsername, trigger: 'blur'}
          ],
          password: [
            {validator: validatePassword, trigger: 'blur'}
          ],
          verificationCode: [
            {validator: validateVerificationCode, trigger: 'blur'}
          ],
        },
        verificationCodeUrl: `${backEndUrl}/util/v-code.do?${+new Date()}`
      }
    },
    computed: {
      isSuperAdmin() {
        return isSuperAdmin()
      },
      ...mapGetters([
        'signInInfo'
      ])
    },
    methods: {
      test() {
        console.log(CookieUtil.getCookie('vCodeId'))
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.signIn()
          } else {
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      refreshImage() {
        this.$refs.vCode.src = `${backEndUrl}/util/v-code.do?${+new Date()}`
      },
      signIn() {
        let loginUrl = `${backEndUrl}/auth/sign_in.do`
        let self = this
        axios.post(loginUrl, JSON.stringify({ // 验证用户名密码
          username: self.loginForm.username,
          password: self.loginForm.password,
          vCode: self.loginForm.verificationCode
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          withCredentials: true
        }).then((response) => {
          console.log(response)
          if (response.data.status === SUCCESS) {
            let token = response.data.data
            setToken(TokenUtil.stringifyToken(token))
            self.getMe()
            self.$message.success('登陆成功')
            self.$router.push('/home')
          } else {
            self.$message.error(response.data.msg)
            self.refreshImage()
          }
        })
      },
      getMe() {
        let userInfoUrl = `${backEndUrl}/user/get_me.do`
        let self = this
        axios.get(userInfoUrl, {
          params: {}
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            let user = response.data.data
            self.setUsername(user.username)
            setLoginUser(user.username)
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      getInfos() {
        let infoUrl = `${backEndUrl}/info/get_infos.do`
        let self = this
        axios.get(infoUrl, {
          params: {
            position: "SIGN_IN"
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            this.infos = response.data.data
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      editInfo(info) {
        let self = this
        let updateUrl = `${backEndUrl}/info/update_info.do`
        this.$prompt('请输入信息', '提示', {
          inputValue: info.content,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({value}) => {
          axios.post(updateUrl, JSON.stringify({
            id: info.id,
            content: value,
            position: 'SIGN_IN'
          }), {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          }).then((response) => {
            if (response.data.status === SUCCESS) {
              self.getInfos()
              self.$message.success('修改成功')
            } else {
              self.$message.error(response.data.msg)
            }
          })
        }).catch(() => {
        })
      },
      addInfo() {
        let self = this
        let addUrl = `${backEndUrl}/info/add_info.do`
        this.$prompt('请输入信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({value}) => {
          axios.post(addUrl, JSON.stringify({ // 验证用户名密码
            content: value,
            position: 'SIGN_IN'
          }), {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          }).then((response) => {
            if (response.data.status === SUCCESS) {
              self.getInfos()
              self.$message.success('添加成功')
            } else {
              self.$message.error(response.data.msg)
            }
          })
        }).catch(() => {
        })
      },
      deleteInfo(id) {
        let self = this
        let deleteUrl = `${backEndUrl}/info/delete_info.do`
        this.$confirm('此操作将删除词条信息, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }).then(() => {
          axios.get(deleteUrl, {
            params: {
              id
            }
          }).then((response) => {
            if (response.data.status === SUCCESS) {
              self.getInfos()
              self.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              self.$message({
                type: 'error',
                message: response.data.msg
              })
            }
          })
        }).catch(() => {
        })
      },
      signUp() {
        this.$router.push('/sign_up')
      },
      ...mapMutations({
        setUsername: 'SET_USERNAME'
      })
    },
    mounted() {
      this.getInfos()
      if (this.signInInfo && this.signInInfo.username && this.signInInfo.password) {
        this.loginForm.username = this.signInInfo.username
        this.loginForm.password = this.signInInfo.password
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login-form {
    width: 500px;
    margin: 5% auto;
  }

  .login-form img {
    float: right;
  }

  .v-code img {
    cursor: pointer;
  }

  .v-code a {
    font-size: 12px;
    float: right;
    margin-right: 10px;
  }

  h1, h2 {
    font-weight: normal;
    margin: 40px;
  }

  .notes {
    font-size: 17px;
    color: #99A9BF;
  }

  .li {
    margin: 15px 0;
  }

  .li .delete{
    margin-top: 10px;
    float: top
  }
</style>
