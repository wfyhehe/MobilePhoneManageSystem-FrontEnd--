<template>
  <div>
    <div class="rebate-type-manage">
      <h2>返利类型管理</h2>
      <el-button class="add" size="small" @click="addRebateType"><i class="el-icon-plus"></i> 添加新类型</el-button>
      <el-table
        :data="rebateTypes"
        style="width: 100%"
        align="left"
        :default-sort="{prop: 'name', order: 'ascending'}"
        v-loading.body="loading">
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button :plain="true" type="info" icon="edit" size="small"
                       @click="editRebateType(scope.row)"></el-button>
            <el-button :plain="true" type="danger" icon="delete" size="small"
                       @click="deleteRebateType(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="recover">
        <el-button @click="getDeletedRebateTypes" :plain="true" v-show="!showDeleted" type="info">显示已删除返利类型
        </el-button>
        <el-button @click="hideRecover" :plain="true" v-show="showDeleted" type="info">隐藏已删除返利类型</el-button>
      </div>
      <el-table
        v-if="showDeleted"
        class="form2"
        :data="deletedRebateTypes"
        row-class-name="deleted-row"
        style="width: 100%"
        align="left"
        :default-sort="{prop: 'name', order: 'ascending'}"
        v-loading.body="loadingDeleted">
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button
              size="small"
              @click="recoverRebateType(scope.row)">恢复
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="新建返利类型" :visible.sync="addFormVisible">
      <el-form :model="addForm" :rules="addRule" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
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

  export default {
    data() {
      let validateName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入名称'))
        } else {
          callback()
        }
      }
      return {
        addForm: {
          name: '',
          remark: ''
        },
        rebateTypes: [],
        deletedRebateTypes: [],
        addFormVisible: false,
        loading: true,
        loadingDeleted: true,
        showDeleted: false,
        addRule: {
          name: [
            {validator: validateName, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'getRebateTypes'
    },
    methods: {
      getRebateTypes(index) {
        if (index % 1 !== 0) {
          index = null
        }
        this.loading = true
        let self = this
        let searchUrl = `${backEndUrl}/rebate_type/get_rebate_types.do`
        axios.post(searchUrl, {}, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.rebateTypes = response.data.data
            self.loading = false
          }
        })
      },
      addRebateType() {
        this.addFormVisible = true
      },
      onAddSubmit() {
        let self = this
        let addRebateTypeUrl = `${backEndUrl}/rebate_type/add_rebate_type.do`
        axios.post(addRebateTypeUrl, JSON.stringify({
          name: self.addForm.name,
          remark: self.addForm.remark
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.$message.success('添加成功')
            self.getRebateTypes()
            self.addFormVisible = false
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      deleteRebateType(row) {
        let self = this
        let deleteUrl = `${backEndUrl}/rebate_type/delete_rebate_type.do`
        this.$confirm('此操作将删除返利类型, 是否继续？（可操作数据库进行恢复）', '提示', {
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
              self.getRebateTypes()
            }
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
        })
      },
      editRebateType(row) {
        this.$router.push(`/rebate_type/${row.id}`)
      },
      recoverRebateType(row) {
        let self = this
        let recoverRebateTypeUrl = `${backEndUrl}/rebate_type/recover_rebate_type.do`
        axios.get(recoverRebateTypeUrl, {
          params: {
            id: row.id
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.getRebateTypes()
            self.getDeletedRebateTypes()
            self.$message.success('恢复成功')
          }
        })
      },
      getDeletedRebateTypes() {
        this.showDeleted = true
        this.loadingDeleted = true
        let self = this
        let deletedRebateTypeUrl = `${backEndUrl}/rebate_type/get_deleted_rebate_types.do`
        axios.get(deletedRebateTypeUrl, {
          params: {}
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.deletedRebateTypes = response.data.data
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
      this.getRebateTypes()
    }
  }
</script>

<style scoped>
  .rebate-type-manage {
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
