const config = require('./config')
const themeListeners = []
global.isDemo = true
App({
  
  async onLaunch(opts, data) {
    // const that = this;
    // const canIUseSetBackgroundFetchToken = wx.canIUse('setBackgroundFetchToken')
    // if (canIUseSetBackgroundFetchToken) {
    //   wx.setBackgroundFetchToken({
    //     token: 'getBackgroundFetchToken',
    //   })
    // }
    // if (wx.getBackgroundFetchData) {
    //   wx.getBackgroundFetchData({
    //     fetchType: 'pre',
    //     success(res) {
    //       that.globalData.backgroundFetchData  = res;
    //       console.log('读取预拉取数据成功')
    //     },
    //     fail() {
    //       console.log('读取预拉取数据失败')
    //       wx.showToast({
    //         title: '无缓存数据',
    //         icon: 'none'
    //       })
    //     },
    //     complete() {
    //       console.log('结束读取')
    //     }
    //   })
    // }
    console.log('App Launch', opts)
    if (data && data.path) {
      wx.navigateTo({
        url: data.path,
      })
    }
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: config.envId,
        traceUser: true,
      },
      
      )
      const result = await wx.cloud.callContainer({
        config: {
          env: 'prod-3g90nuqn137592b4', // 微信云托管的环境ID
        },
        path: '/', // 填入业务自定义路径和参数，根目录，就是 / 
        method: 'GET', // 按照自己的业务开发，选择对应的方法
        header: {
          'X-WX-SERVICE': 'xxx', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
        }
        // dataType:'text', // 默认不填是以JSON形式解析返回结果，若不想让SDK自己解析，可以填text
      })
      console.log(result)
    }
  },

  
  onShow(opts) {
    console.log('App Show', opts)
    // console.log(wx.getSystemInfoSync())
  },
  onHide() {
    console.log('App Hide')
  },
  onThemeChange({ theme }) {
    this.globalData.theme = theme
    themeListeners.forEach((listener) => {
        listener(theme)
    })
  },
  watchThemeChange(listener) {
      if (themeListeners.indexOf(listener) < 0) {
          themeListeners.push(listener)
      }
  },
  unWatchThemeChange(listener) {
      const index = themeListeners.indexOf(listener)
      if (index > -1) {
          themeListeners.splice(index, 1)
      }
  },
  globalData: {
    theme: wx.getSystemInfoSync().theme,
    hasLogin: false,
    openid: null,
    iconTabbar: '/page/weui/example/images/icon_tabbar.png',
  },
  // lazy loading openid
  getUserOpenId(callback) {
    const self = this

    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success(data) {
          wx.cloud.callFunction({
            name: 'login',
            data: {
              action: 'openid'
            },
            success: res => {
              console.log('拉取openid成功', res)
              self.globalData.openid = res.result.openid
              callback(null, self.globalData.openid)
            },
            fail: err => {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              callback(res)
            }
          })
        },
        fail(err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  },
  // 通过云函数获取用户 openid，支持回调或 Promise
  getUserOpenIdViaCloud() {
    return wx.cloud.callFunction({
      name: 'wxContext',
      data: {}
    }).then(res => {
      this.globalData.openid = res.result.openid
      return res.result.openid
    })
  }
})
