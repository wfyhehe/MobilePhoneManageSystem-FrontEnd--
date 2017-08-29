<template>
  <div class="employee-detail">
    <el-form ref="form" :model="form" class="form" label-width="80px">
      <h3>修改员工项</h3>
      <el-form-item label="员工姓名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="form.tel"></el-input>
      </el-form-item>
      <el-form-item label="类别">
        <el-switch
          v-model="form.type"
          :width="80"
          on-text="销售员"
          off-text="其他">
        </el-switch>
      </el-form-item>
      <el-form-item label="部门">
        <el-select v-model="form.dept" placeholder="请选择部门" @visible-change="selectShowed">
          <el-option label="未定" value=""></el-option>
          <el-option v-for="(item, i) in depts" :key="i" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="系统账号">
        <el-input v-model="form.username" :disabled="true"></el-input>
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
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";

  export default {
    components: {ElFormItem},
    data() {
      return {
        form: {
          name: '',
          tel: '',
          type: true,
          dept: '',
          remark: '',
          username: ''
        },
        employee: {},
        depts: []
      }
    },
    methods: {
      onSubmit() {
        let self = this
        let updateEmployeeUrl = `${backEndUrl}/employee/update_employee.do`
        axios.post(updateEmployeeUrl, JSON.stringify({
          id: self.$route.params.id,
          name: self.form.name,
          tel: self.form.tel,
          type: self.form.type ? 'SALES' : 'OTHER',
          dept: self.form.dept,
          remark: self.form.remark,
          user: self.form.user
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
      getDepts() {
        this.loading = true
        let self = this
        let deptUrl = `${backEndUrl}/dept/get_depts.do`
        axios.get(deptUrl, {
          params: {}
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.depts = response.data.data
            self.loading = false
          }
        })
      },
      selectShowed(flag) {
        if (flag && this.depts.length === 0) {
          this.getDepts()
        }
      }
    },
    mounted() {
      let self = this
      let getEmployeeUrl = `${backEndUrl}/employee/get_employee.do`
      axios.get(getEmployeeUrl, {
        params: {
          id: self.$route.params.id
        }
      }).then(response => {
        if (response.data.status === SUCCESS) {
          let employee = response.data.data
          self.employee = employee
          self.form.name = employee.name
          self.form.tel = employee.tel
          self.form.type = employee.type === 'SALES'
          self.form.dept = employee.dept ? employee.dept.name : ''
          self.form.remark = employee.remark
          self.form.username = employee.user ? employee.user.username : ''
        }
      })
    }
  }
</script>

<style scoped="scoped">
  .employee-detail {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    top: 0;
    z-index: 2;
    background-color: aliceblue;
    position: fixed;
  }

  .form {
    margin: 100px;
    width: 50%;
  }

  h1, h2, h3 {
    font-weight: normal;
    margin: 40px;
  }
</style>
