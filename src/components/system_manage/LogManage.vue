<template>
  <div class="model-list-manage">
    <h2>日志管理</h2>
    <div class="search">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="日志时间范围">
          <el-date-picker
            v-model="searchForm.createDate"
            format="yyyy-MM-dd HH-mm-ss"
            type="datetimerange"
            :picker-options="pickerOptions"
            placeholder="选择时间范围">
          </el-date-picker>
        </el-form-item>
        <br/>
        <el-form-item label="动作地址">
          <el-input v-model="searchForm.actionUrl" placeholder="动作地址"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-checkbox-group v-model="searchForm.status">
            <el-checkbox label="ACCEPTED" value="ACCEPTED">通过</el-checkbox>
            <el-checkbox label="UNAUTHENTICATED" value="UNAUTHENTICATED">未登录</el-checkbox>
            <el-checkbox label="UNAUTHORIZED" value="UNAUTHORIZED">无权限</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="logs"
      style="width: 100%"
      align="left"
      :row-class-name="tableRowClassName"
      :default-sort="{prop: 'sortable', order: 'descending'}"
      v-loading.body="loading">
      <el-table-column
        prop="action.url"
        sortable
        label="动作地址">
      </el-table-column>
      <el-table-column
        prop="user.username"
        sortable
        label="用户">
      </el-table-column>
      <el-table-column
        prop="createDate"
        sortable
        label="时间">
      </el-table-column>
      <el-table-column
        prop="ip"
        label="IP">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态">
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      :total="count"
      class="pagination"
      :current-page="pageIndex"
      :page-size="pageSize"
      @current-change="getLogs">
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
          createDate: '',
          actionUrl: '',
          username: '',
          status: []
        },
        logs: [],
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
        this.getLogs()
      }, 500),
      '$route': 'getLogs'
    },
    methods: {
      getLogs(index) {
        if (index % 1 !== 0) {
          index = null
        }
        this.loading = true
        let self = this
        let searchUrl = `${backEndUrl}/log/get_logs.do`
        axios.post(searchUrl, JSON.stringify({
          actionUrl: self.searchForm.actionUrl,
          username: self.searchForm.username,
          startTime: self.searchForm.inputTime ? +new Date(self.searchForm.inputTime[0]) : null,
          endTime: self.searchForm.inputTime ? +new Date(self.searchForm.inputTime[1]) : null,
          status: self.searchForm.status,
          pageIndex: index || self.pageIndex,
          pageSize: PAGE_SIZE
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.logs = response.data.data
            self.count = response.data.count
            self.loading = false
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      tableRowClassName(row) {
        if (row.status === 'UNAUTHENTICATED') {
          return 'row-unaudited'
        } else if (row.status === 'ACCEPTED') {
          return 'row-passed'
        } else if (row.status === 'UNAUTHORIZED') {
          return 'row-not-passed'
        }
      }
    },
    mounted() {
      this.getLogs()
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
