<template>
  <div>
    <div class="employee-manage">
      <h2>员工管理</h2>
      <div class="search">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="员工姓名">
            <el-input v-model="searchForm.name" placeholder="员工姓名"></el-input>
          </el-form-item>
          <el-form-item label="部门">
            <el-select v-model="searchForm.dept"
                       placeholder="部门"
                       @visible-change="selectShowed">
              <el-option label="所有部门" value=""></el-option>
              <el-option v-for="(dept, i) in depts" :key="i" :label="dept.name" :value="dept.name"></el-option>
            </el-select>
            <!--<el-input v-model="searchForm.dept" placeholder="部门"></el-input>-->
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="employees"
        style="width: 100%"
        @header-click="addEmployee"
        align="left"
        :default-sort="{prop: 'dept.name', order: 'descending'}"
        v-loading.body="loading">
        <el-table-column
          class="column"
          prop="name"
          sortable
          label="员工名称　＋添加员工">
        </el-table-column>
        <el-table-column
          prop="tel"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="type"
          sortable
          label="类别">
        </el-table-column>
        <el-table-column
          prop="dept.name"
          sortable
          label="部门">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="user.username"
          label="账号">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button :plain="true" type="info" icon="edit" size="small"
                       @click="editEmployee(scope.row)"></el-button>
            <el-button :plain="true" type="danger" icon="delete" size="small"
                       @click="deleteEmployee(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="recover">
        <el-button @click="getDeletedEmployees" :plain="true" v-show="!showDeleted" type="info">显示已删除员工</el-button>
        <el-button @click="hideRecover" :plain="true" v-show="showDeleted" type="info">隐藏已删除员工</el-button>
      </div>
      <el-table
        v-if="showDeleted"
        class="form2"
        :data="deletedEmployees"
        row-class-name="deleted-row"
        style="width: 100%"
        align="left"
        :default-sort="{prop: 'dept.name', order: 'descending'}"
        v-loading.body="loadingDeleted">
        <el-table-column
          class="column"
          prop="name"
          label="员工名称"
          sortable>
        </el-table-column>
        <el-table-column
          prop="tel"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类别"
          sortable>
        </el-table-column>
        <el-table-column
          prop="dept.name"
          label="部门"
          sortable>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="user"
          label="账号">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button
              size="small"
              @click="recoverEmployee(scope.row)">恢复
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
          dept: ''
        },
        employees: [],
        deletedEmployees: [],
        depts: [],
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
      '$route': 'getEmployees',
      searchFormJson: debounce(function () {
        this.search()
      }, 500)
    },
    methods: {
      search() {
        this.loading = true
        let self = this
        let searchUrl = `${backEndUrl}/employee/get_employees.do`
        axios.post(searchUrl, JSON.stringify({
          name: this.searchForm.name,
          dept: this.searchForm.dept
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.employees = response.data.data
            self.loading = false
          }
        })
      },
      getEmployees() {
        this.loading = true
        let self = this
        let employeeUrl = `${backEndUrl}/employee/get_employees.do`
        axios.post(employeeUrl, {}).then((response) => {
          if (response.data.status === SUCCESS) {
            self.employees = response.data.data
            self.loading = false
          }
        })
      },
      addEmployee(column) {
        if (column.label === '员工名称　＋添加员工') {
          let self = this
          let addEmployeeUrl = `${backEndUrl}/employee/add_employee.do`
          axios.post(addEmployeeUrl, {
            name: '新建员工'
          }, {
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).then((response) => {
            if (response.data.status === SUCCESS) {
              this.getEmployees()
            }
          })
        }
      },
      deleteEmployee(row) {
        let self = this
        let deleteUrl = `${backEndUrl}/employee/delete_employee.do`
        this.$confirm('此操作将删除员工, 是否继续？（可操作数据库进行恢复）', '提示', {
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
              self.getEmployees()
            }
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          return
        })
      },
      editEmployee(row) {
        this.$router.push(`/employee_manage/${row.id}`)
      },
      recoverEmployee(row) {
        let self = this
        let recoverEmployeeUrl = `${backEndUrl}/employee/recover_employee.do`
        axios.get(recoverEmployeeUrl, {
          params: {
            id: row.id
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.getEmployees()
            self.getDeletedEmployees()
            self.$message.success('恢复成功')
          }
        })
      },
      getDeletedEmployees() {
        this.showDeleted = true
        this.loadingDeleted = true
        let self = this
        let deletedEmployeeUrl = `${backEndUrl}/employee/get_deleted_employees.do`
        axios.get(deletedEmployeeUrl, {
          params: {}
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.deletedEmployees = response.data.data
            self.loadingDeleted = false
          }
        })
      },
      getDepts() {
        let self = this
        let deptUrl = `${backEndUrl}/dept/get_depts.do`
        axios.get(deptUrl, {
          params: {}
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.depts = response.data.data
          }
        })
      },
      selectShowed(flag) {
        if (flag && this.depts.length === 0) {
          this.getDepts()
        }
      },
      hideRecover() {
        this.showDeleted = false
        this.loadingDeleted = false
      }
    },
    mounted() {
      console.log(this)
      this.getEmployees()
    }
  }
</script>

<style>
  /*th .cell {*/
  /*cursor: pointer;*/
  /*}*/

  .employee-manage {
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
