<template>
  <div class="model-list-manage">
    <h2>入库单管理</h2>
    <!--<h2 v-for="item in inboundList">{{item}}</h2>-->
    <!--<el-button class="add" size="small" @click="turnToMobileInbound"><i class="el-icon-plus"></i> 转到入库界面</el-button>-->
    <div class="search">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="入库时间范围">
          <el-date-picker
            v-model="searchForm.inputTime"
            format="yyyy-MM-dd HH-mm-ss"
            type="datetimerange"
            :picker-options="pickerOptions"
            placeholder="选择时间范围">
          </el-date-picker>
        </el-form-item>
        <el-button class="add" type="primary" @click="turnToMobileInbound">转到入库界面</el-button>
        <br/>
        <el-form-item label="供应商类别">
          <el-select v-model="searchForm.supplierType"
                     placeholder="选择供应商类别"
                     valueKey="id"
                     @visible-change="getOptions"
                     @change="getSuppliers">
            <el-option label="不限" value=""></el-option>
            <el-option v-for="supplierType in supplierTypes"
                       :key="supplierType.id"
                       :label="supplierType.name"
                       :value="supplierType.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商">
          <!--选择供应商类别后才获取供应商（为防止选项太多）-->
          <el-select v-model="searchForm.supplier"
                     placeholder="请先选择供应商类别"
                     clearable
                     valueKey="id">
            <el-option label="不限" value=""></el-option>
            <el-option v-for="supplier in suppliers"
                       :key="supplier.id"
                       :label="supplier.name"
                       :value="supplier.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select v-model="searchForm.brand"
                     placeholder="选择品牌"
                     valueKey="name"
                     @visible-change="getOptions"
                     @change="getMobileModels">
            <el-option label="不限" value=""></el-option>
            <el-option v-for="brand in brands"
                       :key="brand.name"
                       :label="brand.name"
                       :value="brand.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机型">
          <!--选择品牌后才获取机型（为防止选项太多）-->
          <el-select v-model="searchForm.mobileModel"
                     placeholder="请先选择品牌"
                     clearable
                     valueKey="id">
            <el-option label="不限" value=""></el-option>
            <el-option v-for="mobileModel in mobileModels"
                       :key="mobileModel.id"
                       :label="mobileModel.name"
                       :value="mobileModel.name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="inboundList"
      style="width: 100%"
      align="left"
      :row-class-name="tableRowClassName"
      :default-sort="{prop: 'id', order: 'ascending'}"
      v-loading.body="loading">
      <!--<el-table-column-->
      <!--class="column"-->
      <!--prop="id"-->
      <!--sortable-->
      <!--label="单据号码">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="supplier.name"
        sortable
        label="供应商">
      </el-table-column>
      <el-table-column
        prop="mobileModel.name"
        sortable
        label="机型">
      </el-table-column>
      <el-table-column
        prop="color.name"
        label="颜色">
      </el-table-column>
      <el-table-column
        prop="buyPrice"
        label="进价">
      </el-table-column>
      <el-table-column
        prop="quantity"
        label="数量">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="总金额">
      </el-table-column>
      <el-table-column
        prop="inputUser.username"
        label="录入人">
      </el-table-column>
      <el-table-column
        prop="checkUser.username"
        label="审核人">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="dept.name"
        label="部门">
      </el-table-column>
      <el-table-column label="审核">
        <template scope="scope">
          <el-button :plain="true" type="success" size="small" v-if="scope.row.status==='UNAUDITED'"
                     @click="passInboundList(scope.row)"><i class="el-icon-check"></i></el-button>
          <el-button :plain="true" type="danger" size="small" v-if="scope.row.status==='UNAUDITED'"
                     @click="refuseInboundList(scope.row)"><i class="el-icon-close"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      :total="count"
      class="pagination"
      :current-page="pageIndex"
      :page-size="pageSize"
      @current-change="getInboundLists">
    </el-pagination>
    <router-view></router-view>
  </div>
</template>

<script>
  import axios from 'axios'
  import {backEndUrl, SUCCESS} from '@/common/config'
  import {debounce} from '@/common/util'
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue"
  import ElOption from "../../../node_modules/element-ui/packages/select/src/option.vue"

  const PAGE_SIZE = 10

  export default {
    components: {
      ElOption,
      ElButton
    },
    data() {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '最近一天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        searchForm: {
          inputTime: '',
          supplierType: '',
          supplier: '',
          brand: '',
          mobileModel: '',
        },
        inboundList: [],
        brands: [],
        mobileModels: [],
        supplierTypes: [],
        suppliers: [],
        loading: true,
        pageIndex: 1,
        pageSize: PAGE_SIZE,
        count: 0
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
        this.getInboundLists()
      }, 500),
      '$route': 'getInboundLists'
    },
    methods: {
      getInboundLists(index) {
        if (index % 1 !== 0) {
          index = null
        }
        this.loading = true
        let self = this
        let searchUrl = `${backEndUrl}/mobile_inbound/get_mobile_inbounds.do`
        axios.post(searchUrl, JSON.stringify({
          supplier: self.searchForm.supplier,
          mobileModel: self.searchForm.mobileModel,
          startTime: self.searchForm.inputTime ? +new Date(self.searchForm.inputTime[0]) : null,
          endTime: self.searchForm.inputTime ? +new Date(self.searchForm.inputTime[1]) : null,
          pageIndex: index || self.pageIndex,
          pageSize: PAGE_SIZE
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.inboundList = response.data.data
            self.count = response.data.count
            self.loading = false
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      getSupplierTypes() {
        let self = this
        let supplierTypeUrl = `${backEndUrl}/supplier_type/get_supplier_types.do`
        axios.post(supplierTypeUrl, {}, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.supplierTypes = response.data.data
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      getSuppliers(type) {
        let self = this
        let supplierUrl = `${backEndUrl}/supplier/get_suppliers.do`
        axios.post(supplierUrl, JSON.stringify({
          name: '',
          type: type
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.suppliers = response.data.data
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
      getMobileModels(brand) {
        let self = this
        let mobileModelUrl = `${backEndUrl}/mobile_model/get_mobile_models.do`
        axios.post(mobileModelUrl, JSON.stringify({
          name: '',
          brand: brand ? brand.name : ''
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.mobileModels = response.data.data
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      passInboundList(row) {
        let self = this
        let passUrl = `${backEndUrl}/mobile_inbound/pass_mobile_inbound.do`
        this.$confirm('确认审核通过？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          axios.get(passUrl, {
            params: {
              id: row.id
            }
          }).then((response) => {
            if (response.data.status === SUCCESS) {
              self.getInboundLists()
              self.$message({
                type: 'success',
                message: '审核成功!'
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
      refuseInboundList(row) {
        let self = this
        let refuseUrl = `${backEndUrl}/mobile_inbound/refuse_mobile_inbound.do`
        this.$confirm('确认拒绝该入库单？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }).then(() => {
          axios.get(refuseUrl, {
            params: {
              id: row.id
            }
          }).then((response) => {
            if (response.data.status === SUCCESS) {
              self.getInboundLists()
              self.$message({
                type: 'success',
                message: '退回成功!'
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
      tableRowClassName(row) {
        if (row.status === 'UNAUDITED') {
          return 'row-unaudited'
        } else if (row.status === 'PASSED') {
          return 'row-passed'
        } else if (row.status === 'NOT_PASSED') {
          return 'row-not-passed'
        }
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
      getOptions(flag) {
        if (flag && (this.brands.length === 0 || this.supplierTypes.length === 0)) {
          this.getBrands()
          this.getSupplierTypes()
        }
      },
      turnToMobileInbound() {
        this.$router.push('/mobile_inbound')
      }
    },
    mounted() {
      this.getInboundLists()
    }
  }
</script>

<style scoped>

  .model-list-manage {
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
