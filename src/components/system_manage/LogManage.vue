<template>
  <div>
    <div class="user-manage" v-if="false">
      <h2>用户管理</h2>
      <div class="search">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="用户名">
            <el-input v-model="searchForm.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item label="员工姓名">
            <el-input v-model="searchForm.empName" placeholder="员工姓名"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="users"
        style="width: 100%"
        align="left"
        :default-sort="{prop: 'lastLoginTime', order: 'descending'}"
        v-loading.body="loading">
        <el-table-column
          class="column"
          prop="username"
          sortable
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="empName"
          label="员工姓名">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="createTime"
          sortable
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="lastLoginTime"
          sortable
          label="上次登录时间">
        </el-table-column>
        <el-table-column
          label="角色">
          <template scope="scope">
            <span v-for="role in scope.row.roles">{{role.name}},&nbsp;</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button :plain="true" type="info" icon="edit" size="small"
                       @click="editUser(scope.row)"></el-button>
            <el-button :plain="true" type="danger" icon="delete" size="small"
                       @click="deleteUser(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="recover">
        <el-button @click="getDeletedUsers" :plain="true" v-show="!showDeleted" type="info">显示已删除用户</el-button>
        <el-button @click="hideRecover" :plain="true" v-show="showDeleted" type="info">隐藏已删除用户</el-button>
      </div>
      <el-table
        v-if="showDeleted"
        class="form2"
        :data="deletedUsers"
        row-class-name="deleted-row"
        style="width: 100%"
        align="left"
        :default-sort="{prop: 'createTime', order: 'descending'}"
        v-loading.body="loadingDeleted">
        <el-table-column
          class="column"
          prop="username"
          sortable
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="empName"
          label="员工姓名">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="createTime"
          sortable
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="lastLoginTime"
          sortable
          label="上次登录时间">
        </el-table-column>
        <el-table-column
          label="角色">
          <template scope="scope">
            <span v-for="role in scope.row.roles">{{role.name}},&nbsp;</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button
              size="small"
              @click="recoverUser(scope.row)">恢复
            </el-button>
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
  import {debounce} from '@/common/util'

  export default {
    data() {
      return {
        searchForm: {
          name: '',
          username: ''
        },
        users: [],
        deletedUsers: [],
        loading: true,
        loadingDeleted: true,
        showDeleted: false
      }
    },
    computed: {
      searchFormJson() {
        return JSON.stringify(this.searchForm)
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'getUsers',

      // 搜索表单出现变化后经过500ms自动向后端发送搜索请求
      searchFormJson: debounce(function () {
        this.search()
      }, 500)
    },
    methods: {
      search() {
        this.loading = true
        let self = this
        let searchUrl = `${backEndUrl}/user/get_users.do`
        axios.post(searchUrl, JSON.stringify({
          name: this.searchForm.name,
          username: this.searchForm.username
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.users = response.data.data
            for (let user of self.users) {
              user.empName = user.employee ? user.employee.name : ''
            }
            self.loading = false
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      getUsers() {
        this.loading = true
        let self = this
        let userUrl = `${backEndUrl}/user/get_users.do`
        axios.post(userUrl, {}).then((response) => {
          if (response.data.status === SUCCESS) {
            self.users = response.data.data
            for (let user of self.users) {
              user.empName = user.employee ? user.employee.name : ''
            }
            self.loading = false
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      deleteUser(row) {
        let self = this
        let deleteUrl = `${backEndUrl}/user/delete_user.do`
        this.$confirm('此操作将删除用户, 是否继续？（可操作数据库进行恢复）', '提示', {
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
              self.getUsers()
              self.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              self.$message({
                type: 'error',
                message: response.data.msg
              })
            }
          })
        }).catch(() => {
        })
      },
      editUser(row) {
        this.$router.push(`/user_manage/${row.id}`)
      },
      recoverUser(row) {
        let self = this
        let recoverUserUrl = `${backEndUrl}/user/recover_user.do`
        axios.get(recoverUserUrl, {
          params: {
            id: row.id
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.getUsers()
            self.getDeletedUsers()
            self.$message.success('恢复成功')
          }
        })
      },
      getDeletedUsers() {
        this.showDeleted = true
        this.loadingDeleted = true
        let self = this
        let deletedUserUrl = `${backEndUrl}/user/get_deleted_users.do`
        axios.get(deletedUserUrl, {
          params: {}
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.deletedUsers = response.data.data
            for (let user of self.deletedUsers) {
              user.empName = user.employee ? user.employee.name : ''
            }
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
      this.getUsers()
    }
  }
</script>

<style scoped>

  .user-manage {
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
