<template>
  <div class="config-manage">
    <h2>配置管理</h2>
    <el-form :inline="true" :model="addForm" label-width="100px">
      <el-form-item label="配置" prop="name">
        <el-input v-model="addForm.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" @click="addConfig"><i class="el-icon-plus"></i> 添加新配置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="configs"
      style="width: 100%"
      align="left"
      :default-sort="{prop: 'id', order: 'ascending'}"
      v-loading.body="loading">
      <el-table-column
        class="column"
        prop="name"
        sortable
        label="配置">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button :plain="true" type="danger" icon="delete" size="small"
                     @click="deleteConfig(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <router-view></router-view>
  </div>
</template>

<script>
  import axios from 'axios'
  import {backEndUrl, SUCCESS} from '@/common/config'
  import {debounce} from '@/common/util'

  export default {
    data() {
      return {
        addForm: {
          name: ''
        },
        configs: [],
        loading: true,
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'getConfigs'
    },
    methods: {
      getConfigs() {
        this.loading = true
        let self = this
        let searchUrl = `${backEndUrl}/config/get_configs.do`
        axios.post(searchUrl, {}, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.configs = response.data.data
            self.loading = false
          }
        })
      },
      addConfig() {
        let self = this
        let addConfigUrl = `${backEndUrl}/config/add_config.do`
        axios.post(addConfigUrl, JSON.stringify({
          name: self.addForm.name,
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.$message.success('添加成功')
            self.getConfigs()
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      deleteConfig(row) {
        let self = this
        let deleteUrl = `${backEndUrl}/config/delete_config.do`
        this.$confirm('此操作将永久删除配置, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }).then(() => {
          axios.post(deleteUrl, JSON.stringify({
            name: row.name
          }), {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          }).then((response) => {
            if (response.data.status === SUCCESS) {
              self.getConfigs()
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
      }
    },
    mounted() {
      this.getConfigs()
    }
  }
</script>

<style scoped>
  .config-manage {
  }

  .form2 {
    margin: 100px 0;
  }

  .el-table .deleted-row {
    background-config: rgba(255, 73, 73, 0.56);
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
