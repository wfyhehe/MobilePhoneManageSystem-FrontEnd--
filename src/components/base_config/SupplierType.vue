<template>
  <div>
    <div class="supplier-type-manage">
      <h2>供应商类型管理</h2>
      <el-button class="add" size="small" @click="addSupplierType"><i class="el-icon-plus"></i> 添加新类型</el-button>
      <el-table
        :data="supplierTypes"
        style="width: 100%"
        align="left"
        :default-sort="{prop: 'id', order: 'ascending'}"
        v-loading.body="loading">
        <el-table-column
          class="column"
          prop="id"
          sortable
          label="供应商类型编号">
        </el-table-column>
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
                       @click="editSupplierType(scope.row)"></el-button>
            <el-button :plain="true" type="danger" icon="delete" size="small"
                       @click="deleteSupplierType(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="recover">
        <el-button @click="getDeletedSupplierTypes" :plain="true" v-show="!showDeleted" type="info">显示已删除供应商类型
        </el-button>
        <el-button @click="hideRecover" :plain="true" v-show="showDeleted" type="info">隐藏已删除供应商类型</el-button>
      </div>
      <el-table
        v-if="showDeleted"
        class="form2"
        :data="deletedSupplierTypes"
        row-class-name="deleted-row"
        style="width: 100%"
        align="left"
        :default-sort="{prop: 'id', order: 'ascending'}"
        v-loading.body="loadingDeleted">
        <el-table-column
          class="column"
          prop="id"
          sortable
          label="供应商类型编号">
        </el-table-column>
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
              @click="recoverSupplierType(scope.row)">恢复
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="新建供应商类型" :visible.sync="addFormVisible">
      <el-form :model="addForm" :rules="addRule" label-width="100px">
        <el-form-item label="供应商类型编号" prop="id">
          <el-input v-model="addForm.id"></el-input>
        </el-form-item>
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
      let validateId = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入编号'));
        } else if (!/^[0-9A-Z-]{1,15}$/.test(value)) {
          callback(new Error('编号必须由1-15位数字、大写字母、减号组成'));
        } else {
          let checkSupplierTypeIdUrl = `${backEndUrl}/supplier_type/check_supplier_type.do`
          axios.get(checkSupplierTypeIdUrl, {
            params: {
              id: value
            }
          }).then((response) => {
            if (response.data.status !== SUCCESS) {
              // 编号已存在
              callback(new Error(response.data.msg))
            } else {
              callback();
            }
          })
        }
      }
      let validateName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入名称'))
        } else {
          callback()
        }
      }
      return {
        addForm: {
          id: '',
          name: '',
          remark: ''
        },
        supplierTypes: [],
        deletedSupplierTypes: [],
        addFormVisible: false,
        loading: true,
        loadingDeleted: true,
        showDeleted: false,
        addRule: {
          id: [
            {validator: validateId, trigger: 'blur'}
          ],
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
      '$route': 'getSupplierTypes'
    },
    methods: {
      getSupplierTypes(index) {
        if (index % 1 !== 0) {
          index = null
        }
        this.loading = true
        let self = this
        let searchUrl = `${backEndUrl}/supplier_type/get_supplier_types.do`
        axios.post(searchUrl, {}, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.supplierTypes = response.data.data
            self.loading = false
          }
        })
      },
      addSupplierType() {
        this.addFormVisible = true
      },
      onAddSubmit() {
        let self = this
        let addSupplierTypeUrl = `${backEndUrl}/supplier_type/add_supplier_type.do`
        axios.post(addSupplierTypeUrl, JSON.stringify({
          id: self.addForm.id,
          name: self.addForm.name,
          remark: self.addForm.remark
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.$message.success('添加成功')
            self.getSupplierTypes()
            self.addFormVisible = false
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      deleteSupplierType(row) {
        let self = this
        let deleteUrl = `${backEndUrl}/supplier_type/delete_supplier_type.do`
        this.$confirm('此操作将删除供应商类型, 是否继续？（可操作数据库进行恢复）', '提示', {
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
              self.getSupplierTypes()
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
      editSupplierType(row) {
        this.$router.push(`/supplier_type/${row.id}`)
      },
      recoverSupplierType(row) {
        let self = this
        let recoverSupplierTypeUrl = `${backEndUrl}/supplier_type/recover_supplier_type.do`
        axios.get(recoverSupplierTypeUrl, {
          params: {
            id: row.id
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.getSupplierTypes()
            self.getDeletedSupplierTypes()
            self.$message.success('恢复成功')
          }
        })
      },
      getDeletedSupplierTypes() {
        this.showDeleted = true
        this.loadingDeleted = true
        let self = this
        let deletedSupplierTypeUrl = `${backEndUrl}/supplier_type/get_deleted_supplier_types.do`
        axios.get(deletedSupplierTypeUrl, {
          params: {}
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.deletedSupplierTypes = response.data.data
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
      this.getSupplierTypes()
    }
  }
</script>

<style scoped>
  .supplier-type-manage {
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
