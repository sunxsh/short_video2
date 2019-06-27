import axios from 'axios'
import baseUrl from './configHttpUrl'
const address = baseUrl.reqUrl
//查询滤镜详情信息:
export const queryFilterDetail = (data) =>axios({
    url:address+'/v1/api/manage/queryFilterDetail',
    method:'get',
    params:data
})
  //批量修改滤镜收费状态:
export const updateFilterPriceFlag = (data)=> axios({
    url:address+'/v1/api/manage/updateFilterPriceFlag',
    method:'post',
    params:data
})
  //批量修改滤镜详情显示状态:
export const updateAllFilterDetailShowStatus = (data)=> axios({
    url:address+'/v1/api/manage/updateAllFilterDetailShowStatus',
    method:'post',
    params:data
})
 //添加滤镜详情信息：
export const addFilterDetail = (data)=> axios.post(`/v1/api/manage/addFilterDetail`, data)
  //修改滤镜详情信息:
export const updateFilterDetail = (id,data)=> axios({
    url:address+'/v1/api/manage/updateFilterDetail',
    method:'post',
    params:id,
    data
})
//物理批量删除滤镜详情信息:
export const delTrueAllFilterDetail = (data)=> axios({
    method: 'post',
    url: address+'/v1/api/manage/delTrueAllFilterDetail',
    params: data
  });
//查询滤镜分类:
export const findFilterclass = (data) => axios.get(address+'/v1/api/manage/findFilterclass',{ params: data})
//修改滤镜类型信息:
export const updateFilterClass = (id,data)=> axios({
    url:address+'/v1/api/manage/updateFilterClass',
    method:'post',
    params:id,
    data
})
//修改滤镜分类的显示状态:
export const updateShowFilterClass = (data)=> axios({
    url:address+'/v1/api/manage/updateShowFilterClass',
    method:'post',
    params:data
})
//物理删除滤镜分类:
export const delFilterclass = (data)=> axios({
    url:address+'/v1/api/manage/delFilterclass',
    method:'post',
    params:data
})
//添加滤镜分类信息:
export const addFilterClass = (data)=> axios.post(address+`/v1/api/manage/addFilterClass`, data)
//查询滤镜类型列表:
export const findAddFilterClass = () => axios.get(address+'/v1/api/manage/findAddFilterClass')

  