<template>
  <div class="home">
    <h1>Home</h1>
  </div>
</template>

<script>
  import {getToken, setToken} from '@/common/cache'
  import axios from 'axios'
  import {backEndUrl, SUCCESS, validateToken} from '@/common/config'

  export default {
    data() {
      return {
      }
    },
    methods: {},
    mounted() {
    }
  }


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login-form {
    width: 500px;
    margin: 15% auto;
  }

  .login-form img {
    float: right;
  }

  .v-code img {
    cursor: pointer;
  }

  .v-code a {
    font-size: 12px;
    float: right;
    margin-right: 10px;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
