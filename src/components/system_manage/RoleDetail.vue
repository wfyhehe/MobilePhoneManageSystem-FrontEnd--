<template>
  <div class="role-detail">
    <el-form ref="form" :model="form" class="form" label-width="80px">
      <h3>修改角色项</h3>
      <el-form-item label="角色名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="角色说明">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="启用">
        <el-switch on-text="" off-text="" v-model="form.online"></el-switch>
      </el-form-item>
      <el-form-item class="buttons">
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
          remark: '',
          online: true
        },
        role: {}
      }
    },
    methods: {
      onSubmit() {
        let self = this
        let updateRoleUrl = `${backEndUrl}/role/update_role.do`
        axios.post(updateRoleUrl, JSON.stringify({
          id: self.$route.params.id,
          name: self.form.name,
          remark: self.form.remark,
          status: self.form.online ? 'ONLINE' : 'OFFLINE'
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
      let getRoleUrl = `${backEndUrl}/role/get_role.do`
      axios.get(getRoleUrl, {
        params: {
          id: self.$route.params.id
        }
      }).then(response => {
        if (response.data.status === SUCCESS) {
          let role = response.data.data
          self.role = role
          self.form.name = role.name
          self.form.remark = role.remark
          self.form.online = role.status === 'ONLINE'
        }
      })
    }
  }
</script>

<style scoped>
  .role-detail {
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
</style>
