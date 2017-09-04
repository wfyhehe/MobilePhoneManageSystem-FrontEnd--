<template>
  <div class="mobile-model-detail">
    <el-form :model="form" class="form" :rules="addRule" label-width="100px">
      <el-form-item label="手机型号编号" prop="id">
        <el-input v-model="form.id" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="型号名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="form.brand"
                   placeholder="请选择品牌"
                   @visible-change="selectShowed">
          <el-option v-for="(item, i) in brands"
                     :key="i"
                     :label="item.name"
                     :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="进货价" prop="buyingPrice">
        <el-input v-model="form.buyingPrice"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="返利价格设置">
        <div class="inline-table">
          <el-form :inline="true"
                   :rules="addRule"
                   :model="form.rebatePriceForm">
            <el-form-item>
              <el-select v-model="form.rebatePriceForm.rebateType"
                         placeholder="返利类型"
                         @visible-change="selectShowed">
                <el-option v-for="(rebateType, i) in rebateTypes"
                           :value-key="rebateType.id"
                           :key="i"
                           :label="rebateType.name"
                           :disabled="isAdded(rebateType)"
                           :value="JSON.stringify(rebateType)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="price">
              <el-input v-model="form.rebatePriceForm.price"
                        placeholder="返利价格"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="addRebatePrice">添加</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="form.rebatePrices">
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
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'
  import {backEndUrl, SUCCESS} from '@/common/config'
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";

  export default {
    components: {ElFormItem},
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
        form: {
          id: '',
          name: '',
          brand: '',
          buyingPrice: '',
          remark: '',
          rebatePrices: [],
          rebatePriceForm: {
            rebateType: {},
            price: 0
          }
        },
        mobileModel: {},
        brands: [],
        rebateTypes: [],
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
    methods: {
      onSubmit() {
        let self = this
        for (let rebatePrice of this.form.rebatePrices) {
          rebatePrice.mobileModel = {id: this.$route.params.id}
        }
        let updateMobileModelUrl = `${backEndUrl}/mobile_model/update_mobile_model.do`
        axios.post(updateMobileModelUrl, JSON.stringify({
          id: self.$route.params.id,
          name: self.form.name,
          brand: self.form.brand,
          buyingPrice: self.form.buyingPrice,
          rebatePrices: self.form.rebatePrices,
          remark: self.form.remark
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.$router.back()
            self.$message.success('修改成功')
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      onCancel() {
        this.$router.back()
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
          }
        })
      },
      addRebatePrice() {
        if (!this.form.rebatePriceForm) {
          return false
        }
        let rebatePriceObj = JSON.parse(JSON.stringify(this.form.rebatePriceForm))
        rebatePriceObj.rebateType = JSON.parse(rebatePriceObj.rebateType)
        if (this.isAdded(rebatePriceObj.rebateType)) {
          return false
        }
        this.form.rebatePrices.push(rebatePriceObj)
      },
      removeRebatePrice(row) {
        this.form.rebatePrices = this.form.rebatePrices.filter((rebatePrice) => {
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
        for (let rebatePrice of this.form.rebatePrices) {
          if (rebatePrice.rebateType.id === row.id) {
            return true
          }
        }
        return false
      },
    },
    mounted() {
      let self = this
      let getMobileModelUrl = `${backEndUrl}/mobile_model/get_mobile_model.do`
      axios.get(getMobileModelUrl, {
        params: {
          id: self.$route.params.id
        }
      }).then(response => {
        if (response.data.status === SUCCESS) {
          let mobileModel = response.data.data
          self.mobileModel = mobileModel
          self.form.id = mobileModel.id
          self.form.name = mobileModel.name
          self.form.brand = mobileModel.brand.name
          self.form.buyingPrice = mobileModel.buyingPrice
          self.form.rebatePrices = mobileModel.rebatePrices
          self.form.remark = mobileModel.remark
        }
      })
      this.getRebateTypes()
      this.getBrands()
    }
  }
</script>

<style scoped>
  .mobile-model-detail {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    top: 0;
    z-index: 2;
    background-color: aliceblue;
    position: fixed;
  }

  .form {
    margin: 100px;
    width: 50%;
  }

  h1, h2, h3 {
    font-weight: normal;
    margin: 40px;
  }
</style>
