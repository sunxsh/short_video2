import axios from 'axios'
import baseUrl from './configHttpUrl'
const address = baseUrl.reqUrl
//查询短视频：
export const getShortVideoAll = (data) => axios.get(address+'/v1/api/manage/getShortVideoAll',{ params: data})
//添加短视频：
export const createShortVideo = (data)=> axios.post(address+ '/v1/api/manage/createShortVideo', data)
//根据短视频id查询短视频：
export const getShortVideoById = (data) => axios.get(address+'/v1/api/manage/getShortVideoById',{ params: data})
//删除短视频：
export const deleteShortVideoLogic = ({ids}) => axios.get(address+`/v1/api/manage/deleteShortVideoLogic/${ids}`)
//物理删除短视频：
export const deleteShortVideoPhysical = ({ids}) => axios.get(address+`/v1/api/manage/deleteShortVideoLogic/${ids}`)
//短视频分类：
//查询短视频分类：
export const getshortVideoClass = (data) => axios.get(address+'/v1/api/manage/getshortVideoClass',{ params: data})
//增加短视频分类：
export const addShortVideoClass = (data)=> axios.post(address+'/v1/api/manage/createShortVideoClass', data)
//逻辑删除短视频分类：
export const delVideoClass = ({ids}) => axios.get(address+`/v1/api/manage/delVideoClass/${ids}`)
//是否显示短视频分类：
export const showVideoClass = ({id,status}) => axios.get(address+`/v1/api/manage/showVideoClass/${id}/${status}`)
//根据审核状态查询短视频：
export const getShortVideoByReviewStatus = (data) => axios.get(address+'/v1/api/manage/getShortVideoByReviewStatus',{ params: data})
//修改评论状态：
export const editCommentStatus = ({ids,status})=> axios.post(address+`/v1/api/manage/closeShortVideoComment/${ids}/${status}`)
//查询短视频审核:
export const getVideoReview = (data) =>axios({
 url:address+'/v1/api/manage/ShortVideoReview/getVideoReview',
      params:data,
      method:'get'
}) 
//根据短视频表ID单个处理短视频审核:
export const updateVideoReview = ({shortvideoid,reviewStatus,remark})=> axios.post(address+`/v1/api/manage/ShortVideoReview/updateVideoReview/${shortvideoid}/${reviewStatus}/${remark}`)
//根据视频ID查询视频审核记录:
export const getVideoReviewById = ({shortvideoid}) => axios.get(address+`/v1/api/manage/ShortVideoReview/getVideoReview/${shortvideoid}`)
//根据短视频表ID批量处理短视频审核:
export const updateVideoReviewsByIds = ({shortvideoids,reviewstatus})=> axios.post(address+`/v1/api/manage/ShortVideoReview/updateVideoReviews/${shortvideoids}/${reviewstatus}`)
// 视频下架
export const undercarriageVideo = ({
    videoId,
    groundStatus
  }) => {
      return axios.post(
            address + `/v1/api/manage/updateVideoGroundStatus?videoId=${videoId}&groundStatus=${groundStatus}`
      )
}