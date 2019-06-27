import axios from 'axios'
// axios.defaults.baseURL = 'http://192.168.0.129:8003';
// const address = 'http://192.168.0.129:8003';
import baseUrl from './configHttpUrl'
const address = baseUrl.payConfigUrl

// 添加网站配置
export const tbSiteSetting = (data)=>axios.post( address+'/tbSiteSetting', data)
//拉取网站配置
export const getSiteSetting = () => axios.get(address+'/tbSiteSetting/find')
//拉取网站安全配置
export const getSecurity = () => axios.get(address+'/tbSiteSecre/find')
// 保存网站安全配置
export const postSecurity = (data) => axios.post(address+'/tbSiteSecre', data)
// 拉取开放列表
export const getOauthSetting = () => axios.get(address+'/tbOauthSetting/finaAll')
// 添加开放列表
export const postOauthSetting = (data) => axios.post(address+'/tbOauthSetting',data)
//修改开放类表
export const putOauthSetting = (data) => axios.put(address+'/tbOauthSetting',data)
//拉取短信设置
export const getMessageFindAll = () =>axios.get(address+'/tbShortMessageSetting/findAll')
 //保存短信设置
export const postMessageSetting = (data) => axios.post(address+'/tbShortMessageSetting',data)
   //删除开放
export const deleteOauthSetting = (id) =>axios.delete(address+'/tbOauthSetting/'+ id)
  //添加支付
  export const postPaySetting = (data) => axios.post(address+'/tbPaySetting',data)
  //拉取支付
  export const getPaySetting = () => axios.get(address+'/tbPaySetting/findAll')
  //拉取分享
  export const getShareSetting = () =>axios.get(address+'/tbShareSetting/findAll')
  //提交分享
  export const postShareSetting = (data) =>axios.post(address+'/tbShareSetting',data)
 
  