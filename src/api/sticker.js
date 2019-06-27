import axios from 'axios'
import baseUrl from './configHttpUrl'
const address = baseUrl.reqUrl
//查询贴纸详情：
export const queryItemDetail = (data) => axios ({
    url:address+'/v1/api/manage/queryItemDetail',
    method:'get',
    params:data
})
  //添加贴纸管理信息：
  export const addItemDetail = (data) => axios({
    url:address+'/v1/api/manage/addItemDetail',
    method:'post',
    data
  })
  //批量修改贴纸详情收费状态：
  export const updateAllItemPriceFlag = (data) => axios({
      url:address+'/v1/api/manage/updateAllItemPriceFlag',
      params:data,
      method:'post'
  })
  //物理批量删除贴纸信息:
  export const delAllItemDetail = (data) => axios({
       url:address+'/v1/api/manage/delAllItemDetail',
      method:'post',
      params:data
  })
  
  //批量修改贴纸详情禁用状态：
  export const updateAllItemDetailShowStatus = (data) => axios({
      url:address+'/v1/api/manage/updateAllItemDetailShowStatus',
      method:'post',
      params:data
  })
  //修改贴纸详情信息:
  export const updateItemDetail = (id,data) =>axios({
      url:address+`/v1/api/manage/updateItemDetail`,
      method:'post',
      params:id,
      data
  })
  //查询贴纸分类：
  export const findItemClass = (data) =>axios({
    url:address+'/v1/api/manage/findItemClass',
    method:'get',
    params:data
  })
  //修改贴纸类型信息:
  export const updateItemClass = (id,data) => axios({
      url:address+'/v1/api/manage/updateItemClass',
      method:'post',
      params:id,
      data
  })
  //修改贴纸分类显示状态:
  export const updateShowItemClassShowStatus = (data) =>axios({
      url:address+'/v1/api/manage/updateShowItemClassShowStatus',
      method:'post',
      params:data
  })
  //物理删除贴纸分类：
  export const delItemClass = (data) => axios({
      url:address+'/v1/api/manage/delItemClass',
      method:'post',
      params:data
  })
  //查询贴纸分类名称-添加时使用：
  export const queryItemClass = () => axios({
    url:address+'/v1/api/manage/queryItemClass',
    method:'get'
  })
  //添加贴纸分类信息:
  export const addItemClass = (data) => axios({
       url:address+'/v1/api/manage/addItemClass',
      method:'post',
      data
  })
  
  