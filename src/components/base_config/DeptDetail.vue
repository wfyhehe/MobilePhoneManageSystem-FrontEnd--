<template>
  <div class="dept-detail">
    <el-form ref="form" :model="form" class="form" label-width="80px">
      <h3>修改部门项</h3>
      <el-form-item label="部门名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="form.tel"></el-input>
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="form.contact"></el-input>
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

  export default {
    data() {
      return {
        form: {
          name: '',
          address: '',
          tel: '',
          contact: '',
          remark: ''
        },
        dept: {}
      }
    },
    methods: {
      onSubmit() {
        let self = this
        let updateDeptUrl = `${backEndUrl}/dept/update_dept.do`
        axios.post(updateDeptUrl, JSON.stringify({
          id: self.$route.params.id,
          name: self.form.name,
          address: self.form.address,
          tel: self.form.tel,
          contact: self.form.contact,
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
      }
    },
    mounted() {
      let self = this
      let getDeptUrl = `${backEndUrl}/dept/get_dept.do`
      axios.get(getDeptUrl, {
        params: {
          id: self.$route.params.id
        }
      }).then(response => {
        if (response.data.status === SUCCESS) {
          let dept = response.data.data
          self.dept = dept
          self.form.name = dept.name
          self.form.address = dept.address
          self.form.tel = dept.tel
          self.form.contact = dept.contact
          self.form.remark = dept.remark
        }
      })
    }
  }
</script>

<style>
  .dept-detail {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    top: 0;
    z-index: 1;
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
