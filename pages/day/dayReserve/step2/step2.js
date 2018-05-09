// pages/day/dayReserve/step2/step2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focusA: false,
    focusB: false,
    people: 0,
    phone: 0,
    company: "",
    atoken:"",
    hasfilled:true,
    inputTxt:0
  },
  //输入框聚焦
  onfocusA: function () {
    this.setData({
      focusA: true,
      focusB: false
    })
  },
  onfocusB: function () {
    this.setData({
      focusA: false,
      focusB: true
    })
  },
  getpeople: function (e) {
    var val = e.detail.value;
    if(val>30){
      val = 30;
    }
    this.setData({
      people: val,
      inputTxt:val
    });
    let people = this.data.people;
    let phone = this.data.phone;
    let company = this.data.company;
    let filled = true;
    if ((people != 0) && (phone != 0) && (company != ""))
      filled = false;
    this.setData({
      hasfilled:filled
    })
  },
  getphone: function (e) {
    var val = e.detail.value;
    this.setData({
      phone: val
    });
    let people = this.data.people;
    let phone = this.data.phone;
    let company = this.data.company;
    let filled = true;
    if ((people != 0) && (phone != 0) && (company != ""))
      filled =false;
    this.setData({
      hasfilled:filled
    })
  },
  getcompany: function (e) {
    var val = e.detail.value;
    this.setData({
      company: val
    });
    let people = this.data.people;
    let phone = this.data.phone;
    let company = this.data.company;
    let filled = true;
    if ((people != 0) && (phone != 0) && (company != ""))
      filled = false;
    this.setData({
      hasfilled: filled
    })
  },
  checkInfo:function(){
    let people = this.data.people;
    let phone = this.data.phone;
    let company = this.data.company;
    if((people!=0)&&(phone!=0)&&(company!=""))
      return true;
    return false;
  },
  reserve: function () {
    //发送请求，如果成功进入下一步，如果不成功则提示失败
    let people = this.data.people;
    let phone = this.data.phone;
    let company = this.data.company;
    let filled =  false;
    if ((people != 0) && (phone != 0) && (company != ""))
      filled = true;
    
    let time = getApp().globalData.chosen_id;
    //将预约信息集合成一个JSON

    let tttoken = this.data.atoken;
    let status = false;
    let that = this;
    function upInfo(){
      var p = new Promise(function(resolve,reject){
        wx.request({
          url: 'https://visit.sxxuzhixuan.top/api/reserve',
          method: 'post',
          header: { Authorization: "Bearer " + tttoken },
          data: {
            reserve_time: time,
            people: that.data.people,
            phone: that.data.people,
            company: that.data.company
          },
          success: function (res) {
            console.log("成功");
            resolve(res)
          },
          fail: function (res) {
            console.log("失败");
          }
        })
      })
      return p;
    }
    let path = getApp().globalData.pic;

    function uppic(){
      var q = new Promise(function(resolve,reject){
        wx.uploadFile({
          url: 'https://visit.sxxuzhixuan.top/api/user/id-card',
          filePath: path,
          name: 'idcard',
          header: { Authorization: "Bearer " + tttoken },
          success:function(res){
            console.log(res)
            resolve(res)
          },
          fail:function(res){
            console.log(res)
            resolve(res)
          }
        })
      })
      return q;
    }
    if(filled){
      upInfo().then(function (data) {
        console.log(data);
        uppic();
      }).then(() => {
        console.log("都成功了")
        wx.redirectTo({
          url: '../step3/step3',
        })
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        let atoken = res.data;
        that.setData({
          atoken: atoken
        })
      }
    })
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