<template>
  <div class="login">
    <div class="login-form">
      <h2>登陆</h2>
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
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')">提交</el-button>
          <el-button @click="resetForm('loginForm')">重置</el-button>
          <span class="v-code">
            <img :src="verificationCodeUrl" ref="vCode" @click="refreshImage"/>
            <a href="javascript:void(0);" @click="refreshImage">看不清，换一张</a>
          </span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import {backEndUrl} from '@/common/config'

  export default {
    name: 'login',
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
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.login()
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
      login() {
        let checkVCodeUrl = `${backEndUrl}/util/check_v-code.do`
        let loginUrl = `${backEndUrl}/user/login.do`
        let self = this
        axios.get(checkVCodeUrl, {
          params: {
            vCode: this.loginForm.verificationCode
          }
        }).then(function (response) {
//          if (response.data.status === 0) {
          if (response.data.status !== 0) { // 跨域问题不好调试，发布时用上面的
            axios.post(loginUrl, {
              username: self.loginForm.username,
              password: self.loginForm.password
            }).then(function (response) {
              if (response.data.status === 0) {
                self.$router.push('/home')
              } else {
                // 账号或密码错误
                self.$message(response.data.msg)
                self.refreshImage()
              }
            })
          } else {
            // 验证码错误
            self.$message.error(response.data.msg)
            self.refreshImage()
          }
        })
      }
    },

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login-form {
    width: 500px;
    margin: 15% auto;
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
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
