// pages/day/dayReserve/step2/step2.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    focusA: false,
    focusB: false,
    name: '',
    people: 0,
    phone: 0,
    company: "",
    info: "",
    atoken: "",
    hasfilled: true,
    inputTxt: 0,
    year: "",
    month: "",
    day: "",
    loadingHidden: false,
  },
  //输入框聚焦
  onfocusA: function() {
    this.setData({
      focusA: true,
      focusB: false
    })
  },
  onfocusB: function() {
    this.setData({
      focusA: false,
      focusB: true
    })
  },
  getname: function(e) {
    var val = e.detail.value;
    this.setData({
      name: val
    });
    let name = this.data.name;
    let people = this.data.people;
    let phone = this.data.phone;
    let company = this.data.company;
    let filled = true;
    if ((people != 0) && (phone != 0) && (company != "") && (name != ""))
      filled = false;
    this.setData({
      hasfilled: filled
    })
  },
  getpeople: function(e) {
    var val = e.detail.value;
    if (val > 30) {
      val = 30;
    }
    this.setData({
      people: val,
      inputTxt: val
    });
    let name = this.data.name;
    let people = this.data.people;
    let phone = this.data.phone;
    let company = this.data.company;
    let filled = true;
    if ((people != 0) && (phone != 0) && (company != "") && (name != ""))
      filled = false;
    this.setData({
      hasfilled: filled
    })
  },
  getphone: function(e) {
    var val = e.detail.value;
    this.setData({
      phone: val
    });
    let name = this.data.name;
    let people = this.data.people;
    let phone = this.data.phone;
    let company = this.data.company;
    let filled = true;
    if ((people != 0) && (phone != 0) && (company != "") && (name != ""))
      filled = false;
    this.setData({
      hasfilled: filled
    })
  },
  getcompany: function(e) {
    var val = e.detail.value;
    this.setData({
      company: val
    });
    let name = this.data.name;
    let people = this.data.people;
    let phone = this.data.phone;
    let company = this.data.company;
    let filled = true;
    if ((people != 0) && (phone != 0) && (company != "") && (name != ""))
      filled = false;
    this.setData({
      hasfilled: filled
    })
  },
  getinfo: function(e) {
    var val = e.detail.value;
    this.setData({
      info: val
    });
    let name = this.data.name;
    let people = this.data.people;
    let phone = this.data.phone;
    let company = this.data.company;
    let filled = true;
    if ((people != 0) && (phone != 0) && (company != "") && (name != ""))
      filled = false;
    this.setData({
      hasfilled: filled
    })
  },
  checkInfo: function() {
    let people = this.data.people;
    let phone = this.data.phone;
    let company = this.data.company;
    if ((people != 0) && (phone != 0) && (company != ""))
      return true;
    return false;
  },
  reserve: function() {
    //发送请求，如果成功进入下一步，如果不成功则提示失败
    let name = this.data.name;
    let people = this.data.people;
    let phone = this.data.phone;
    let company = this.data.company;
    let filled = false;
    if ((people != 0) && (phone != 0) && (company != "") && (name != ""))
      filled = true;

    let time = getApp().globalData.chosen_id;
    //将预约信息集合成一个JSON

    let token = this.data.atoken;
    let status = false;
    let that = this;

    function upInfo(pic_url) {
      var p = new Promise(function(resolve, reject) {
        wx.request({
          url: app.globalData.request_url + 'reservations/',
          method: 'post',
          header: {
            Authorization: "Bearer " + token
          },
          data: {
            credential: pic_url,
            name: that.data.name,
            year: that.data.year,
            month: that.data.month,
            day: that.data.day,
            blocks: time,
            population: that.data.people,
            organization: that.data.company,
            phone: that.data.phone,
            remarks: that.data.info,
          },
          success: function(res) {
            resolve(res)
          },
          fail: function(res) {
          }
        })
      })
      return p;
    }
    let path = getApp().globalData.pic;

    function uppic() {
      var q = new Promise(function(resolve, reject) {
        wx.uploadFile({
          url: app.globalData.request_url + 'credentials',
          filePath: path,
          name: 'credential',
          header: {
            Authorization: "Bearer " + token
          },
          success: function(res) {
            resolve(res)
          },
          fail: function(res) {
            resolve(res)
          }
        })
      })
      return q;
    }
    if (filled) {
      this.setData({
        loadingHidden: false,
      })
      uppic().then(res => {
        let url = JSON.parse(res.data).url;
        upInfo(url).then(res => {
          that.setData({
            loadingHidden: true,
          })
          wx.redirectTo({
            url: '../step3/step3',
          })
        }).catch(err => {
        })
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    let that = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
        let atoken = res.data;
        that.setData({
          atoken: atoken,
          loadingHidden: true,
        })
      }
    })
    let thismonth = option.month;
    let thisday = option.day;
    let thisyear = option.year;

    this.setData({
      month: thismonth,
      day: thisday,
      year: thisyear,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})