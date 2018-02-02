const router = require('express').Router()
const { wxMiddlewareBuilder } = require('./utils')
const { User, Channel } = require('./models')

router.use('/wx', wxMiddlewareBuilder(async (message, req, res, next) => {
  const { FromUserName, Content } = message
  console.log('收到微信消息：', { message })

  let user = new User(FromUserName)
  await user.login()

  const params = Content.trim().split(' ')
  if (params[0] !== 'link') {
    res.reply({
      type: 'text',
      content: `目前仅支持 link 命令。`
    })
  } else {
    let channelName = params[1]
    if (channelName) {
      try {
        let channel = new Channel(channelName)
        await channel.init()
        await user.linkChannel(channel)
      } catch (e) {
        console.error(e)
        return res.reply({
          type: 'text',
          content: 'Someting went wrong...'
        })
      }
    }
      // 返回用户的 Channel 列表
    let channels = await user.findChannels()
    let content = channels.length ? channels.reverse().join('\n') : '您还未绑定频道'
    return res.reply({
      type: 'text',
      content
    })
  }
})
)

router.use('/push', async function (req, res) {
  const { channelName, text } = req.body
  console.log(req.body)
  if (!channelName || !text) {
    return res.json({
      error: 1,
      message: 'Bad params!'
    })
  }

  let channel = new Channel(channelName)
  await channel.init()
  if (!channel.exist) {
    return res.json({
      error: 1,
      message: 'Channel not exist!'
    })
  }
  await channel.push(text)
  res.json({
    error: 0,
    message: 'Done!'
  })
})

module.exports = router
