<template>
  <div id="app">
    <el-row>
      <el-col :span="5">
        <navigator></navigator>
      </el-col>
      <el-col :span="19">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Navigator from '@/base/Navigator'
  import ElCol from "element-ui/packages/col/src/col";

  export default {
    name: 'app',
    components: {
      ElCol,
      Navigator
    }
  }
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
