// pages/day/dayReserve/step1/step1.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    month:'',
    day:'',
    year:'',
    time:[],
    chosed_id: [],
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
    let thisyear = option.year;

    this.setData({
      month:thismonth,
      day:thisday,
      year:thisyear,
    })
    let app = getApp();
    let time = app.globalData.chosen_time;
    let id = app.globalData.chosen_id; 
    this.setData({
      time:time,
      chosed_id:id
    })
  },
  //拍照上传
  takephoto: function(){
    if(this.data.tipinfo == "确定上传"){
      wx.redirectTo({
        url: '../step2/step2?month=' + this.data.month + "&day=" + this.data.day + "&year=" + this.data.year,
      })
    }else{
      let self = this;
      wx.chooseImage({
        success: function (res) {
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