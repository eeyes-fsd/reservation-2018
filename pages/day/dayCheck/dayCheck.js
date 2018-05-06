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
    hasChosen:true
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
    function getDay(){
      var p = new Promise(function (resolve, reject) {
        let thisid = option.id;
        wx.request({
          url: 'https://visit.sxxuzhixuan.top/api/days/'+thisid,
          method: 'get',
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
    getDay().then(function(data){
      for(let i=0;i<data.length;i++){
        data[i].begin_at = data[i].begin_at.slice(0,5)
      }
      that.setData({
        time_table:data
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
      wx.navigateTo({
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
    
    let chosen_time = event.currentTarget.dataset.time;
    let chosen_id = event.currentTarget.dataset.id;
    let time = this.data.time_chosen;
    let id = this.data.id_chosen;
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
    } else {
      console.log("不存在");
      id.push(chosen_id)
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