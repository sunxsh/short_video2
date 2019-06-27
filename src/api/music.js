import axios from 'axios'
import baseUrl from './configHttpUrl'
const address = baseUrl.reqUrl
//查询音乐：
export const getMusicAll = (data) => axios.get(address+'/v1/api/manage/music/getMusic',{ params: data})
//批量逻辑删除音乐：
export const deleteMusic = (data)=> axios.delete( address+'/v1/api/manage/music/deleteMusic', { params: data})
//批量物理删除音乐：
export const deleteMusicPhysical = (data)=> axios.delete( address+'/v1/api/manage/music/deleteMusicPhysical', { params: data})
//查询音乐分类：
export const getMusicClass = () => axios.get(address+'/v1/api/manage/music/getMusicClass')
//物理删除音乐分类：
export const deleteMusicClassPhysical = (data)=> axios.delete(address+'/v1/api/manage/music/deleteMusicClass', { params: data})
//根据音乐ID查询音乐详情
export const getMusicById = (data) => axios.get(address+'/v1/api/manage/music/getMusicById',{ params: data})
//根据音乐分类ID查询音乐:
export const getMusicByClassId = (data) => axios.get(address+'/v1/api/manage/music/getMusicByClassId',{ params: data})
//根据音乐表ID单个审核音乐:
export const updatebgMusicReview = ({musicid,status,remark})=> axios.post(address+`/v1/api/manage/music/updatebgMusicReview/${musicid}/${status}/${remark}`)
//批量修改音乐审核状态：
export const updatebgMusicReviews = ({musicids,status})=> axios.post(address+`/v1/api/manage/music/updatebgMusicReviews/${musicids}/${status}`)
//是否启用短视频音乐分类(status 0显示 1不显示):
export const changeMusicClassbyStatus = (data) => axios.get(address+'/v1/api/manage/music/changeMusicClassbyStatus',{ params: data})
//根据音乐表ID批量审核音乐:
export const updatebgMusicReviewsByIds = ({musicids,status})=> axios.post(address+`/v1/api/manage/music/updatebgMusicReviews/${musicids}/${status}`)
//根据音乐审核状态查询音乐详情:
export const getMusicByReviewStatus = (data) => axios.get(address+'/v1/api/manage/music/getMusicByReviewStatus',{ params: data})
//根据音乐ID查询评论审核记录：
export const getMusicReview = ({musicid}) =>axios.get(address+`/v1/api/manage/music/getMusicReview/${musicid}`)
// 添加音乐
export const addMusic = (data) => {
  return axios.post(
    address + '/v1/api/manage/music/setMusic',
    data
  )
}