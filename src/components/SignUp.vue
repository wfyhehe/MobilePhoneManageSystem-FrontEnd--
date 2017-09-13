<template>
  <div class="register-form">
    <h2>注册</h2>
    <el-form :model="registerForm" :rules="rules" ref="registerForm" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="registerForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="registerForm.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="registerForm.checkPass" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="verificationCode">
        <el-input v-model="registerForm.verificationCode"></el-input>
      </el-form-item>
      <el-form-item class="buttons">
        <el-button type="primary" @click="submitForm('registerForm')">提交</el-button>
        <el-button @click="resetForm('registerForm')">重置</el-button>
        <span class="v-code">
            <img :src="verificationCodeUrl" ref="vCode" @click="refreshImage"/>
            <a href="javascript:void(0);" @click="refreshImage">看不清，换一张</a>
          </span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'
  import {setToken} from '@/common/cache'
  import {mapMutations} from 'vuex'
  import {backEndUrl, SUCCESS} from '@/common/config'

  export default {
    data() {
      let checkUsername = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'));
        } else if (!/^\w{5,18}$/.test(value)) {
          callback(new Error('用户名必须由5-18位数字、字母、下划线组成'));
        } else {
          let checkUsernameUrl = `${backEndUrl}/user/check_username.do`
          axios.get(checkUsernameUrl, {
            params: {
              username: value
            }
          }).then((response) => {
            if (response.data.status !== SUCCESS) {
              // 用户名已存在
              callback(new Error(response.data.msg))
            } else {
              callback();
            }
          })
        }
      }
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!/^.{5,18}$/.test(value)) {
          callback(new Error('密码长度必须为5-18位'));
        } else {
          callback();
        }
      }
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
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
      return {
        registerForm: {
          password: '',
          checkPass: '',
          username: '',
          verificationCode: ''
        },
        rules: {
          password: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'}
          ],
          username: [
            {validator: checkUsername, trigger: 'blur'}
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
            this.signUp()
          } else {
            return false;
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      refreshImage() {
        this.$refs.vCode.src = `${backEndUrl}/util/v-code.do?${+new Date()}`
      },
      signUp() {
        let signUpUrl = `${backEndUrl}/auth/sign_up.do`
        let self = this
        axios.post(signUpUrl, {
          user: {
            username: self.registerForm.username,
            password: self.registerForm.password
          },
          vCode: self.registerForm.verificationCode
        }, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          withCredentials: true
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            this.setSignInInfo({
              username: self.registerForm.username,
              password: self.registerForm.password
            })
            self.$router.push('/sign_in')
            self.$message.success('注册成功')
          } else {
            self.$message.error(response.data.msg)
          }
        })

      },
      ...mapMutations({
        setSignInInfo: 'SET_SIGN_IN_INFO'
      })
    }
  }
</script>

<style scoped>
  .register-form {
    width: 500px;
    margin: 5% auto;
  }

  .register-form img {
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
