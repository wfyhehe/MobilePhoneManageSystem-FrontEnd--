<template>
  <div class="menu-detail">
    <el-form ref="form" :model="form" class="form" label-width="80px">
      <h3>修改菜单项</h3>
      <el-form-item label="菜单名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="菜单路径">
        <el-input v-model="form.path"></el-input>
      </el-form-item>
      <el-form-item label="说明">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="授权">
        <el-checkbox-group v-model="form.roleNames">
          <el-checkbox v-for="(role, i) in allRoles"
                       :key="i"
                       :label="role.name"
                       :disabled="isSuperAdmin(role)">
            {{role.name}}
          </el-checkbox>
        </el-checkbox-group>
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
          path: '',
          remark: '',
          roleNames: []
        },
        menu: {},
        allRoles: []
      }
    },
    methods: {
      formatData(data) {
        let dataCopy = JSON.parse(JSON.stringify(data))
        let newData = {}
        newData.name = dataCopy.name
        newData.path = dataCopy.path
        newData.remark = dataCopy.remark
        let names = []
        for (let role of dataCopy.roles) {
          names.push(role.name)
        }
        newData.roleNames = names
        return newData
      },
      onSubmit() {
        let self = this
        let updateMenuUrl = `${backEndUrl}/menu/update_menu.do`
        axios.post(updateMenuUrl, JSON.stringify({
          id: self.$route.params.id,
          name: self.form.name,
          path: self.form.path,
          remark: self.form.remark,
          roleNames: self.form.roleNames
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
      }
    },
    mounted() {
      let self = this
      let getMenuUrl = `${backEndUrl}/menu/get_menu.do`
      let getRolesUrl = `${backEndUrl}/role/get_roles.do`
      axios.get(getMenuUrl, {
        params: {
          id: self.$route.params.id
        }
      }).then(response => {
        if (response.data.status === SUCCESS) {
          self.menu = response.data.data
          self.form = self.formatData(self.menu)
        }
      })
      axios.get(getRolesUrl, {}).then(response => {
        if (response.data.status === SUCCESS) {
          self.allRoles = response.data.data
        }
      })
    }
  }
</script>

<style>
  .menu-detail {
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
