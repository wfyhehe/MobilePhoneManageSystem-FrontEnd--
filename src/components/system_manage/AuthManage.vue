<template>
  <div class="auth-manage">
    <h2>权限管理</h2>
    <!--<el-button @click="test">test</el-button>-->
    <el-select v-model="role"
               @change="getMenus"
               placeholder="请选择角色"
               valueKey="id">
      <el-option
        v-for="role in roles"
        :key="role.id"
        :label="role.name"
        :value="role">
      </el-option>
    </el-select>
    <el-tree
      class="tree"
      :data="menus"
      :props="props"
      empty-text="请先选择您需要管理权限的角色"
      ref="tree"
      showCheckbox
      :check-strictly="true"
      :default-checked-keys="authorized"
      :default-expanded-keys="expanded"
      nodeKey="id"
      v-loading.body="loading">
    </el-tree>
    <div class="buttons">
      <el-button @click="getMenus">重置</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import {backEndUrl, SUCCESS} from '@/common/config'
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";

  export default {
    components: {ElButton},
    data() {
      return {
        props: {
          label: 'name',
          children: 'children'
        },
        role: {},
        rawMenus: [],
        menus: [],
        roles: [],
        authorized: [],
        expanded: [],
        loading: false
      }
    },
    methods: {
      test() {
        let obj = {}
        console.log(JSON.stringify(obj))
        if (JSON.stringify(obj === '{}')) {
          console.log('ok1')
        }
        if (obj) {
          console.log('ok2')
        }
        let str = 'avvc#fewf#aaa'
        console.log(str.split('#')[0])
        console.log(this.authorized)
        console.log(this.menus)
      },
      submit() {
        let menuIds = this.parseMenuIds(this.$refs.tree.getCheckedKeys())
        let actionUrls = this.parseActionUrls(this.$refs.tree.getCheckedKeys())
        let self = this
        let updateMenusUrl = `${backEndUrl}/menu/update_menus_from_role.do`
        let updateActionsUrl = `${backEndUrl}/action/update_actions_from_role.do`
        axios.post(updateMenusUrl, JSON.stringify({
          menuIds,
          role: self.role
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.$message.success('提交成功')
          } else {
            self.$message.error(response.data.msg)
          }
        })
        axios.post(updateActionsUrl, JSON.stringify({
          actionUrls,
          role: self.role
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.$message.success('提交成功')
            this.getMenus()
          } else {
            self.$message.error(response.data.msg)
          }
        })

      },
      getMenus() {
        this.loading = true
        this.authorized = []
        this.expanded = []
        let self = this
        let menuUrl = `${backEndUrl}/menu/get_menus.do`
        axios.get(menuUrl, {
          params: {}
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.rawMenus = response.data.data
            self.menus = self.parseRawMenus(self.rawMenus)
            self.loading = false
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      parseRawMenus(rawMenus) {
        let menus = JSON.parse(JSON.stringify(rawMenus))
        for (let menu of menus) {
          for (let child of menu.children) {
            if (child.type === 'NODE') {
              this.checkRoleThenAuthorizeNode(child)
              child.children = child.actions
              for (let action of child.actions) {
                action.id = action.url + '#' + child.id
                this.checkRoleThenAuthorizeNode(action)
              }
            }
          }
          this.expanded.push(menu.id)
        }
        return menus
      },
      parseMenuIds(keys) {
        let menuIds = keys.filter((value) => {
          return value[0] !== '/'
        })
        return menuIds
      },
      parseActionUrls(keys) {
        let actionUrls = keys.filter((value) => {
          return value[0] === '/'
        })
        for (let i in actionUrls) {
          actionUrls[i] = actionUrls[i].split('#')[0]
        }
        actionUrls.sort()
        for (let i = actionUrls.length - 1; i > 0; i--) {
          if (actionUrls[i] === actionUrls[i - 1]) {
            actionUrls.splice(i, 1)
          }
        }
        return actionUrls
      },
      getRoles() {
        let self = this
        let getRolesUrl = `${backEndUrl}/role/get_roles.do`
        axios.get(getRolesUrl, {}).then(response => {
          if (response.data.status === SUCCESS) {
            self.roles = response.data.data
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      checkRoleThenAuthorizeNode(node) {
        for (let role of node.roles) {
          if (role.id === this.role.id) {
            this.authorized.push(node.id)
          }
        }
      }
    },
    mounted() {
      this.getRoles()

    }
  }
</script>

<style scoped>
  .form2 {
    margin: 100px 0;
  }

  h1, h2, h3 {
    margin: 30px;
  }

  .tree {
    margin: 20px 0;
  }

</style>
