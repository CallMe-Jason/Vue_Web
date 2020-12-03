import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
// import { config } from 'vue/types/umd'
import TreeTable from 'vue-table-with-tree-grid'

axios.interceptors.request.use(config=>{
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)
Vue.filter('dataFormat',function(originVal){
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1).toString().padStart(2,'0')
  const d = dt.getDate().toString().padStart(2,'0')
  const hh = dt.getHours().toString().padStart(2,'0')
  const mm = dt.getMinutes().toString().padStart(2,'0')
  const ss = dt.getSeconds().toString().padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
