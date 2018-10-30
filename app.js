//app.js
App({
  onLaunch: function (scene) {
    wx.setNavigationBarTitle({ title: "西安交通大学西迁历史纪念馆" });


    //首次进入或者冷启动时出现提示
    let sceneID = scene.scene;
    if( sceneID == 1001 || sceneID == 1019 || sceneID == 1022 || sceneID == 1023 || sceneID == 1038 || sceneID == 1056 ){
      
    }

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    let url = this.globalData.request_url
    wx.login({
      success: res => {
          if (res.code) {
            wx.request({
              url: url + 'authorizations',
              method: 'post',
              data: {
                code: res.code
              },
              success:function(res){
                let token = res.data.access_token;
                wx.setStorage({
                  key: 'token',
                  data: token,
                })
              }
            })
            
          } else {
            
          }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    chosen_time:[],
    chosen_id:[],
    pic:"",
    request_url:"https://mem.eeyes.xyz/api/",
  }
})