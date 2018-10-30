// pages/day/dayCheck/dayCheck.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    month: 0,
    day: 0,
    year: 0,
    date: "",
    time_table: [],
    edit: false,
    time_chosen: [],
    id_chosen: [],
    hasChosen: true,
    picSrc: "../../static/border.png",
    showModal: false,
    loadingHidden: false,
    cancelID: -1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {

    let thismonth = option.month;
    let thisday = option.day;
    let thisyear = option.year;
    let thisdate = option.date;

    this.setData({
      month: thismonth,
      day: thisday,
      year: thisyear,
      date: thisdate,
    })
    //发送请求获得json数据
    function getToken() {
      var p = new Promise(function(resolve, reject) {
        wx.getStorage({
          key: 'token',
          success: function(res) {
            let atoken = res.data;
            resolve(atoken)
          }
        })
      })
      return p;
    }

    function getDay(token) {
      var p = new Promise(function(resolve, reject) {
        let api = app.globalData.request_url
        wx.request({
          url: api + 'status/' + thisdate,
          method: 'get',
          header: {
            Authorization: "Bearer " + token
          },
          success: function(res) {
            let time = res.data.data;
            resolve(time);
          }
        });
      });
      return p;
    }
    let that = this;
    getToken().then(function(data) {
      getDay(data).then(function(data) {
        for (let i = 0; i < data.length; i++) {
          data[i].src = "../../static/border.png"
        }
        that.setData({
          time_table: data,
          loadingHidden: true,
        })
      })
    })
    /**
     * 根据某一天请求数据
     */
  },

  //编辑预约时间
  change: function() {
    if (this.data.edit == false) {
      this.setData({
        edit: true,
      })
    } else {
      this.setData({
        edit: false,
      })
    }
  },
  startChange: function() {
    if (getApp().globalData.chosen_id.length == 0) {

    } else {
      wx.redirectTo({
        url: '../dayReserve/step1/step1?month=' + this.data.month + "&day=" + this.data.day + "&year=" + this.data.year,
      })
    }

  },
  contains: function(key) {
    let len = this.data.time_chosen.length;
    let time = this.data.time_chosen;
    for (let i = 0; i < len; i++)
      if (time[i] == key) return true;
    return false;
  },
  //选择预约时间
  addtime: function(event) {
    let chosen_time = event.currentTarget.dataset.time;
    let chosen_id = event.currentTarget.dataset.id;
    let index = event.currentTarget.dataset.index;
    let time = this.data.time_chosen;
    let id = this.data.id_chosen;
    let time_table = this.data.time_table;
    var i = 0;
    for (i = 0; i < time.length; i++) {
      if (time[i] == chosen_time) break;
    }
    if (i < time.length) {

      time.splice(i, 1);
    } else {

      time.push(chosen_time);
    }
    for (let j = 0; i < id.length; i++) {
      if (id[i] == chosen_id) break;
    }
    if (i < id.length) {
      id.splice(i, 1);
      time_table[index].src = "../../static/border.png";
      this.setData({
        time_table: time_table
      })

    } else {
      id.push(chosen_id);
      time_table[index].src = "../../static/tick.png";
      this.setData({
        time_table: time_table
      })
    }
    let a = getApp().globalData.chosen_time;
    getApp().globalData.chosen_time = time;
    getApp().globalData.chosen_id = id;
    a = time;
    if (getApp().globalData.chosen_id.length == 0) {
      this.setData({
        hasChosen: true
      })
    } else {
      this.setData({
        hasChosen: false
      })
    }
  },
  cancelThis: function(event) {
    let id = event.currentTarget.dataset.id;

    this.setData({
      showModal: true,
      cancelID: id
    })

  },
  noCancel: function() {
    this.setData({
      showModal: false,
    })
  },
  confirmCancel: function() {
    let id = this.data.cancelID;

    function getToken() {
      var pro0 = new Promise(function(resolve, reject) {
        wx.getStorage({
          key: 'token',
          success: function(res) {
            let atoken = res.data;
            wx.request({
              url: app.globalData.request_url + 'reservations/' + id,
              method: 'post',
              header: {
                Authorization: "Bearer " + atoken
              },
              success: function(res) {
                resolve(res)
              }
            })
          }
        })
      })
      return pro0;
    }

    getToken().then(function(data) {
      wx.navigateTo({
        url: '../../index/index',
      })
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