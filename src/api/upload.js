import axios from 'axios'
import baseUrl from './configHttpUrl'
const address = baseUrl.uploadUrl

// 上传七牛云
export const uploadQiniu = (data) => {
  return axios.post(
    address + '/tQiniuContent/upload',
    data
  )
}