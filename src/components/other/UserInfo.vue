<template>
  <div class="user-info">
    <h2>用户中心</h2>
    <el-button class="reset" @click="resetPassword">修改密码</el-button>
    <span>其他功能正在开发中，敬请期待...</span>
    <el-dialog title="修改密码" :visible.sync="resetFormVisible">
      <el-form :model="resetForm" :rules="resetRule" ref="resetForm" label-width="100px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input type="password" v-model="resetForm.oldPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="resetForm.newPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input type="password" v-model="resetForm.checkPassword" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onResetSubmit('resetForm')">确 定</el-button>
      </div>
    </el-dialog>
    <router-view></router-view>
  </div>
</template>

<script>
  import axios from 'axios'
  import {backEndUrl, SUCCESS} from '@/common/config'
  import {debounce} from '@/common/util'

  export default {
    data() {
      let validateOldPassword = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入原密码'))
        } else {
          callback()
        }
      };
      let validateNewPassword = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入新密码'))
        } else if (value === this.resetForm.oldPassword) {
          callback(new Error('旧密码和新密码不能一致!'))
        } else {
          callback()
        }
      };
      let validateCheckPassword = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.resetForm.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      };
      return {
        resetForm: {
          oldPassword: '',
          newPassword: '',
          checkPassword: ''
        },
        me: {},
        resetFormVisible: false,
        resetRule: {
          oldPassword: [
            {validator: validateOldPassword, trigger: 'blur'}
          ],
          newPassword: [
            {validator: validateNewPassword, trigger: 'blur'}
          ],
          checkPassword: [
            {validator: validateCheckPassword, trigger: 'blur'}
          ]
        }
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'getBrands'
    },
    methods: {
      getMe() {
        let userInfoUrl = `${backEndUrl}/user/get_me.do`
        let self = this
        axios.get(userInfoUrl, {
          params: {}
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            this.me = response.data.data
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      resetPassword() {
        this.resetFormVisible = true
      },
      onResetSubmit(formName) {
        let self = this
        let resetUrl = `${backEndUrl}/auth/reset_password.do`
        console.log(formName)
        console.log(this.$refs[formName])
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios.post(resetUrl, JSON.stringify({
              id: self.me.id,
              passwordOld: self.resetForm.oldPassword,
              passwordNew: self.resetForm.newPassword
            }), {
              headers: {
                'Content-Type': 'application/json;charset=UTF-8'
              }
            }).then((response) => {
              if (response.data.status === SUCCESS) {
                self.$message.success('修改成功')
                self.resetFormVisible = false
              } else {
                self.$message.error(response.data.msg)
              }
            })
          } else {
            return false
          }
        })
      },
      mounted() {
        this.getMe()
      }
    }
  }
</script>

<style scoped>
  .user-info {
  }

  .reset {
    margin: 20px 80px;
  }

  .el-table .deleted-row {
    background-brand: rgba(255, 73, 73, 0.56);
  }

  .recover {
    float: right;
    margin: 10px 40px 10px 0;
  }

  .add {
    float: left;
    margin: 10px 40px 10px 10px;
  }

  h1, h2, h3 {
    margin: 30px;
  }
</style>
