<template>
  <div>
    <div class="supplier-manage">
      <h2>供应商管理</h2>
      <el-button class="add" size="small" @click="addSupplier"><i class="el-icon-plus"></i> 添加供应商</el-button>
      <div class="search">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="供应商名">
            <el-input v-model="searchForm.name" placeholder="供应商名"></el-input>
          </el-form-item>
          <el-form-item label="类别">
            <el-select v-model="searchForm.type"
                       placeholder="类别"
                       @visible-change="selectShowed">
              <el-option label="所有类别" value=""></el-option>
              <el-option v-for="(type, i) in types" :key="i" :label="type.name" :value="type.name"></el-option>
            </el-select>
            <!--<el-input v-model="searchForm.type" placeholder="类别"></el-input>-->
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="suppliers"
        style="width: 100%"
        align="left"
        :default-sort="{prop: 'id', order: 'ascending'}"
        v-loading.body="loading">
        <el-table-column
          class="column"
          prop="id"
          sortable
          label="供应商编号">
        </el-table-column>
        <el-table-column
          class="column"
          prop="name"
          label="供应商名称">
        </el-table-column>
        <el-table-column
          prop="type.name"
          sortable
          label="类别">
        </el-table-column>
        <el-table-column
          prop="contact"
          label="联系人">
        </el-table-column>
        <el-table-column
          prop="tel"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="email"
          label="E-Mail">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button :plain="true" type="info" icon="edit" size="small"
                       @click="editSupplier(scope.row)"></el-button>
            <el-button :plain="true" type="danger" icon="delete" size="small"
                       @click="deleteSupplier(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :total="count"
        class="pagination"
        :current-page="pageIndex"
        :page-size="pageSize"
        @current-change="getSuppliers">
      </el-pagination>
      <div class="recover">
        <el-button @click="getDeletedSuppliers" :plain="true" v-show="!showDeleted" type="info">显示已删除供应商</el-button>
        <el-button @click="hideRecover" :plain="true" v-show="showDeleted" type="info">隐藏已删除供应商</el-button>
      </div>
      <el-table
        v-if="showDeleted"
        class="form2"
        :data="deletedSuppliers"
        row-class-name="deleted-row"
        style="width: 100%"
        align="left"
        :default-sort="{prop: 'type.name', order: 'descending'}"
        v-loading.body="loadingDeleted">
        <el-table-column
          class="column"
          prop="name"
          sortable
          label="供应商名称">
        </el-table-column>
        <el-table-column
          prop="type.name"
          sortable
          label="类别">
        </el-table-column>
        <el-table-column
          prop="contact"
          label="联系人">
        </el-table-column>
        <el-table-column
          prop="tel"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="email"
          label="E-Mail">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button
              size="small"
              @click="recoverSupplier(scope.row)">恢复
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="新建供应商" :visible.sync="addFormVisible">
      <el-form :model="addForm" :rules="addRule" label-width="100px">
        <el-form-item label="供应商编号" prop="id">
          <el-input v-model="addForm.id"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="type">
          <el-select v-model="addForm.type" placeholder="请选择类别" @visible-change="selectShowed">
            <el-option label="未定" value=""></el-option>
            <el-option v-for="(item, i) in types" :key="i" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="addForm.contact"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="addForm.tel"></el-input>
        </el-form-item>
        <el-form-item label="E-Mail" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="addForm.address"></el-input>
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

  const PAGE_SIZE = 10

  export default {
    data() {
      let validateId = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入编号'));
        } else if (!/^[0-9A-Z-]{1,15}$/.test(value)) {
          callback(new Error('编号必须由1-15位数字、大写字母、减号组成'));
        } else {
          let checkSupplierIdUrl = `${backEndUrl}/supplier/check_supplier.do`
          axios.get(checkSupplierIdUrl, {
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
      let validateEmail = (rule, value, callback) => {
        if (value) {
          if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
            callback(new Error('邮箱格式不正确'))
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
          type: ''
        },
        addForm: {
          id: '',
          name: '',
          type: '',
          contact: '',
          tel: '',
          email: '',
          address: '',
          remark: ''
        },
        suppliers: [],
        deletedSuppliers: [],
        types: [],
        addFormVisible: false,
        loading: true,
        loadingDeleted: true,
        showDeleted: false,
        pageIndex: 1,
        pageSize: PAGE_SIZE,
        count: 0,
        addRule: {
          id: [
            {validator: validateId, trigger: 'blur'}
          ],
          name: [
            {validator: validateName, trigger: 'blur'}
          ],
          email: [
            {validator: validateEmail, trigger: 'blur'}
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
        this.getSuppliers()
      }, 500),
      '$route': 'getSuppliers'
    },
    methods: {
      getSuppliers(index) {
        if (index % 1 !== 0) {
          index = null
        }
        this.loading = true
        let self = this
        let searchUrl = `${backEndUrl}/supplier/get_suppliers.do`
        axios.post(searchUrl, JSON.stringify({
          name: self.searchForm.name,
          type: self.searchForm.type,
          pageIndex: index || self.pageIndex,
          pageSize: PAGE_SIZE
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.suppliers = response.data.data
            self.count = response.data.count
            self.loading = false
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      addSupplier() {
        this.addFormVisible = true
      },
      onAddSubmit() {
        let self = this
        let addSupplierUrl = `${backEndUrl}/supplier/add_supplier.do`
        axios.post(addSupplierUrl, JSON.stringify({
          id: self.addForm.id,
          name: self.addForm.name,
          type: self.addForm.type,
          contact: self.addForm.contact,
          tel: self.addForm.tel,
          email: self.addForm.email,
          address: self.addForm.address,
          remark: self.addForm.remark
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.$message.success('添加成功')
            self.getSuppliers()
            self.addFormVisible = false
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      deleteSupplier(row) {
        let self = this
        let deleteUrl = `${backEndUrl}/supplier/delete_supplier.do`
        this.$confirm('此操作将删除供应商, 是否继续？（可操作数据库进行恢复）', '提示', {
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
              self.getSuppliers()
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
      editSupplier(row) {
        this.$router.push(`/supplier/${row.id}`)
      },
      recoverSupplier(row) {
        let self = this
        let recoverSupplierUrl = `${backEndUrl}/supplier/recover_supplier.do`
        axios.get(recoverSupplierUrl, {
          params: {
            id: row.id
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.getSuppliers()
            self.getDeletedSuppliers()
            self.$message.success('恢复成功')
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      getDeletedSuppliers() {
        this.showDeleted = true
        this.loadingDeleted = true
        let self = this
        let deletedSupplierUrl = `${backEndUrl}/supplier/get_deleted_suppliers.do`
        axios.get(deletedSupplierUrl, {
          params: {}
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.deletedSuppliers = response.data.data
            self.loadingDeleted = false
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      getTypes() {
        let self = this
        let typeUrl = `${backEndUrl}/supplier_type/get_supplier_types.do`
        axios.post(typeUrl, {}).then((response) => {
          if (response.data.status === SUCCESS) {
            self.types = response.data.data
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      selectShowed(flag) {
        if (flag) {
          this.getTypes()
        }
      },
      hideRecover() {
        this.showDeleted = false
        this.loadingDeleted = false
      },
    },
    mounted() {
      this.getSuppliers()
    }
  }
</script>

<style scoped>

  .supplier-manage {
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
