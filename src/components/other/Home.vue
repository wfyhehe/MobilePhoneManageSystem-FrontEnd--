<template>
  <div class="home">
    <h1>Home</h1>
    <div class="notes">
      <el-button class="add" size="small" v-if="isSuperAdmin" @click="addInfo">
        <i class="el-icon-plus"></i>添加信息
      </el-button>
      <router-link to="/comment" class="comment-me">给我留言</router-link>
      <ul>
        <div class="li" v-for="info in infos" :key="info.id">
          <li>{{info.content}}</li>
          <el-button :plain="true" type="info" icon="edit" size="small" class="delete"
                     v-if="isSuperAdmin" @click="editInfo(info)"></el-button>
          <el-button :plain="true" type="danger" icon="delete" size="small" class="delete"
                     v-if="isSuperAdmin" @click="deleteInfo(info.id)"></el-button>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
  import {getToken, setToken} from '@/common/cache'
  import axios from 'axios'
  import {backEndUrl, SUCCESS} from '@/common/config'
  import {isSuperAdmin} from '@/common/util'

  export default {
    data() {
      return {
        infos: []
      }
    },
    computed: {
      isSuperAdmin() {
        return isSuperAdmin()
      }
    },
    methods: {
      getInfos() {
        let infoUrl = `${backEndUrl}/info/get_infos.do`
        let self = this
        axios.get(infoUrl, {
          params: {
            position: "HOME"
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            this.infos = response.data.data
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      addInfo() {
        let self = this
        let addUrl = `${backEndUrl}/info/add_info.do`
        this.$prompt('请输入信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({value}) => {
          axios.post(addUrl, JSON.stringify({
            content: value,
            position: 'HOME'
          }), {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          }).then((response) => {
            if (response.data.status === SUCCESS) {
              self.getInfos()
              self.$message.success('添加成功')
            } else {
              self.$message.error(response.data.msg)
            }
          })
        }).catch(() => {
        })
      },
      editInfo(info) {
        let self = this
        let updateUrl = `${backEndUrl}/info/update_info.do`
        this.$prompt('请输入信息', '提示', {
          inputValue: info.content,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({value}) => {
          axios.post(updateUrl, JSON.stringify({
            id: info.id,
            content: value,
            position: 'HOME'
          }), {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          }).then((response) => {
            if (response.data.status === SUCCESS) {
              self.getInfos()
              self.$message.success('修改成功')
            } else {
              self.$message.error(response.data.msg)
            }
          })
        }).catch(() => {
        })
      },
      deleteInfo(id) {
        let self = this
        let deleteUrl = `${backEndUrl}/info/delete_info.do`
        this.$confirm('此操作将删除词条信息, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }).then(() => {
          axios.get(deleteUrl, {
            params: {
              id
            }
          }).then((response) => {
            if (response.data.status === SUCCESS) {
              self.getInfos()
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
      },
    },
    mounted() {
      this.getInfos()
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

  .comment-me {
    font-size: 22px;
    margin: 10px;
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

  .notes {
    margin: 50px 80px;
    font-size: 17px;
    color: #475669;
  }

  .li {
    margin: 15px 0;
  }

  .li .delete {
    margin-top: 10px;
    float: top
  }
</style>
