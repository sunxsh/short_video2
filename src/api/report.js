import axios from 'axios'
import baseUrl from './configHttpUrl'
const address = baseUrl.reqUrl
//查询举报评论列表：
export const getCommentReports = (data) =>axios({
     url:address+'/v1/api/manage/CommentReport/getCommentReports',
      params:data,
      method:'get'
}) 
  //根据commentid单个处理评论举报:
export const updateCommentReport = ({commentid,isDispose}) =>axios({
     url:address+`/v1/api/manage/CommentReport/updateCommentReport/${commentid}/${isDispose}`,
      method:'post'
})
  //查询音乐举报：
export const getBgMusicReports = (data) => axios.get(address+'/v1/api/manage/MusicReport/getBgMusicReports',{ params: data})
//根据musicid单个处理短音乐举报：
export const updateBgMusicReport = ({musicid,isDispose})=> axios.post(address+`/v1/api/manage/MusicReport/updateBgMusicReport/${musicid}/${isDispose}`)

//查询举报视频列表：
export const getVideoReportsByDispose = ({querylist}) =>axios({
    url:address+`/v1/api/manage/ShortVideoReport/getVideoReports`,
      params:querylist,
      method:'get'
})

//单个处理短视频举报：
export const updateVideoReport = ({shortvideoid,isDispose}) => axios({
    url:address+`/v1/api/manage/ShortVideoReport/updateVideoReport/${shortvideoid}/${isDispose}`,
    method:'post'
})
  