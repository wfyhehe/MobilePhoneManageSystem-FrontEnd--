<template>
  <div>
    <div class="role-manage">
      <h2>角色管理</h2>
      <el-table
        :data="roles"
        style="width: 100%"
        @header-click="addRole"
        align="left"
        v-loading.body="loading">
        <el-table-column
          class="column"
          prop="name"
          label="角色名称　＋添加角色">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="角色说明">
        </el-table-column>
        <el-table-column
          prop="status"
          label="角色状态">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button :plain="true" type="info" icon="edit" size="small"
                       @click="editRole(scope.row)"></el-button>
            <el-button :plain="true" type="danger" icon="delete" size="small"
                       @click="deleteRole(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="recover">
        <el-button @click="getDeletedRoles" :plain="true" v-show="!showDeleted" type="info">显示已删除角色</el-button>
        <el-button @click="hideRecover" :plain="true" v-show="showDeleted" type="info">隐藏已删除角色</el-button>
      </div>
      <el-table
        v-if="showDeleted"
        class="form2"
        :data="deletedRoles"
        row-class-name="deleted-row"
        style="width: 100%"
        align="left"
        v-loading.body="loadingDeleted">
        <el-table-column
          class="column"
          prop="name"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="角色说明">
        </el-table-column>
        <el-table-column
          prop="status"
          label="角色状态">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button
              size="small"
              @click="recoverRole(scope.row)">恢复</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import axios from 'axios'
  import {backEndUrl, SUCCESS} from '@/common/config'

  export default {
    data() {
      return {
        roles: [],
        deletedRoles: [],
        loading: true,
        loadingDeleted: true,
        showDeleted: false
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'getRoles'
    },
    methods: {
      getRoles() {
        this.loading = true
        let self = this
        let roleUrl = `${backEndUrl}/role/get_roles.do`
        axios.get(roleUrl, {
          params: {}
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.roles = response.data.data
            self.loading = false
          }
        })
      },
      addRole(column) {
        if (column.label === '角色名称　＋添加角色') {
          let self = this
          let addRoleUrl = `${backEndUrl}/role/add_role.do`
          axios.post(addRoleUrl, {
            name: '新建角色'
          }, {
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).then((response) => {
            if (response.data.status === SUCCESS) {
              this.getRoles()
            }
          })
        }
      },
      deleteRole(row) {
        let self = this
        let deleteUrl = `${backEndUrl}/role/delete_role.do`
        this.$confirm('此操作将删除角色, 是否继续？（可操作数据库进行恢复）', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }).then(() => {
          axios.get(deleteUrl, {
            params: {
              id: row.id
            }
          }).then((response) => {
            if (response.data.status === SUCCESS) {
              self.getRoles()
            }
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
        })
      },
      editRole(row) {
        this.$router.push(`/role_manage/${row.id}`)
      },
      recoverRole(row) {
        let self = this
        let recoverRoleUrl = `${backEndUrl}/role/recover_role.do`
        axios.get(recoverRoleUrl, {
          params:{
            id: row.id
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.getRoles()
            self.getDeletedRoles()
            self.$message.success('恢复成功')
          }
        })
      },
      getDeletedRoles() {
        this.showDeleted = true
        this.loadingDeleted = true
        let self = this
        let deletedRoleUrl = `${backEndUrl}/role/get_deleted_roles.do`
        axios.get(deletedRoleUrl, {
          params: {}
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.deletedRoles = response.data.data
            self.loadingDeleted = false
          }
        })
      },
      hideRecover() {
        this.showDeleted = false
        this.loadingDeleted = false
      }
    },
    mounted() {
      this.getRoles()
    }
  }
</script>

<style>
  th .cell {
    cursor: pointer;
  }

  .role-manage {
  }

  .form2 {
    margin: 100px 0;
  }

  .el-table .deleted-row {
    background-color: rgba(255, 73, 73, 0.56);
  }

  .recover {
    float: right;
    margin: 10px 40px 10px 0;
  }

  h1, h2, h3 {
    margin: 30px;
  }
</style>
