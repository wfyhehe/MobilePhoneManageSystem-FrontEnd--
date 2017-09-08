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

<style>
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

  .el-table .row-unaudited {
    background-color: rgba(126, 119, 130, 0.47);
    /*background: #c9e5f5;*/
  }

  .el-table .row-passed {
    background-color: rgba(131, 255, 131, 0.29);
  }

  .el-table .row-not-passed {
    background-color: rgba(255, 73, 73, 0.29);
  }

  .el-table .deleted-row {
    background-color: rgba(255, 73, 73, 0.34);
  }
</style>
