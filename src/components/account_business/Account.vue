<template>
  <div>
    <div class="account-manage">
      <h2>账户管理</h2>
      <el-button class="add" size="small" @click="addAccount"><i class="el-icon-plus"></i> 添加账户</el-button>
      <div class="search">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="账户名">
            <el-input v-model="searchForm.name" placeholder="账户名"></el-input>
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
        </el-form>
      </div>
      <el-table
        :data="accounts"
        style="width: 100%"
        align="left"
        :default-sort="{prop: 'dept.name', order: 'ascending'}"
        v-loading.body="loading">
        <el-table-column
          class="column"
          prop="name"
          label="账户名">
        </el-table-column>
        <el-table-column
          prop="balance"
          label="余额"
          :formatter="balanceFormatter">
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
        <el-table-column label="操作">
          <template scope="scope">
            <el-button :plain="true" type="info" icon="edit" size="small"
                       @click="editAccount(scope.row)"></el-button>
            <el-button :plain="true" type="danger" icon="delete" size="small"
                       @click="deleteAccount(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :total="count"
        :current-page="pageIndex"
        :page-size="pageSize"
        @current-change="getAccounts">
      </el-pagination>
      <div class="recover">
        <el-button @click="getDeletedAccounts" :plain="true" v-show="!showDeleted" type="info">显示已删除账户</el-button>
        <el-button @click="hideRecover" :plain="true" v-show="showDeleted" type="info">隐藏已删除账户</el-button>
      </div>
      <el-table
        v-if="showDeleted"
        class="form2"
        :data="deletedAccounts"
        row-class-name="deleted-row"
        style="width: 100%"
        align="left"
        :default-sort="{prop: 'dept.name', order: 'ascending'}"
        v-loading.body="loadingDeleted">
        <el-table-column
          class="column"
          prop="name"
          label="账户名">
        </el-table-column>
        <el-table-column
          prop="balance"
          label="余额"
          :formatter="balanceFormatter">
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
        <el-table-column label="操作">
          <template scope="scope">
            <el-button
              size="small"
              @click="recoverAccount(scope.row)">恢复
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="新建账户" :visible.sync="addFormVisible">
      <el-form :model="addForm" :rules="addRule" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="余额" prop="balance">
          <el-input v-model="addForm.balance"></el-input>
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
  import {debounce, formatMoney} from '@/common/util'

  const PAGE_SIZE = 10

  export default {
    data() {
      let validateName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入名称'))
        } else {
          callback()
        }
      }
      let validateBalance = (rule, value, callback) => {
        console.log(value)
        if (value) {
          if (!/^\d+(\.\d+)?$/.test(value)) {
            callback(new Error('请输入非负实数'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      return {
        searchForm: {
          name: '',
          dept: ''
        },
        addForm: {
          id: '',
          name: '',
          dept: '',
          balance: 0,
          remark: ''
        },
        accounts: [],
        deletedAccounts: [],
        depts: [],
        addFormVisible: false,
        loading: true,
        loadingDeleted: true,
        showDeleted: false,
        pageIndex: 1,
        pageSize: PAGE_SIZE,
        count: 0,
        addRule: {
          name: [
            {validator: validateName, trigger: 'blur'}
          ],
          balance: [
            {validator: validateBalance, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      searchFormJson() {
        return JSON.stringify(this.searchForm)
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      searchFormJson: debounce(function () {
        this.getAccounts()
      }, 500),
      '$route': 'getAccounts'
    },
    methods: {
      getAccounts(index) {
        if (index % 1 !== 0) {
          index = null
        }
        this.loading = true
        let self = this
        let searchUrl = `${backEndUrl}/account/get_accounts.do`
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
            self.accounts = response.data.data
            self.count = response.data.count
            self.loading = false
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      addAccount() {
        this.addFormVisible = true
      },
      onAddSubmit() {
        let self = this
        let addAccountUrl = `${backEndUrl}/account/add_account.do`
        axios.post(addAccountUrl, JSON.stringify({
          name: self.addForm.name,
          dept: self.addForm.dept,
          balance: self.addForm.balance,
          remark: self.addForm.remark
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.$message.success('添加成功')
            self.getAccounts()
            self.addFormVisible = false
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      deleteAccount(row) {
        let self = this
        let deleteUrl = `${backEndUrl}/account/delete_account.do`
        this.$confirm('此操作将删除账户, 是否继续？（可操作数据库进行恢复）', '提示', {
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
              self.getAccounts()
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
      editAccount(row) {
        this.$router.push(`/account/${row.id}`)
      },
      recoverAccount(row) {
        let self = this
        let recoverAccountUrl = `${backEndUrl}/account/recover_account.do`
        axios.get(recoverAccountUrl, {
          params: {
            id: row.id
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.getAccounts()
            self.getDeletedAccounts()
            self.$message.success('恢复成功')
          }
        })
      },
      getDeletedAccounts() {
        this.showDeleted = true
        this.loadingDeleted = true
        let self = this
        let deletedAccountUrl = `${backEndUrl}/account/get_deleted_accounts.do`
        axios.get(deletedAccountUrl, {
          params: {}
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.deletedAccounts = response.data.data
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
      balanceFormatter(row, column, cellValue) {
        let formatted = formatMoney(cellValue, 2)
        return '￥' + formatted
//
      },
      hideRecover() {
        this.showDeleted = false
        this.loadingDeleted = false
      },
    },
    mounted() {
      this.getAccounts()
    }
  }
</script>

<style scoped>

  .account-manage {
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
