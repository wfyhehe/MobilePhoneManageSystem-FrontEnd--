import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Register from '@/components/Register'
import Page404 from '@/components/Page404'

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [{
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/home',
    name: 'home',
    alias: '/',
    component: Home
  }, {
    path: '/register',
    name: 'register',
    component: Register
  }, {
    path: '/404',
    name: '404',
    alias: '*',
    component: Page404
  }]
})
