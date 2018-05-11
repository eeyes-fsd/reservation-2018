// pages/day/dayCheck/dayCheck.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    month:0,
    day:0,
    time_table:[],
    edit:false,
    time_chosen:[],
    id_chosen:[],
    hasChosen:true,
    picSrc:"../../static/border.png",
    showModal: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    
    let thismonth = option.month;
    let thisday = option.day;

    this.setData({
      month:thismonth,
      day:thisday
    })
    //发送请求获得json数据
    function getToken() {
      var p = new Promise(function (resolve, reject) {
        wx.getStorage({
          key: 'token',
          success: function (res) {
            let atoken = res.data;
            resolve(atoken)
          }
        })
      })
      return p;
    }

    function getDay(token){
      var p = new Promise(function (resolve, reject) {
        let thisid = option.id;
        wx.request({
          url: 'https://visit.sxxuzhixuan.top/api/days/'+thisid,
          method: 'get',
          header: { Authorization: "Bearer " + token },
          success: function (res) {
            let time = res.data.data;
            console.log(res)
            resolve(time);
          }
        });
      });
      return p;
    }
    let that = this;
    getToken().then(function(data){
      console.log(data)
      getDay(data).then(function(data){
        console.log(data)
        for (let i = 0; i < data.length; i++) {
          data[i].begin_at = data[i].begin_at.slice(0, 5);
          data[i].src = "../../static/border.png"
        }
        that.setData({
          time_table: data
        })
      })
    })
    /**
     * 根据某一天请求数据
     */
    console.log(option)
  },

  //编辑预约时间
  change: function(){
    if(this.data.edit == false){
      this.setData({
        edit: true,
      })
    }else{
      this.setData({
        edit: false,
      })
    }
  },
  startChange: function(){
    if(getApp().globalData.chosen_id.length==0){
      console.log("请选择")
    }else{
      wx.redirectTo({
        url: '../dayReserve/step1/step1?month=' + this.data.month + "&day=" + this.data.day,
      })
    }
    
  },
  contains: function (key) {
    let len = this.data.time_chosen.length;
    let time = this.data.time_chosen;
    for (let i = 0; i < len; i++)
      if (time[i] == key) return true;
    return false;
  },
  //选择预约时间
  addtime: function(event){
    console.log(event)
    let chosen_time = event.currentTarget.dataset.time;
    let chosen_id = event.currentTarget.dataset.id;
    let index = event.currentTarget.dataset.index;
    let time = this.data.time_chosen;
    let id = this.data.id_chosen;
    let time_table = this.data.time_table;
    var i=0;
    for(i=0;i<time.length;i++){
      if(time[i]==chosen_time) break;
    }
    if(i<time.length){
      console.log("存在");
      time.splice(i,1);
    }else{
      console.log("不存在");
      time.push(chosen_time)
    }
    for (let j = 0; i < id.length; i++) {
      if (id[i] == chosen_id) break;
    }
    if (i < id.length) {
      console.log("存在");
      id.splice(i, 1);
      time_table[index].src = "../../static/border.png";
      this.setData({
        time_table:time_table
      })
      
    } else {
      console.log("不存在");
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
    console.log(getApp().globalData.chosen_time);
    console.log(getApp().globalData.chosen_id);
    console.log(i);
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
  cancelThis:function(event){
    let id = event.currentTarget.dataset.id;
    this.setData({
      showModal:true,
      cancelID:id
    })
    console.log(id)
  },
  noCancel:function(){
    this.setData({
      showMoal: false
    })
  },
  confirmCancel:function(){
    let id = this.data.cancelID;
    console.log(id)
    function getToken(){
      var pro0 = new Promise(function (resolve, reject) {
        wx.getStorage({
          key: 'token',
          success: function (res) {
            let atoken = res.data;
            wx.request({
              url: 'https://visit.sxxuzhixuan.top/api/cancel/' + id,
              method:'post',
              header: { Authorization: "Bearer " + atoken },
              success:function(res){
                console.log(res)
                resolve(res)
              }
            })
          }
        })
      })
      return pro0;
    }
    
  getToken().then(function(data){
    console.log(data)
    wx.navigateTo({
      url: '../../index/index',
    })
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