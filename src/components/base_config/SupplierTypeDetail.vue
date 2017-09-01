<template>
  <div class="supplier-type-detail">
    <el-form ref="form" :model="form" class="form" label-width="80px">
      <h3>修改供应商类型项</h3>
      <el-form-item label="编号" prop="id" >
        <el-input :disabled="true" v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
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
          id: '',
          name: '',
          remark: ''
        },
        supplierType: {}
      }
    },
    methods: {
      onSubmit() {
        let self = this
        let updateSupplierTypeUrl = `${backEndUrl}/supplier_type/update_supplier_type.do`
        axios.post(updateSupplierTypeUrl, JSON.stringify({
          id: self.form.id,
          name: self.form.name,
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
      }
    },
    mounted() {
      let self = this
      let getSupplierTypeUrl = `${backEndUrl}/supplier_type/get_supplier_type.do`
      axios.get(getSupplierTypeUrl, {
        params: {
          id: self.$route.params.id
        }
      }).then(response => {
        if (response.data.status === SUCCESS) {
          let supplierType = response.data.data
          self.supplierType = supplierType
          self.form.id = supplierType.id,
            self.form.name = supplierType.name
          self.form.remark = supplierType.remark
        }
      })
    }
  }
</script>

<style scoped>
  .supplier-type-detail {
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
