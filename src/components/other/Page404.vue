<template>
  <div>
    <h2>对不起！</h2>
    <p>没有找到你想访问的页面</p>
    <router-link to="/" @click.native="back">返回上一页</router-link>
    <router-link to="/home">返回首页</router-link>
  </div>
</template>

<script>
  export default {
    methods: {
      back() {
        this.$router.back()
        this.$router.back()
      }
    }
  }
</script>

<style scoped>
  * {
    padding: 20px;
  }
</style>
