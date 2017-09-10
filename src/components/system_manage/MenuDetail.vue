<template>
  <div class="menu-detail">
    <el-form ref="form" :model="form" class="form" label-width="80px">
      <h3>修改菜单项</h3>
      <el-button @click="test">test</el-button>
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
        <!-- <el-checkbox-group v-model="form.roles">
           <el-checkbox v-for="(role, i) in allRoles"
                        :key="i"
                        :label="role.name"
                        :disabled="isSuperAdmin(role)">
             {{role.name}}
           </el-checkbox>
         </el-checkbox-group>-->
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
      <el-form-item label="动作设置">
        <div class="inline-table">
          <el-form :inline="true"
                   :rules="actionRule"
                   :model="form.actionForm">
            <el-form-item label="动作名" prop="name" class="form-item">
              <el-input v-model="form.actionForm.name"
                        placeholder="动作名"></el-input>
            </el-form-item>
            <el-form-item label="Url" prop="url" class="form-item">
              <el-input v-model="form.actionForm.url"
                        placeholder="/xxx/yyy_zzz.do"></el-input>
            </el-form-item>
            <el-form-item label="备注" class="form-item">
              <el-input type="textarea"
                        placeholder="备注"
                        v-model="form.actionForm.remark"></el-input>
            </el-form-item>
            <el-form-item class="form-item">
              <el-button @click="addAction">添加</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="form.actions"
            class="table-in-form">
            <el-table-column
              prop="name"
              label="动作名">
            </el-table-column>
            <el-table-column
              prop="url"
              width="200"
              label="Url">
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注">
            </el-table-column>
            <el-table-column label="操作"
            width="80">
              <template scope="scope">
                <el-button :plain="true" type="danger" icon="delete" size="small"
                           @click="removeAction(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";

  export default {
    components: {ElButton},
    data() {
      let validateName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入名称'))
        } else {
          callback()
        }
      }
      let validateUrl = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入Url'))
        } else if (!/^(\/[\w]+)+\.do$/.test(value)) {
          callback(new Error('格式为/xxx/yyy_zzz.do'))
        } else {
          callback()
//          let checkActionIdUrl = `${backEndUrl}/action/check_action.do`
//          axios.get(checkActionIdUrl, {
//            params: {
//              url: value
//            }
//          }).then((response) => {
//            if (response.data.status !== SUCCESS) {
//              // Url已存在
//              callback(new Error(response.data.msg))
//            } else {
//              callback();
//            }
//          })
        }
      }
      return {
        form: {
          name: '',
          path: '',
          remark: '',
          actions: [],
          roles: [],
          actionForm: {
            name: '',
            url: '',
            remark: ''
          }
        },
        menu: {},
        allRoles: [],
        actionRule: {
          name: [
            {validator: validateName, trigger: 'blur'}
          ],
          url: [
            {validator: validateUrl, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
//      formatData(data) {
//        let dataCopy = JSON.parse(JSON.stringify(data))
//        let newData = {}
//        newData.name = dataCopy.name
//        newData.path = dataCopy.path
//        newData.remark = dataCopy.remark
//        let names = []
//        for (let role of dataCopy.roles) {
//          names.push(role.name)
//        }
//        newData.roleNames = names
//        return newData
//      },
      test() {
        console.log(this.form)
        console.log(/^(\/[\w]+)+\.do$/.test('/menu/update_menu.do'))
      },
      addAction() {
        if (!(this.form.actionForm.url && this.form.actionForm.name)) {
          return false
        }
        let actionObj = JSON.parse(JSON.stringify(this.form.actionForm)) // 数据对象深拷贝
        if (this.isAdded(actionObj.url)) {
          return false
        }
        this.form.actions.push(actionObj)
        this.form.actionForm.url = ''
        this.form.actionForm.name = ''
        this.form.actionForm.remark = ''
      },
      removeAction(row) {
        this.form.actions = this.form.actions.filter((action) => {
          return action.url !== row.url
        })
      },
      isAdded(url) {
        for (let action of this.form.actions) {
          if (action.url === url) {
            return true
          }
        }
        return false
      },
      onSubmit() {
        let self = this
        let updateMenuUrl = `${backEndUrl}/menu/update_menu.do`
        axios.post(updateMenuUrl, JSON.stringify({
          id: self.$route.params.id,
          name: self.form.name,
          path: self.form.path,
          remark: self.form.remark,
          roles: self.form.roles,
          actions: self.form.actions
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
//          self.form = self.formatData(self.menu)
          self.form.name = self.menu.name
          self.form.path = self.menu.path
          self.form.remark = self.menu.remark
          self.form.roles = self.menu.roles
          self.form.actions = self.menu.actions
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
  .menu-detail {
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

  .inline-table .form-item {
    float: left;
    padding: 20px 0 0 0;
  }

  .inline-table .table-in-form {
    float: left;
    margin-top: 20px;
  }

  .inline-table button {
    float: left;
    margin: 10px;
  }

  .inline-table .el-table {
    margin-top: 20px;
  }

  h1, h2, h3 {
    font-weight: normal;
    margin: 40px;
  }
</style>
