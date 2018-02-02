const WechatAPI = require('wechat-api')
const wechat = require('wechat')
const { promisify } = require('util')

const appid = process.env.WX_APP_ID
const secret = process.env.WX_APP_SC
const token = process.env.WX_TOKEN
const templateId = process.env.WX_TEMPLATE_ID
const dest = process.env.WX_TEMPLATE_DEST
const checkSignature = false

const wxAPI = new WechatAPI(appid, secret)
const sendTemplate = promisify(wxAPI.sendTemplate).bind(wxAPI)

const wxMiddlewareBuilder = function (fn) {
  // 目前只接受 Text 类型的指令
  return wechat({ token, appid, checkSignature }).text(fn).middlewarify()
}

const push = async function (openId, text) {
  let data = {
    text: {
      value: text,
      color: '#173177'
    }
  }
  return sendTemplate(openId, templateId, dest, data)
}
module.exports = {
  wxMiddlewareBuilder,
  push
}
