<template>
  <div class="user-detail">
    <el-form ref="form" :model="form" class="form" label-width="80px">
      <h3>修改用户项</h3>
      <el-form-item label="用户名">
        <el-input v-model="form.username" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="员工姓名">
        <el-input v-model="form.empName" :readonly="true"></el-input>
        <el-button class="relate-emp" v-if="!form.employee"
                   @click="relateEmp">关联员工账号
        </el-button>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="授权">
        <el-select v-model="form.roles"
                   multiple
                   value-key="id"
                   placeholder="请选择角色">
          <el-option
            v-for="role in allRoles"
            :key="role.id"
            :label="role.name"
            :value="role">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'
  import {backEndUrl, SUCCESS} from '@/common/config'
  import ElFormItem from '../../../node_modules/element-ui/packages/form/src/form-item.vue'
  import {mapMutations} from 'vuex'

  export default {
    components: {ElFormItem},
    data() {
      return {
        form: {
          username: '',
          empName: '',
          remark: '',
          roles: []
        },
        allRoles: [],
        user: {}
      }
    },
    methods: {
//      formatData(data) {
//        let dataCopy = JSON.parse(JSON.stringify(data))
//        let newData = {}
//        newData.username = dataCopy.username
//        newData.empName = dataCopy.employee ? dataCopy.employee.name : ''
//        newData.remark = dataCopy.remark
//        let names = []
//        for (let role of dataCopy.roles) {
//          names.push(role.name)
//        }
//        newData.roleNames = names
//        return newData
//      },
      onSubmit() {
        let self = this
        let updateUserUrl = `${backEndUrl}/user/update_user.do`
        axios.post(updateUserUrl, JSON.stringify({
          id: self.$route.params.id,
          remark: self.form.remark,
          roles: self.form.roles
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.$router.back()
            self.$message.success('修改成功')
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      onCancel() {
        this.$router.back()
      },
      isSuperAdmin(role) {
        return role.name === '超级管理员'
      },
      relateEmp() {
        this.setUsername(this.user.username)
        this.$router.push('/employee_manage')
      },
      ...mapMutations({
        setUsername: 'SET_USERNAME'
      })
    },
    mounted() {
      let self = this
      let getUserUrl = `${backEndUrl}/user/get_user.do`
      let getRolesUrl = `${backEndUrl}/role/get_roles.do`
      axios.get(getUserUrl, {
        params: {
          id: self.$route.params.id
        }
      }).then(response => {
        if (response.data.status === SUCCESS) {
          self.user = response.data.data
          self.form.username = self.user.username
          self.form.empName = self.user.employee ? self.user.employee.name : ''
          self.form.remark = self.user.remark
          self.form.roles = self.user.roles
        } else {
          self.$message.error(response.data.msg)
        }
      })
      axios.get(getRolesUrl, {}).then(response => {
        if (response.data.status === SUCCESS) {
          self.allRoles = response.data.data
        } else {
          self.$message.error(response.data.msg)
        }
      })
    }
  }
</script>

<style scoped>
  .user-detail {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    top: 0;
    z-index: 2;
    background-color: aliceblue;
    position: absolute;
  }

  .form {
    margin: 100px;
    width: 50%;
  }

  h1, h2, h3 {
    font-weight: normal;
    margin: 40px;
  }

  .relate-emp {
    margin: 10px 0 0 0;
    float: left;
  }
</style>
