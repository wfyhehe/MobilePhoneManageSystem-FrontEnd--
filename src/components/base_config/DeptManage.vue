<template>
  <div>
    <div class="dept-manage">
      <h2>部门管理</h2>
      <el-button class="add" size="small" @click="addDept"><i class="el-icon-plus"></i> 添加新部门</el-button>
      <el-table
        :data="depts"
        style="width: 100%"
        align="left"
        v-loading.body="loading">
        <el-table-column
          class="column"
          prop="name"
          label="部门名称">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
        <el-table-column
          prop="tel"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="contact"
          label="联系人">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button :plain="true" type="info" icon="edit" size="small"
                       @click="editDept(scope.row)"></el-button>
            <el-button :plain="true" type="danger" icon="delete" size="small"
                       @click="deleteDept(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="recover">
        <el-button @click="getDeletedDepts" :plain="true" v-show="!showDeleted" type="info">显示已删除部门</el-button>
        <el-button @click="hideRecover" :plain="true" v-show="showDeleted" type="info">隐藏已删除部门</el-button>
      </div>
      <el-table
        v-if="showDeleted"
        class="form2"
        :data="deletedDepts"
        row-class-name="deleted-row"
        style="width: 100%"
        align="left"
        v-loading.body="loadingDeleted">
        <el-table-column
          class="column"
          prop="name"
          label="部门名称">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
        <el-table-column
          prop="tel"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="contact"
          label="联系人">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button
              size="small"
              @click="recoverDept(scope.row)">恢复
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

  export default {
    data() {
      return {
        depts: [],
        deletedDepts: [],
        loading: true,
        loadingDeleted: true,
        showDeleted: false
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'getDepts'
    },
    methods: {
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
      addDept() {
        let self = this
        let addDeptUrl = `${backEndUrl}/dept/add_dept.do`
        axios.post(addDeptUrl, JSON.stringify({
          name: '新建部门',
          address: '比基尼海滩裤头村菠萝屋'
        }), {
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            this.getDepts()
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      deleteDept(row) {
        let self = this
        let deleteUrl = `${backEndUrl}/dept/delete_dept.do`
        this.$confirm('此操作将删除部门, 是否继续？（可操作数据库进行恢复）', '提示', {
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
              self.getDepts()
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
      editDept(row) {
        this.$router.push(`/dept_manage/${row.id}`)
      },
      recoverDept(row) {
        let self = this
        let recoverDeptUrl = `${backEndUrl}/dept/recover_dept.do`
        axios.get(recoverDeptUrl, {
          params: {
            id: row.id
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.getDepts()
            self.getDeletedDepts()
            self.$message.success('恢复成功')
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      getDeletedDepts() {
        this.showDeleted = true
        this.loadingDeleted = true
        let self = this
        let deletedDeptUrl = `${backEndUrl}/dept/get_deleted_depts.do`
        axios.get(deletedDeptUrl, {
          params: {}
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.deletedDepts = response.data.data
            self.loadingDeleted = false
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      hideRecover() {
        this.showDeleted = false
        this.loadingDeleted = false
      }
    },
    mounted() {
      this.getDepts()
    }
  }
</script>

<style scoped>

  .dept-manage {
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
