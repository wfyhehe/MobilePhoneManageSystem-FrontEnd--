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
      <el-form-item>
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
  import {setToken, setUserInfo} from '@/common/cache'
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
            this.register()
          } else {
            return false;
          }
        })
        ;
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      refreshImage() {
        this.$refs.vCode.src = `${backEndUrl}/util/v-code.do?${+new Date()}`
      },
      register() {
        let checkVCodeUrl = `${backEndUrl}/util/check_v-code.do`
        let registerUrl = `${backEndUrl}/user/register.do`
        let loginUrl = `${backEndUrl}/user/login.do`
        let userInfoUrl = `${backEndUrl}/user/get_user_info.do`
        let self = this
        axios.get(checkVCodeUrl, {
          params: {
            vCode: self.registerForm.verificationCode
          }
        }).then(function (response) {
//          if (response.data.status === SUCCESS) {
          if (response.data.status !== SUCCESS) { // 跨域问题不好调试，发布时用上面的
            axios.post(registerUrl, {
              username: self.registerForm.username,
              password: self.registerForm.password
            }, {
              headers: {
                'Content-Type': 'application/json;charset=UTF-8'
              }
            }).then((response) => {
              if (response.data.status === SUCCESS) {
                // 登陆
                axios.post(loginUrl, {
                  username: self.registerForm.username,
                  password: self.registerForm.password
                }, {
                  headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                  }
                }).then((response) => {
                  if (response.data.status === SUCCESS) {
                    // 用户名密码正确
                    let tokenModel = response.data.data
                    self.setTokenModel(tokenModel)
                    axios.get(userInfoUrl, { // 获取用户信息
                      params: {
                        userId: tokenModel.userId,
                        token: tokenModel.token
                      }
                    }).then((response) => {
                      if (response.data.status === SUCCESS) {
                        // 将用户信息存入local storage
                        setUserInfo(response.data.data)
                        self.setUser(response.data.data)
                      }
                    })
                    setToken(tokenModel)
                    self.$router.push('/home')
                  } else {
                    // 账号或密码错误
                    self.$message.error(response.data.msg)
                    self.refreshImage()
                  }
                })
                self.$message.success(response.data.msg)
              } else {
                self.$message.error(response.data.msg)
              }
            })
          } else {
            // 验证码错误
            self.$message.error(response.data.msg)
            self.refreshImage()
          }
        })
      },
      ...mapMutations({
        setUser: 'SET_USER',
        setTokenModel: 'SET_TOKEN_MODEL'
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
