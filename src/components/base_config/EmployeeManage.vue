<template>
  <div>
    <div class="employee-manage">
      <h2>员工管理</h2>
      <el-button class="add" size="small" @click="addEmployee"><i class="el-icon-plus"></i> 添加新员工</el-button>
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
            <el-button type="primary" @click="getEmployees">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="employees"
        style="width: 100%"
        align="left"
        :default-sort="{prop: 'dept.name', order: 'descending'}"
        v-loading.body="loading">
        <el-table-column
          class="column"
          prop="name"
          sortable
          label="员工名称">
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
          <template scope="scope">
            {{scope.row.user ? scope.row.user.username : '[无]'}}
            <el-button
              size="small"
              v-if="!scope.row.user"
              @click="relateUser(scope.row)">关联账号
            </el-button>
            <el-button
              size="small"
              v-if="scope.row.user"
              @click="unrelateUser(scope.row)">解除关联
            </el-button>
          </template>
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
      <el-pagination
        layout="prev, pager, next"
        :total="count"
        :current-page="pageIndex"
        :page-size="pageSize"
        @current-change="getEmployees">
      </el-pagination>
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
    <el-dialog title="关联账号" :visible.sync="relateFormVisible">
      <el-form :model="relateForm" :rules="loginRule" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="relateForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="relateForm.password" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="relateFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="relateSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新建员工" :visible.sync="addFormVisible">
      <el-form :model="addForm" :rules="addRule" label-width="100px">
        <el-form-item label="员工姓名">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="addForm.tel"></el-input>
        </el-form-item>
        <el-form-item label="类别">
          <el-switch
            v-model="addForm.type"
            :width="80"
            on-text="销售员"
            off-text="其他">
          </el-switch>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="addForm.dept" placeholder="请选择部门" @visible-change="selectShowed">
            <el-option label="未定" value=""></el-option>
            <el-option v-for="(item, i) in depts" :key="i" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAddSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <router-view></router-view>
  </div>
</template>

<script>
  import axios from 'axios'
  import {backEndUrl, SUCCESS} from '@/common/config'
  import {debounce} from '@/common/util'
  import {mapGetters} from 'vuex'

  const PAGE_SIZE = 10

  export default {
    data() {
      let validateUsername = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入用户名'));
        } else if (!/^\w{5,18}$/.test(value)) {
          callback(new Error('用户名必须由5-18位数字、字母、下划线组成'));
        } else {
          callback();
        }
      }
      let validatePassword = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'))
        } else if (!/^.{5,18}$/.test(value)) {
          callback(new Error('密码长度必须为5-18位'))
        } else {
          callback()
        }
      }
      return {
        searchForm: {
          name: '',
          dept: ''
        },
        relateForm: {
          username: this.username || '',
          password: ''
        },
        addForm: {
          name: '',
          tel: '',
          type: true,
          dept: '',
          remark: '',
          username: ''
        },
        employees: [],
        deletedEmployees: [],
        depts: [],
        currentEmpId: '',
        relateFormVisible: false,
        addFormVisible: false,
        loading: true,
        loadingDeleted: true,
        showDeleted: false,
        pageIndex: 1,
        pageSize: PAGE_SIZE,
        count: 0,
        loginRule: {
          username: [
            {validator: validateUsername, trigger: 'blur'}
          ],
          password: [
            {validator: validatePassword, trigger: 'blur'}
          ]
        },
        addRule: {}
      }
    },
    computed: {
      searchFormJson() {
        return JSON.stringify(this.searchForm)
      },
      ...mapGetters([
        'username'
      ])
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      searchFormJson: debounce(function () {
        this.getEmployees()
      }, 500),
      '$route': 'getEmployees'
    },
    methods: {
      getEmployees(index) {
        if (index % 1 !== 0) {
          index = null
        }
        this.loading = true
        let self = this
        let searchUrl = `${backEndUrl}/employee/get_employees.do`
        axios.post(searchUrl, JSON.stringify({
          name: self.searchForm.name,
          dept: self.searchForm.dept,
          pageIndex: index || self.pageIndex,
          pageSize: PAGE_SIZE
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.employees = response.data.data
            self.count = response.data.count
            self.loading = false
          }
        })
      },
      addEmployee() {
        this.addFormVisible = true
      },
      onAddSubmit() {
        let self = this
        let addEmployeeUrl = `${backEndUrl}/employee/add_employee.do`
        axios.post(addEmployeeUrl, JSON.stringify({
          name: self.addForm.name,
          tel: self.addForm.tel,
          type: self.addForm.type ? 'SALES' : 'OTHER',
          dept: self.addForm.dept,
          remark: self.addForm.remark
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.$message.success('添加成功')
            self.getEmployees()
            self.addFormVisible = false
          } else {
            self.$message.error(response.data.msg)
          }
        })
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
      },
      relateUser(row) {
        this.currentEmpId = row.id
        this.relateFormVisible = true
      },
      relateSubmit() {
        let self = this
        let relateUrl = `${backEndUrl}/employee/relate_user.do`
        axios.post(relateUrl, JSON.stringify({
          id: self.currentEmpId,
          username: self.relateForm.username,
          password: self.relateForm.password
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            this.relateFormVisible = false
            self.$message.success('关联成功')
            self.getEmployees()
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      unrelateUser(row) {
        let self = this
        let unrelateUrl = `${backEndUrl}/employee/unrelate_user.do`
        this.$confirm('此操作将解除关联账号, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }).then(() => {
          axios.get(unrelateUrl, {
            params: {
              id: row.id
            }
          }).then((response) => {
            if (response.data.status === SUCCESS) {
              self.getEmployees()
              self.$message({
                type: 'success',
                message: '解除成功!'
              })
            } else {
              self.$message({
                type: 'error',
                message: '解除失败!'
              })
            }
          })
        }).catch(() => {
        })
      }
    },
    mounted() {
      this.relateForm.username = this.username || ''
      this.getEmployees()
    }
  }
</script>

<style scoped>

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

  .add {
    float: left;
    margin: 10px 40px 10px 10px;
  }

  h1, h2, h3 {
    margin: 30px;
  }
</style>
