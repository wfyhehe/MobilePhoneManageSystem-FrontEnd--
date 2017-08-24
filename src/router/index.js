import Vue from 'vue'
import Router from 'vue-router'

const Login = (resolve) => {
  import('@/components/Login').then((module) => {
    resolve(module)
  })
}

const Home = (resolve) => {
  import('@/components/Home').then((module) => {
    resolve(module)
  })
}

const Register = (resolve) => {
  import('@/components/Register').then((module) => {
    resolve(module)
  })
}

const Page404 = (resolve) => {
  import('@/components/Page404').then((module) => {
    resolve(module)
  })
}

const UserManage = (resolve) => {
  import('@/components/system_manage/UserManage').then((module) => {
    resolve(module)
  })
}

const AuthManage = (resolve) => {
  import('@/components/system_manage/AuthManage').then((module) => {
    resolve(module)
  })
}

const MenuManage = (resolve) => {
  import('@/components/system_manage/MenuManage').then((module) => {
    resolve(module)
  })
}

const MenuDetail = (resolve) => {
  import('@/components/system_manage/MenuDetail').then((module) => {
    resolve(module)
  })
}

const RoleManage = (resolve) => {
  import('@/components/system_manage/RoleManage').then((module) => {
    resolve(module)
  })
}

const RoleDetail = (resolve) => {
  import('@/components/system_manage/RoleDetail').then((module) => {
    resolve(module)
  })
}

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [{
    path: '/login',
    component: Login
  }, {
    path: '/home',
    alias: '/',
    component: Home
  }, {
    path: '/register',
    component: Register
  }, {
    path: '/404',
    alias: '*',
    component: Page404
  }, {
    path: '/user_manage',
    component: UserManage
  }, {
    path: '/auth_manage',
    component: AuthManage
  }, {
    path: '/menu_manage',
    component: MenuManage,
    children: [{
      path: ':id',
      component: MenuDetail
    }]
  }, {
    path: '/role_manage',
    component: RoleManage,
    children: [{
      path: ':id',
      component: RoleDetail
    }]
  }]
})
