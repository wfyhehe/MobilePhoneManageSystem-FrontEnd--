<template>
  <div class="supplier-detail">
    <el-form ref="form" :model="form" class="form" label-width="80px">
      <h3>修改供应商项</h3>
      <el-form-item label="供应商编号">
        <el-input v-model="form.id" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="类别">
        <el-select v-model="form.type" placeholder="请选择类别" @visible-change="selectShowed">
          <el-option label="未定" value=""></el-option>
          <el-option v-for="(item, i) in types" :key="i" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="form.contact"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="form.tel"></el-input>
      </el-form-item>
      <el-form-item label="E-Mail">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.remark"></el-input>
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
      return {
        form: {
          inputTime: 0,
          name: '',
          type: '',
          contact: '',
          tel: '',
          email: '',
          address: '',
          remark: ''
        },
        supplier: {},
        types: []
      }
    },
    methods: {
      onSubmit() {
        let self = this
        let updateSupplierUrl = `${backEndUrl}/supplier/update_supplier.do`
        axios.post(updateSupplierUrl, JSON.stringify({
          id: self.$route.params.id,
          name: self.form.name,
          type: self.form.type,
          contact: self.form.contact,
          tel: self.form.tel,
          email: self.form.email,
          address: self.form.address,
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
      getTypes() {
        this.loading = true
        let self = this
        let typeUrl = `${backEndUrl}/supplier_type/get_supplier_types.do`
        axios.post(typeUrl, {}).then((response) => {
          if (response.data.status === SUCCESS) {
            self.types = response.data.data
            self.loading = false
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      selectShowed(flag) {
        if (flag && this.types.length === 0) {
          this.getTypes()
        }
      }
    },
    mounted() {
      let self = this
      let getSupplierUrl = `${backEndUrl}/supplier/get_supplier.do`
      axios.get(getSupplierUrl, {
        params: {
          id: self.$route.params.id
        }
      }).then(response => {
        if (response.data.status === SUCCESS) {
          let supplier = response.data.data
          self.supplier = supplier
          self.form.id = supplier.id
          self.form.name = supplier.name
          self.form.type = supplier.type ? supplier.type.name : ''
          self.form.contact = supplier.contact
          self.form.tel = supplier.tel
          self.form.email = supplier.email
          self.form.address = supplier.address
          self.form.remark = supplier.remark
        }
      })
    }
  }
</script>

<style scoped>
  .supplier-detail {
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
