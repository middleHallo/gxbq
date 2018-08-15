/**
 * 小程序配置文件
 */

// 此处服务器域名地址，用于生产环境
var host = 'https://xcxa.guokehuyu.com'

// 
// 开发环境用本地接口地址
// var host = 'http://192.168.1.110'
var config = {
  // 
  service: {
    requesturl: `${host}/other/`
  }
}
module.exports = config
