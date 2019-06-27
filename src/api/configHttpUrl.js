import config from './baseURL.js'
console.log(process.env.NODE_ENV)
let baseUrl
switch (process.env.NODE_ENV) {
  case 'testing':
    baseUrl = config.baseUrl.test
    break
  case 'production':
    baseUrl = config.baseUrl.pro
    break
  case 'development':
    baseUrl = config.baseUrl.dev
    break
}
export default baseUrl
