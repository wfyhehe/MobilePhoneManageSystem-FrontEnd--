<template>
  <div class="mobile-inbound">
    <h3>手机入库</h3>
    <!--<el-button @click="test">test</el-button>-->
    <el-form :model="form" ref="form" :rules="addRule" label-width="100px">
      <el-form-item label="供应商类别">
        <el-select v-model="form.supplierType"
                   placeholder="选择供应商类别"
                   valueKey="id"
                   @change="getSuppliers">
          <el-option v-for="supplierType in supplierTypes"
                     :key="supplierType.id"
                     :label="supplierType.name"
                     :value="supplierType"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="供应商">
        <!--选择供应商类别后才获取供应商（为防止选项太多）-->
        <el-select v-model="form.supplier"
                   placeholder="请先选择供应商类别"
                   ref="selectSupplier"
                   clearable
                   valueKey="id">
          <el-option v-for="supplier in suppliers"
                     :key="supplier.id"
                     :label="supplier.name"
                     :value="supplier"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="form.brand"
                   placeholder="选择品牌"
                   valueKey="name"
                   @change="getMobileModels">
          <el-option v-for="brand in brands"
                     :key="brand.name"
                     :label="brand.name"
                     :value="brand"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机型">
        <!--选择品牌后才获取机型（为防止选项太多）-->
        <el-select v-model="form.mobileModel"
                   placeholder="请先选择品牌"
                   clearable
                   valueKey="id">
          <el-option v-for="mobileModel in mobileModels"
                     :key="mobileModel.name"
                     :label="mobileModel.name"
                     :value="mobileModel"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="配置">
        <el-select v-model="form.config"
                   placeholder="选择配置"
                   valueKey="name">
          <el-option v-for="config in configs"
                     :key="config.name"
                     :label="config.name"
                     :value="config"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="颜色">
        <el-select v-model="form.color"
                   placeholder="选择颜色"
                   valueKey="name">
          <el-option v-for="color in colors"
                     :key="color.name"
                     :label="color.name"
                     :value="color"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="参考价">
        <el-input v-model="referencePrice" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="进货价" prop="buyPrice">
        <el-input v-model="form.buyPrice"></el-input>
      </el-form-item>
      <el-form-item label="数量">
        <el-input v-model="quantity" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="总价">
        <el-input v-model="amount" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="添加">
        <div class="inline-table">
          <el-form :inline="true"
                   :rules="idRule"
                   ref="addForm"
                   :model="form.addForm">
            <el-form-item prop="id">
              <el-input v-model="form.addForm.id"
                        placeholder="串号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="addId">添加</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="form.mobiles">
            <el-table-column
              prop="id"
              label="串号">
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button :plain="true" type="danger" icon="delete" size="small"
                           @click="removeId(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="buttons">
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button type="info" @click="turnToInboundList">查看入库单</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'
  import {backEndUrl, SUCCESS} from '@/common/config'
  import {getToken} from '@/common/cache'
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";
  import ElBadge from "../../../node_modules/element-ui/packages/badge/src/main.vue";
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";

  export default {
    components: {
      ElButton,
      ElBadge,
      ElFormItem
    },
    data() {
      let validateId = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入串号'))
        } else if (!/^[0-9A-Z-]{1,15}$/.test(value)) {
          callback(new Error('编号必须由1-15位数字、大写字母、减号组成'))
        } else if (this.isAdded(value)) {
          callback(new Error('请勿重复添加'))
        } else {
          callback()
//          let checkMobileInboundUrl = `${backEndUrl}/mobile_inbound/check_mobile_inbound.do`
//          axios.get(checkMobileInboundUrl, {
//            params: {
//              id: value
//            }
//          }).then((response) => {
//            if (response.data.status !== SUCCESS) {
//              // 编号已存在
//              callback(new Error(response.data.msg))
//            } else {
//              callback();
//            }
//          })
        }
      }
      let validateBuyPrice = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入进价'))
        }
        if (!/^\d+(\.\d+)?$/.test(value)) {
          callback(new Error('请输入非负实数'))
        } else {
          callback()
        }
      }
      return {
        form: {
          supplierType: {},
          supplier: {},
          brand: {},
          mobileModel: {},
          config: {},
          color: {},
          buyPrice: 0,
          amount: 0,
          remark: '',
          mobiles: [],
          addForm: {
            id: ''
          }
        },
        supplierTypes: [],
        suppliers: [],
        brands: [],
        mobileModels: [],
        configs: [],
        colors: [],
        addRule: {
          buyPrice: [
            {validator: validateBuyPrice, trigger: 'blur'}
          ]
        },
        idRule: {
          id: [
            {validator: validateId, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      amount() {
        return this.quantity * this.form.buyPrice
      },
      quantity() {
        return this.form.mobiles.length
      },
      referencePrice() {
        let mobileModel = this.form.mobileModel
        return mobileModel ? mobileModel.buyingPrice : 0
      }
    },
    methods: {
      test() {
        console.log(this.form)
      },
      onSubmit() {
        let self = this
        let updateMobileModelUrl = `${backEndUrl}/mobile_inbound/add_mobile_inbound.do`
        axios.post(updateMobileModelUrl, JSON.stringify({
          supplier: self.form.supplier,
          mobileModel: self.form.mobileModel,
          color: self.form.color,
          config: self.form.config,
          buyPrice: self.form.buyPrice,
          quantity: self.quantity,
          amount: self.amount,
          inputTime: +new Date(),
          inputUser: null,
          checkTime: null,
          checkUser: null,
          checkStatus: null,
          dept: null,
          remark: self.form.remark,
          mobiles: self.form.mobiles
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.$message.success('入库成功')
            self.resetForm()
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      resetForm() {
        this.$refs['form'].resetFields();
        this.$refs['addForm'].resetFields();
        this.form.mobiles = []
        this.form.supplierType = {}
        this.form.supplier = {}
        this.form.brand = {}
        this.form.mobileModel = {}
        this.form.config = {}
        this.form.color = {}
        this.form.remark = ''
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
          type: type ? type.name : ''
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
      getConfigs() {
        let self = this
        let configUrl = `${backEndUrl}/config/get_configs.do`
        axios.post(configUrl, {}, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.configs = response.data.data
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      getColors() {
        let self = this
        let colorUrl = `${backEndUrl}/color/get_colors.do`
        axios.post(colorUrl, {}, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.colors = response.data.data
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      getOptions() {
        this.getSupplierTypes()
        this.getBrands()
        this.getConfigs()
        this.getColors()
      },
      turnToInboundList() {
        this.$router.push('/inbound_list')
      },
      addId() {
        if (!this.form.addForm.id) {
          return false
        }
        let id = this.form.addForm.id
        if (this.isAdded(id)) {
          this.$message.error('该串号已经添加！')
          return false
        }
        this.form.mobiles.push({id})
        this.form.addForm.id = null
      },
      removeId(row) {
        this.form.mobiles = this.form.mobiles.filter(obj => {
          return obj.id !== row.id
        })
      },
      isAdded(id) {
        for (let obj of this.form.mobiles) {
          if (obj.id === id) {
            return true
          }
        }
        return false
      },
    },
    mounted() {
      this.getOptions()
    }
  }
</script>

<style scoped>
  .mobile-inbound {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    top: 0;
    z-index: 1;
    background-color: aliceblue;
  }

  .form {
    margin: 100px;
    width: 50%;
  }

  .inline-table .el-table {
    margin-top: 20px;
  }

  h1, h2, h3 {
    font-weight: normal;
    margin: 40px 0;
  }
</style>
