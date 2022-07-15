import Vue from 'vue'
import VueRouter from 'vue-router'
import { getItem } from '@/utils/storage.js'

//import Home from '../components/Home.vue'
//import Login from '../components/Login.vue'
//import Main from '../components/Main.vue'

const Home = () => import(/* webpackChunkName: "login_home" */ '../components/Home.vue')
const Login = () => import(/* webpackChunkName: "login_home" */ '../components/Login.vue')
const Main = () => import(/* webpackChunkName: "login_home" */ '../components/Main.vue')

// import Users from '../components/user/Users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
// import Categories from '../components/goods/Categories.vue'
// import Params from '../components/goods/Params.vue'
// import Goods from '../components/goods/Goods.vue'
// import GoodsAdd from '../components/goods/GoodsAdd.vue'
// import Orders from '../components/order/Orders.vue'
// import Reports from '../components/report/Reports.vue'

const Users = () => import(/* webpackChunkName: "user_power" */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "user_power" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "user_power" */ '../components/power/Roles.vue')

const Categories = () => import(/* webpackChunkName: "goods" */ '../components/goods/Categories.vue')
const Attributes = () => import(/* webpackChunkName: "goods" */ '../components/goods/Attributes.vue')
const Goods = () => import(/* webpackChunkName: "goods" */ '../components/goods/Goods.vue')
const GoodsAdd = () => import(/* webpackChunkName: "goods" */ '../components/goods/GoodsAdd.vue')

const Orders = () => import(/* webpackChunkName: "order_report" */ '../components/order/Orders.vue')
const Reports = () => import(/* webpackChunkName: "order_report" */ '../components/report/Reports.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },

  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/main',
    children: [
      {
        path: '/main',
        component: Main
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights/authorities',
        component: Rights
      },
      {
        path: '/rights/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/attributes',
        component: Attributes
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/goods/add',
        component: GoodsAdd
      },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/orders/reports',
        component: Reports
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

// 导航守卫

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  const token = getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})

export default router
