import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//import element from './plugins/element'

import TreeTable from 'vue-table-with-tree-grid'
//import VueQuillEditor from 'vue-quill-editor'


//import * as echarts from 'echarts'

// css
import './assets/css/global.css'
import './assets/fonts/iconfont.css'



// quill styles
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

import Common from './common/Common'


//import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'



// axios
//import axios from 'axios'
Vue.prototype.$echarts = echarts
axios.defaults.baseURL = Common.baseURL

// 在request拦截，显示进度条
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 在response拦截，隐藏进度条
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

Vue.use(VueQuillEditor)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
