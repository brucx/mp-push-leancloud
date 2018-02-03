const AV = require('leanengine')
const { push } = require('./utils')

const ChannelObject = AV.Object.extend('Channel')
const UserToChannelObject = AV.Object.extend('UserToChannel')

class User {
  constructor (openId) {
    this.openId = openId
  }

  async login () {
    // openId 就是用来识别用户的唯一标识
    try {
      this.Object = await AV.User.signUpOrlogInWithAuthData({
        uid: this.openId
      }, 'mp')
    } catch (e) {
      console.error(e)
    }
    return this
  }

  async findChannels () {
    let userToChannelQuery = new AV.Query('UserToChannel')
    let results = await userToChannelQuery.equalTo('user', this.Object).find()
    return results.map(userToChannel => {
      return userToChannel.get('channelName')
    })
  }

  async linkChannel (channel) {
    if (!channel.exist) {
      channel.owner = this
      await channel.create()
    }
    let userToChannelQuery = new AV.Query('UserToChannel')
    let result = await userToChannelQuery.equalTo('user', this.Object).equalTo('channel', channel.Object).first()
    if (result) return
    let userToChannelObject = new UserToChannelObject()
    userToChannelObject.set({
      user: this.Object,
      openId: this.openId,
      channel: channel.Object,
      channelName: channel.name
    })
    await userToChannelObject.save()
  }
}

class Channel {
  constructor (channelName) {
    this.name = channelName
    this.exist = false
  }

  async init () {
    if (this.Object) return
    let channelQuery = new AV.Query('Channel')
    let result = await channelQuery.equalTo('name', this.name).first()
    if (result) {
      this.Object = result
      this.exist = true
    } else {
      let channelObject = new ChannelObject()
      this.Object = channelObject
    }
  }

  async create () {
    if (this.exist) return
    let channelObject = this.Object
    channelObject.set({name: this.name, owner: this.owner.Object})
    this.Object = await channelObject.save()
    this.exist = true
  }

  async push (text) {
    let userToChannelQuery = new AV.Query('UserToChannel')
    let results = await userToChannelQuery.equalTo('channel', this.Object).find()
    return Promise.all(results.map(userToChannel => {
      let openId = userToChannel.get('openId')
      return push(openId, text)
    }))
  }
}

module.exports = {
  User,
  Channel
}
