// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'view-design'
import config from '@/config'
import axios from 'axios'
import Cookies from 'js-cookie'
import importDirective from '@/directive'
import 'view-design/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
import 'highlight.js/styles/tomorrow-night-eighties.css'
import echarts from 'echarts'

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer)
Viewer.setDefaults({
    Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})

// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') 
// require('@/mock')




Vue.use(iView)
    /**
     * @description 生产环境关掉提示
     */
Vue.config.productionTip = false
    /**
     * @description 全局注册应用配置
     */
Vue.prototype.$config = config
    /**
     * @description 全局注册echarts
     */
Vue.prototype.$echarts = echarts
    /**
     * 注册指令
     */
importDirective(Vue)

axios.defaults.headers['X-Token'] = Cookies.get('token');
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    watch: {
        $route: {
          handler: function () {
            axios.defaults.headers['X-Token'] = Cookies.get('token');
          },
          deep: true
        }
      }
})