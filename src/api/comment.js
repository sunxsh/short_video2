import axios from 'axios'
import baseUrl from './configHttpUrl'
const address = baseUrl.reqUrl

//根据审核状态查询评论审核:
export const getCommentReview = (data) =>axios({
    url:address+'/v1/api/manage/CommentReview/getCommentReview',
    method:'get',
    params:data
})
  
  //根据评论审核状态查询评论:
  export const getCommentByReviewStatus = (data) =>axios({
    url:address+'/v1/api/manage/CommentReview/getCommentByReviewStatus',
    method:'get',
    params:data
  })
  
  //根据评论ID查询评论审核记录:
  export const getCommentReviewById = ({commentid}) =>axios({
    url:address+`/v1/api/manage/CommentReview/getCommentReview/${commentid}`,
    method:'get'
  }) 
  
  //根据评论表ID单个处理评论审核:
  export const updateCommentReviewById = ({commentid,reviewstatus,memo}) =>axios({
url:address+`/v1/api/manage/CommentReview/updateCommentReview/${commentid}/${reviewstatus}/${memo}`,
      method:'post'
  }) 
  
  //根据评论表ID批量处理评论审核:
  export const updateCommentReviewsByIds = ({commentid,reviewStatus}) =>axios({
 url:address+`/v1/api/manage/CommentReview/updateCommentReviews/${commentid}/${reviewStatus}`,
      method:'post'
  }) 
  