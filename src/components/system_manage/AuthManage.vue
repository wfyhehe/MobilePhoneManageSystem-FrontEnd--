<template>
  <div class="auth-manage">
    <!-- TODO 对菜单和动作的权限管理-->
    <h2>权限管理</h2>
    <el-tree
      :data="tree"
      :props="props"
      showCheckbox
      @check-change="handleCheckChange">
    </el-tree>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        props: {
          label: 'name',
          children: 'children'
        }
      }
    }
  }
</script>

<style scoped>

</style>
