import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [{
    path: '/login',
    name: 'Login',
    alias: '/',
    component: Login
  },{
    path: '/home',
    name: 'home',
    component: Home
  }]
})
