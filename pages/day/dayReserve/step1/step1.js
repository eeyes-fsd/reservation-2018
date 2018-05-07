// pages/day/dayReserve/step1/step1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    month:'',
    day:'',
    time:[],
    hasImage:false,
    src:'',
    tipinfo:'拍取照片'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let thisid = option.time;
    let thismonth = option.month;
    let thisday = option.day;
    this.setData({
      month:thismonth,
      day:thisday
    })
    let app = getApp();
    let time = app.globalData.chosen_time;
    this.setData({
      time:time
    })
  },
  //拍照上传
  takephoto: function(){
    if(this.data.tipinfo == "确定上传"){
      wx.redirectTo({
        url: '../step2/step2',
      })
    }else{
      let self = this;
      wx.chooseImage({
        success: function (res) {
          console.log(res)
          self.setData({
            tipinfo: "确定上传"
          })
          self.setData({
            hasImage: true,
            src: res.tempFilePaths[0]
          })
          getApp().globalData.pic = res.tempFilePaths[0];
          wx.previewImage({
            current: res.tempFilePaths[0], // 当前显示图片的http链接
            urls: res.tempFilePaths // 需要预览的图片http链接列表
          })
        },
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})