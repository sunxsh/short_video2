// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import '@/assets/icons/iconfont.css'
import 'iview/dist/styles/iview.css'
Vue.use(iView);
// 树状表格
import TreeTable from 'tree-table-vue'
Vue.use(TreeTable)
Vue.config.productionTip = false
// 播放器
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import VideoPlayer from 'vue-video-player'
Vue.use(VideoPlayer)
//引入v-viewer:
import 'viewerjs/dist/viewer.css'
import './index.less'
import Viewer from 'v-viewer'
Vue.use(Viewer)

//按需引入Element组件
import {Checkbox} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Checkbox)

import changePage from '@/components/changePages/changePages'
Vue.component('change-page', changePage)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
