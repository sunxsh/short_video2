var url_lm = "http://192.168.0.129:4000"
var url_sm = 'http://api.lgh81.cn:4000'
var url_dev = 'http://192.168.0.125:8082'
// 文件上传
var url_upload = 'http://192.168.0.129:4008'
export default {
  baseUrl: {
    dev: {
      reqUrl: url_dev + '/rrk-shortvideo-manage',
      uploadUrl: url_upload + '',
      payConfigUrl:url_lm+'/api-set'
    },
    pro: {
      reqUrl: url_sm + '/rrk-shortvideo-manage',
      uploadUrl: url_sm + '/api-file',
      payConfigUrl:url_sm+'/api-set'
    },
    test: {
      reqUrl: url_lm + '/rrk-shortvideo-manage',
      uploadUrl: url_lm + '/api-file',
      payConfigUrl:url_lm+'/api-set'
    }
  }
}