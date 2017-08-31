<template>
  <div>
    <div class="menu-manage" v-show="true">
      <h2>菜单管理</h2>
      <el-table
        :data="menus"
        style="width: 100%"
        @header-click="addTop"
        align="left"
        v-loading.body="loading">
        <el-table-column
          class="column"
          prop="name"
          label="菜单名称　＋添加菜单">
        </el-table-column>
        <el-table-column
          prop="path"
          label="菜单路径">
        </el-table-column>
        <el-table-column
          prop="roles"
          label="权限">
          <template scope="scope">
            <span v-for="role in scope.row.roles">{{role.name}},&nbsp;</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="说明">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="text" size="small"
                       @click="up(scope.row)"><i class="el-icon-arrow-up"></i></el-button>
            <el-button type="text" size="small"
                       @click="down(scope.row)"><i class="el-icon-arrow-down"></i></el-button>
            <el-button :plain="true" type="info" icon="edit" size="small"
                       @click="editMenu(scope.row)"></el-button>
            <el-button :plain="true" type="danger" icon="delete" size="small"
                       @click="deleteMenu(scope.row)"></el-button>
            <el-button :plain="true" type="success" size="small"
                       v-if="!isLeaf(scope.$index)"
                       @click="addChild(scope.row)"><i class="el-icon-plus"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import axios from 'axios'
  import {backEndUrl, SUCCESS} from '@/common/config'

  export default {
    data() {
      return {
        rawMenus: [],
        loading: true
      }
    },
    computed: {
      menus() {
        let newMenus = []
        for (let menu of this.rawMenus) {
          newMenus.push(menu)
          if (menu.type === 'PARENT') {
            for (let index in menu.children) {
              let temp = menu.children[index];
              if (temp.name[0] !== '├' && temp.name[0] !== '└')
                if (index < menu.children.length - 1) {
                  temp.name = '├─ ' + temp.name
                } else {
                  temp.name = '└─ ' + temp.name
                }
              newMenus.push(temp)
            }
          }
        }
        return newMenus
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'getMenus'
    },
    methods: {
      getMenus() {
        this.loading = true
        let self = this
        let menuUrl = `${backEndUrl}/menu/get_menus.do`
        axios.get(menuUrl, {
          params: {}
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.rawMenus = response.data.data
            self.loading = false
          }
        })
      },
      addTop(column) {
        if (column.label === '菜单名称　＋添加菜单') {
          let self = this
          let addMenuUrl = `${backEndUrl}/menu/add_menu.do`
          let sortOrder = 1
          for (let topMenu of this.rawMenus) {
            if (topMenu.sortOrder >= sortOrder) {
              sortOrder = topMenu.sortOrder + 1
            }
          }
          axios.post(addMenuUrl, {
            name: '新建菜单项',
            sortOrder
          }).then((response) => {
            if (response.data.status === SUCCESS) {
              this.getMenus()
            }
          })
        }
      },
      isLeaf(index) {
        return this.menus[index].type === 'NODE'
      },
      up(row) {
        let upUrl = `${backEndUrl}/menu/up.do`
        axios.get(upUrl, {
          params: {
            id: row.id
          }
        }).then(response => {
          if (response.data.status === SUCCESS) {
            this.getMenus()
          }
        })
      },
      down(row) {
        let downUrl = `${backEndUrl}/menu/down.do`
        axios.get(downUrl, {
          params: {
            id: row.id
          }
        }).then(response => {
          if (response.data.status === SUCCESS) {
            this.getMenus()
          }
        })
      },
      addChild(row) {
        let self = this
        let addMenuUrl = `${backEndUrl}/menu/add_menu.do`
        let sortOrder = 1
        for (let child of row.children) {
          if (child.sortOrder >= sortOrder) {
            sortOrder = child.sortOrder + 1
          }
        }
        axios.post(addMenuUrl, {
          parentId: row.id,
          name: '新建菜单项',
          sortOrder
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            this.getMenus()
          }
        })
      },
      deleteMenu(row) {
        let self = this
        let deleteUrl = `${backEndUrl}/menu/delete_menu.do`
        this.$confirm('此操作将永久删除该菜单及其所有子菜单, 是否继续?', '提示', {
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
              self.getMenus()
            }
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
        })
      },
      editMenu(row) {
        this.$router.push(`/menu_manage/${row.id}`)
        this.toggleDetail = true
      }
    },
    mounted() {
      this.getMenus()
    }
  }
</script>

<style>
  th .cell {
    cursor: pointer;
  }
</style>
