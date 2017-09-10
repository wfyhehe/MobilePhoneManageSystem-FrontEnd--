<template>
  <div>
    <div class="mobile-model-manage">
      <h2>手机型号管理</h2>
      <!--<button @click="test">test</button>-->
      <el-button class="add" size="small" @click="addMobileModel"><i class="el-icon-plus"></i> 添加手机型号</el-button>
      <div class="search">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="手机型号">
            <el-input v-model="searchForm.name" placeholder="手机型号"></el-input>
          </el-form-item>
          <el-form-item label="品牌">
            <el-select v-model="searchForm.brand"
                       placeholder="品牌"
                       @visible-change="selectShowed">
              <el-option label="所有品牌" value=""></el-option>
              <el-option v-for="(brand, i) in brands" :key="i" :label="brand.name"
                         :value="brand.name"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="mobileModels"
        style="width: 100%"
        align="left"
        :default-sort="{prop: 'id', order: 'ascending'}"
        v-loading.body="loading">
        <el-table-column
          class="column"
          prop="id"
          sortable
          label="手机型号编号">
        </el-table-column>
        <el-table-column
          class="column"
          prop="name"
          label="型号名">
        </el-table-column>
        <el-table-column
          prop="brand.name"
          sortable
          label="品牌">
        </el-table-column>
        <el-table-column
          prop="buyingPrice"
          label="进货价">
        </el-table-column>
        <el-table-column
          prop="rebatePrices"
          label="返利价格">
          <template scope="scope">
            <el-popover trigger="hover" placement="top">
              <el-table
                :fit="false"
                :data="scope.row.rebatePrices">
                <el-table-column
                  width="150"
                  prop="rebateType.name"
                  label="返利类别">
                </el-table-column>
                <el-table-column
                  width="120"
                  prop="price"
                  label="返利价格">
                </el-table-column>
              </el-table>
              <div slot="reference" class="name-wrapper">
                <el-tag>查看返利价格</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button :plain="true" type="info" icon="edit" size="small"
                       @click="editMobileModel(scope.row)"></el-button>
            <el-button :plain="true" type="danger" icon="delete" size="small"
                       @click="deleteMobileModel(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :total="count"
        class="pagination"
        :current-page="pageIndex"
        :page-size="pageSize"
        @current-change="getMobileModels">
      </el-pagination>
      <div class="recover">
        <el-button @click="getDeletedMobileModels"
                   :plain="true"
                   v-show="!showDeleted"
                   type="info">显示已删除手机型号
        </el-button>
        <el-button @click="hideRecover"
                   :plain="true"
                   v-show="showDeleted"
                   type="info">隐藏已删除手机型号
        </el-button>
      </div>
      <el-table
        v-if="showDeleted"
        class="form2"
        :data="deletedMobileModels"
        row-class-name="deleted-row"
        style="width: 100%"
        align="left"
        :default-sort="{prop: 'id', order: 'descending'}"
        v-loading.body="loadingDeleted">
        <el-table-column
          class="column"
          prop="id"
          sortable
          label="手机型号编号">
        </el-table-column>
        <el-table-column
          class="column"
          prop="name"
          label="型号名">
        </el-table-column>
        <el-table-column
          prop="brand.name"
          sortable
          label="品牌">
        </el-table-column>
        <el-table-column
          prop="buyingPrice"
          label="进货价">
        </el-table-column>
        <el-table-column
          prop="rebatePrices"
          label="返利价格">
          <template scope="scope">
            <el-popover trigger="hover" placement="top">
              <el-table
                :fit="false"
                :data="scope.row.rebatePrices">
                <el-table-column
                  width="150"
                  prop="rebateType.name"
                  label="返利类别">
                </el-table-column>
                <el-table-column
                  width="120"
                  prop="price"
                  label="返利价格">
                </el-table-column>
              </el-table>
              <div slot="reference" class="name-wrapper">
                <el-tag>查看返利价格</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button
              size="small"
              @click="recoverMobileModel(scope.row)">恢复
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="新建手机型号" :visible.sync="addFormVisible">
      <el-form :model="addForm" :rules="addRule" label-width="100px">
        <el-form-item label="手机型号编号" prop="id">
          <el-input v-model="addForm.id"></el-input>
        </el-form-item>
        <el-form-item label="型号名" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select v-model="addForm.brand"
                     placeholder="请选择品牌"
                     @visible-change="selectShowed">
            <el-option v-for="(item, i) in brands"
                       :key="i"
                       :label="item.name"
                       :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="进货价" prop="buyingPrice">
          <el-input v-model="addForm.buyingPrice"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="addForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="返利价格设置">
          <div class="inline-table">
            <el-form :inline="true"
                     :rules="addRule"
                     :model="addForm.rebatePriceForm">
              <el-form-item>
                <el-select v-model="addForm.rebatePriceForm.rebateType"
                           placeholder="返利类型"
                           valueKey="id"
                           @visible-change="selectShowed">
                  <el-option v-for="(rebateType, i) in rebateTypes"
                             :value-key="rebateType.id"
                             :key="i"
                             :label="rebateType.name"
                             :disabled="isAdded(rebateType)"
                             :value="rebateType"></el-option>
                             <!--:value="JSON.stringify(rebateType)"></el-option>-->
                </el-select>
              </el-form-item>
              <el-form-item prop="price">
                <el-input v-model="addForm.rebatePriceForm.price"
                          placeholder="返利价格"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="addRebatePrice">添加</el-button>
              </el-form-item>
            </el-form>
            <el-table
              :data="addForm.rebatePrices">
              <el-table-column
                prop="rebateType.name"
                label="返利类型">
              </el-table-column>
              <el-table-column
                prop="price"
                label="返利价格">
              </el-table-column>
              <el-table-column label="操作">
                <template scope="scope">
                  <el-button :plain="true" type="danger" icon="delete" size="small"
                             @click="removeRebatePrice(scope.row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
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
          let checkMobileModelIdUrl = `${backEndUrl}/mobile_model/check_mobile_model.do`
          axios.get(checkMobileModelIdUrl, {
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
      let validateBuyingPrice = (rule, value, callback) => {
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
          brand: '',
        },
        addForm: {
          id: '',
          name: '',
          brand: {},
          buyingPrice: '',
          remark: '',
          rebatePrices: [],
          rebatePriceForm: {
            rebateType: {},
            price: 0
          }
        },
        mobileModels: [],
        deletedMobileModels: [],
        brands: [],
        rebateTypes: [],
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
          buyingPrice: [
            {validator: validateBuyingPrice, trigger: 'blur'}
          ],
          price: [
            {validator: validateBuyingPrice, trigger: 'blur'}
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
        this.getMobileModels()
      }, 500),
      '$route': 'getMobileModels'
    },
    methods: {
      test() {
        console.log(this.searchForm)
        console.log(this.brands)
        console.log(this.rebateTypes)
      },
      getMobileModels(index) {
        if (index % 1 !== 0) {
          index = null
        }
        this.loading = true
        let self = this
        let searchUrl = `${backEndUrl}/mobile_model/get_mobile_models.do`
        axios.post(searchUrl, JSON.stringify({
          name: self.searchForm.name,
          brand: self.searchForm.brand,
          pageIndex: index || self.pageIndex,
          pageSize: PAGE_SIZE
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.mobileModels = response.data.data
            self.count = response.data.count
            self.loading = false
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      addMobileModel() {
        this.addFormVisible = true
      },
      onAddSubmit() {
        let self = this
        for (let rebatePrice of this.addForm.rebatePrices) {
          rebatePrice.mobileModel = {id: this.addForm.id}
        }
        let addMobileModelUrl = `${backEndUrl}/mobile_model/add_mobile_model.do`
        axios.post(addMobileModelUrl, JSON.stringify({
          id: self.addForm.id,
          name: self.addForm.name,
          brand: self.addForm.brand,
          buyingPrice: self.addForm.buyingPrice,
          rebatePrices: self.addForm.rebatePrices,
          remark: self.addForm.remark
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.$message.success('添加成功')
            self.getMobileModels()
            self.addFormVisible = false
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      deleteMobileModel(row) {
        let self = this
        let deleteUrl = `${backEndUrl}/mobile_model/delete_mobile_model.do`
        this.$confirm('此操作将删除手机型号, 是否继续？（可操作数据库进行恢复）', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          brand: 'danger'
        }).then(() => {
          axios.get(deleteUrl, {
            params: {
              id: row.id
            }
          }).then((response) => {
            if (response.data.status === SUCCESS) {
              self.getMobileModels()
              self.$message({
                brand: 'success',
                message: '删除成功!'
              })
            } else {
              self.$message({
                brand: 'error',
                message: response.data.msg
              })
            }
          })
        }).catch(() => {
        })
      },
      editMobileModel(row) {
        this.$router.push(`/mobile_model/${row.id}`)
      },
      recoverMobileModel(row) {
        let self = this
        let recoverMobileModelUrl = `${backEndUrl}/mobile_model/recover_mobile_model.do`
        axios.get(recoverMobileModelUrl, {
          params: {
            id: row.id
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.getMobileModels()
            self.getDeletedMobileModels()
            self.$message.success('恢复成功')
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      getDeletedMobileModels() {
        this.showDeleted = true
        this.loadingDeleted = true
        let self = this
        let deletedMobileModelUrl = `${backEndUrl}/mobile_model/get_deleted_mobile_models.do`
        axios.get(deletedMobileModelUrl, {
          params: {}
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.deletedMobileModels = response.data.data
            self.loadingDeleted = false
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      getBrands() {
        let self = this
        let brandUrl = `${backEndUrl}/brand/get_brands.do`
        axios.post(brandUrl, {}, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.brands = response.data.data
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      getRebateTypes() {
        let self = this
        let searchUrl = `${backEndUrl}/rebate_type/get_rebate_types.do`
        axios.post(searchUrl, {}, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.rebateTypes = response.data.data
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      addRebatePrice() {
        if (!this.addForm.rebatePriceForm) {
          return false
        }
        let rebatePriceObj = JSON.parse(JSON.stringify(this.addForm.rebatePriceForm))
//        rebatePriceObj.rebateType = JSON.parse(rebatePriceObj.rebateType)
        if (this.isAdded(rebatePriceObj.rebateType)) {
          return false
        }
        this.addForm.rebatePrices.push(rebatePriceObj)
      },
      removeRebatePrice(row) {
        this.addForm.rebatePrices = this.addForm.rebatePrices.filter((rebatePrice) => {
          return rebatePrice.rebateType.id !== row.rebateType.id
        })
      },
      selectShowed(flag) {
        if (flag && (this.brands.length === 0 || this.rebateTypes.length === 0)) {
          this.getBrands()
          this.getRebateTypes()
        }
      },
      isAdded(row) {
        for (let rebatePrice of this.addForm.rebatePrices) {
          if (rebatePrice.rebateType.id === row.id) {
            return true
          }
        }
        return false
      },
      hideRecover() {
        this.showDeleted = false
        this.loadingDeleted = false
      }
    },
    mounted() {
      this.getMobileModels()
    }
  }
</script>

<style scoped>

  .mobile-model-manage {
  }

  .form2 {
    margin: 100px 0;
  }

  .inline-table * {
    float: left;
  }

  .inline-table .el-table {
    margin-top: 20px;
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
