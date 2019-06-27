import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App.vue'
// 首页
import Home from '@/views/single-page/home/index.vue'
// 系统设置
import Website from '@/views/systemConfig/website.vue'
import WebsiteSecurity from '@/views/systemConfig/websiteSecurity.vue'
import ShortMessage from '@/views/systemConfig/shortMessage.vue'
import OpenConfig from '@/views/systemConfig/openConfig.vue'
import Region from '@/views/systemConfig/region.vue'
import Payment from '@/views/systemConfig/payment.vue'
import Share from '@/views/systemConfig/share.vue'
//短视频管理
import VideoManagent from '@/views/s_video/s_videoManagentSystem/videoManagent.vue'
import VideoCategory from '@/views/s_video/s_videoManagentSystem/videoCategory.vue'
import VideoReview from '@/views/s_video/reviewManagement/shortVideo_review.vue'
// 音乐管理
import Musicinfo from '@/views/s_video/musicManagement/musicInfo/musicInfo.vue'
import MusicClass from '@/views/s_video/musicManagement/musicInfo/musicClass.vue'
import MusicReview from '@/views/s_video/reviewManagement/music_review.vue'
// 滤镜管理
import Filter from '@/views/s_video/filters_stickers/filtersManagement/filtersInfo.vue'
import FiltersClass from '@/views/s_video/filters_stickers/filtersManagement/filtersClass.vue'
//贴纸管理
import StickersInfo from '@/views/s_video/filters_stickers/stickersManagement/stickersInfo.vue'
import StickersClass from '@/views/s_video/filters_stickers/stickersManagement/stickersClass.vue'
//评论审核
import CommentReview from '@/views/s_video/reviewManagement/comment_review.vue'
//举报管理
import VideoReport from '@/views/s_video/reportManagement/video_report.vue'
import MusicReport from '@/views/s_video/reportManagement/music_report.vue'
import CommentReport from '@/views/s_video/reportManagement/comment_report.vue'
//test
import Test from '@/views/test/test.vue'

Vue.use(Router) 
export default new Router({
  routes: [
    {path: '/',name: 'App',component: App,redirect:'/home',
    children:[
      {path: 'home',name: 'Home',component: Home},
      {path: 'website',name: 'Website',component: Website},
      {path: 'websiteSecurity',name: 'WebsiteSecurity',component: WebsiteSecurity},
      {path: 'shortMessage',name: 'ShortMessage',component: ShortMessage},
      {path: 'openConfig',name: 'OpenConfig',component: OpenConfig},
      {path: 'region',name: 'Region',component: Region},
      {path: 'payment',name: 'Payment',component: Payment},
      {path: 'share',name: 'Share',component: Share},
      //短视频管理
      {path: 'videoManagent',name: 'VideoManagent',component: VideoManagent},
      {path: 'videoCategory',name: 'VideoCategory',component: VideoCategory},
      {path: 'videoReview',name: 'VideoReview',component: VideoReview},
      // 音乐管理
      {path: 'musicinfo',name: 'Musicinfo',component: Musicinfo},
      {path: 'musicClass',name: 'MusicClass',component: MusicClass},
      {path: 'musicReview',name: 'MusicReview',component: MusicReview},
      // 滤镜管理
      {path: 'filter',name: 'Filter',component: Filter},
      {path: 'filtersClass',name: 'FiltersClass',component: FiltersClass},
      //贴纸管理
      {path: 'stickersInfo',name: 'StickersInfo',component: StickersInfo},
      {path: 'stickersClass',name: 'StickersClass',component: StickersClass},
      //评论审核
      {path: 'commentReview',name: 'CommentReview',component: CommentReview},
      //举报管理
      {path: 'videoReport',name: 'VideoReport',component: VideoReport},
      {path: 'musicReport',name: 'MusicReport',component: MusicReport},
      {path: 'commentReport',name: 'CommentReport',component: CommentReport},
      //test
      {path: 'test',name: 'Test',component: Test},
    ]
  }
  ]
})
