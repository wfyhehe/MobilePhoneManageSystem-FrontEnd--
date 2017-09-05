<template>
  <div class="account-detail">
    <el-form ref="form" :model="form" class="form" label-width="80px">
      <h3>修改账户信息</h3>
      <el-form-item label="名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="余额">
        <el-input v-model="form.balance"></el-input>
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
          id: '',
          name: '',
          dept: '',
          balance: 0,
          remark: ''
        },
        account: {},
        depts: []
      }
    },
    methods: {
      onSubmit() {
        let self = this
        let updateAccountUrl = `${backEndUrl}/account/update_account.do`
        axios.post(updateAccountUrl, JSON.stringify({
          id: self.$route.params.id,
          name: self.form.name,
          dept: self.form.dept,
          balance: self.form.balance,
          remark: self.form.remark
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
          } else {
            self.$message.error(response.data.msg)
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
      let getAccountUrl = `${backEndUrl}/account/get_account.do`
      axios.get(getAccountUrl, {
        params: {
          id: self.$route.params.id
        }
      }).then(response => {
        if (response.data.status === SUCCESS) {
          let account = response.data.data
          self.account = account
          self.form.id = account.id
          self.form.name = account.name
          self.form.dept = account.dept ? account.dept.name : ''
          self.form.balance = account.balance
          self.form.remark = account.remark
        }
      })
    }
  }
</script>

<style scoped>
  .account-detail {
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
