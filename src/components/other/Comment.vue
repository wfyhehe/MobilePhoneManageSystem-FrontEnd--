<template>
  <div class="comment">
    <ul v-loading="loading">
      <h2>留言({{count}}条)</h2>
      <li v-for="item in comments" :key="item.id" :class="listClass(item)">
        <div class="item">
          <span class="user">{{item.user ? item.user.username : item.ip}}&nbsp;说：</span>
          <span class="control" v-if="isSuperAdmin">
            <el-button :plain="true" type="danger" icon="delete" size="small" class="delete"
                       v-if="isSuperAdmin" @click="deleteComment(item.id)"></el-button>
          </span>
          <div class="content">{{item.content}}</div>
          <span class="date">{{item.createDate}}</span><br>
          <hr/>
        </div>
      </li>
    </ul>
    <el-pagination
      layout="prev, pager, next"
      class="pagination"
      :total="count"
      :current-page="pageIndex"
      :page-size="pageSize"
      @current-change="getComments">
    </el-pagination>
    <el-form ref="commentForm" class="form" :model="commentForm" label-width="80px">
      <el-form-item label="留言">
        <el-input type="textarea" :rows="4" v-model="commentForm.content"></el-input>
      </el-form-item>
      <el-form-item label="私密留言">
        <span>
          <el-switch v-model="commentForm.secret"></el-switch>
          <i class="tip"><--&nbsp;选择后，只有自己和站长可以查看</i>
          <el-button type="primary" class="submit" @click="onSubmit">发表</el-button>
        </span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'
  import {backEndUrl, SUCCESS} from '@/common/config'
  import {setToken, TokenUtil, setLoginUser} from '@/common/cache'
  import CookieUtil from '@/common/cookie'
  import {mapMutations, mapGetters} from 'vuex'
  import {isSuperAdmin} from '@/common/util'
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";

  const PAGE_SIZE = 10

  export default {
    components: {ElButton},
    data() {
      return {
        commentForm: {
          content: '',
          secret: false
        },
        pageIndex: 1,
        pageSize: PAGE_SIZE,
        count: 0,
        comments: [],
        loading: true
      }
    },
    computed: {
      isSuperAdmin() {
        return isSuperAdmin()
      }
    },
    methods: {
      test() {
        console.log(CookieUtil.getCookie('vCodeId'))
      },
      onSubmit() {
        let self = this
        if (this.commentForm.content.length < 5) {
          this.$alert('请至少输入5个字！', '太少了', {
            confirmButtonText: '确定',
            callback: () => {
            }
          })
        } else {
          self.addComment()
        }
      },
      getComments(index) {
        if (index % 1 !== 0) {
          index = null
        }
        this.loading = true
        let commentUrl = `${backEndUrl}/comment/get_comments.do`
        let self = this
        axios.post(commentUrl, JSON.stringify({
          pageIndex: index || self.pageIndex,
          pageSize: PAGE_SIZE
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.comments = response.data.data
            self.count = response.data.count
            self.loading = false
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      addComment() {
        let self = this
        let addUrl = `${backEndUrl}/comment/add_comment.do`
        axios.post(addUrl, JSON.stringify({
          secret: self.commentForm.secret,
          content: self.commentForm.content
        }), {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          if (response.data.status === SUCCESS) {
            self.commentForm.content = ''
            self.getComments()
            self.$message.success('添加成功')
          } else {
            self.$message.error(response.data.msg)
          }
        })
      },
      deleteComment(id) {
        let self = this
        let deleteUrl = `${backEndUrl}/comment/delete_comment.do`
        this.$confirm('此操作将删除此条留言, 是否继续？', '提示', {
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
              self.getComments()
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
      listClass(item) {
        if (item && item.secret) {
          return 'list-private'
        } else {
          return 'list-public'
        }
      }
    },
    mounted() {
      this.getComments()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .list-public {
    list-style-type: none;
  }

  .list-private {
    list-style-type: none;
    background-color: #D3DCE6;
  }

  .form {
    margin: 20px 10px;
  }

  .form .submit {
    float: right;
    margin-right: 50px;
  }

  .form .tip {
    color: #8492A6;
    font-size: 13px;
  }

  .item {
    margin: 10px 10px;
    padding: 10px;
  }

  .item .user {
    font-weight: bold;
    font-size: 17px;
  }

  .item .content {
    margin: 10px;
    font-size: 15px;
  }

  .item .date {
    float: right;
    font-size: 13px;
    font-family: Georgia;
  }

  .item .control {
    float: right;
  }

  h1, h2 {
    font-weight: normal;
    margin: 40px;
  }


</style>
