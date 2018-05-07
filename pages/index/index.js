//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    //上
    motto: '欢迎来到西安交通大学西迁博物馆预约小程序',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showModal: true,
    next: "继续",
    showModalFirst: true,
    cruDataList: [],
    cruPDataList: [],
    weeklist: ['日', '一', '二', '三', '四', '五', '六'],
    itemIndex: 10,
    day_status: [],
    nextMonth: [],
    nums: 0,
    nextcut: 0,
    atoken: ""
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getGuidance: function () {
    wx.navigateTo({
      url: '../infos/guidance/guidance',
    })
  },
  getInfo: function () {
    wx.navigateTo({
      url: '../infos/instruction/instruction',
    })
  },
  //提示信息弹窗
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  preventTouchMove: function () {
  },
  hideModal: function () {
    this.setData({
      showModal: false
    })
  },
  onCancel: function () {
    this.hideModal();
  },
  onConfirm: function () {
    if (this.data.next == "继续") {
      this.setData({
        next: "确定",
        showModalFirst: false
      });
    } else {
      this.hideModal();
    }
  },
  //预约页面的提示
  dayDetail: function (event) {
    let day = event.target.dataset.id;
    let day_reserve = event.target.dataset.reserve;
    wx.navigateTo({
      url: '../day/dayCheck/dayCheck?reserve=' + day,
    })
    console.log(day_reserve);
  },
  //跳转到某一天的具体信息
  daycheck: function (event) {
    console.log(event)
    let thismonth, thisday, thisid, thisstatus;
    if (event.target.dataset.month == null) {
      thismonth = event.currentTarget.dataset.month;
    } else thismonth = event.target.dataset.month;
    if (event.target.dataset.day == null) {
      thisday = event.currentTarget.dataset.day;
    } else thisday = event.target.dataset.day;
    if (event.target.dataset.id == null) {
      thisid = event.currentTarget.dataset.id;
    } else thisid = event.target.dataset.id;
    if (event.target.dataset.status == null) {
      thisstatus = event.currentTarget.dataset.status;
    } else thisstatus = event.target.dataset.status;
    //如果信息获取失败则不能进入页面
    if (thisstatus != undefined) {
      if (thismonth != undefined) {
        wx.navigateTo({
          url: '../day/dayCheck/dayCheck?day=' + thisday + "&month=" + thismonth + "&id=" + thisid,
        })
      }
    }
  },
  onLoad: function () {
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

    //日历初始化

    var cur_year = new Date().getFullYear();
    var cur_month = new Date().getMonth();
    var cur_day = new Date().getDay() - 1;
    that.setData({
      dataTime: cur_year + "-" + cur_month + "-01"
    });

    that.calendar(cur_year, cur_month);
    //拿到当前的年月，渲染第一次进来小程序的日期数据
    that.setData({
      cur_year,
      cur_month,
    });

    // 初始化获得用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log("获取到信息")
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  calendar: function (year, month, days) {
    this.setData({ loadingStatus: false });
    let fullDay = parseInt(new Date(year, month + 1, 0).getDate()),//当前月总天数
      startWeek = parseInt(new Date(year, month, 1).getDay()),  //当前月第一天周几
      lastMonthDay = parseInt(new Date(year, month, 0).getDate()),
      totalDay = (fullDay + startWeek) % 7 == 0 ? (fullDay + startWeek) : fullDay + startWeek + (7 - (fullDay + startWeek) % 7);//元素总个数
    //年份范围
    let newYearList = [], newMonthList = [], curYear = new Date().getFullYear();
    for (var i = curYear - 10; i < curYear + 10; i++) {
      newYearList.push(i);
    }
    //月份范围
    for (var i = 1; i <= 12; i++) {
      newMonthList.push(i);
    }

    let lastMonthDaysList = [], currentMonthDaysList = [], nextMonthDaysList = [];
    //从后端获取数据
    let day_status;
    let that = this;

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

    function getDate(token) {
      var p = new Promise(function (resolve, reject) {
        wx.request({
          url: 'https://visit.sxxuzhixuan.top/api/days',
          method: 'get',
          header: { Authorization: "Bearer " + token },
          success: function (res) {
            day_status = res.data.data;
            console.log(day_status)
            resolve(day_status);
          }
        });
      });
      return p;
    }

    getToken().then(function (data) {
      getDate(data).then(function (data) {
        let timeData = [];
        //深度复制对象数组引用
        for (let i = 0; i < data.length; i++) {
          timeData.push(JSON.parse(JSON.stringify(data[i])))
        }
        //当前是本月的第几天
        let nextMonth = [];
        var timestamp = Date.parse(new Date());
        var date = new Date(timestamp);
        let Y = date.getFullYear();
        let D = date.getDate();
        let M = date.getMonth();
        let count = 0;
        let n = 0;
        let next = 0;
        let budong = 0;
        var cut = that.data.nums - that.data.nextCut;
        var a = cut;
        // 遍历日历格子
        for (let i = 0; i < totalDay; i++) {
          if (i < startWeek) {

            lastMonthDaysList.push(lastMonthDay - startWeek + 1 + i);
          } else if (i < (startWeek + fullDay)) {

            if ((Y == year) && (M == month)) {

              let m = i + 1 - startWeek;
              //从今天开始渲染
              if ((m >= D) && (month == M)) {
                data[D - 1].day = m;
                data[D - 1].id = timeData[count].id;
                data[D - 1].status = timeData[count].status;
                D++;
                count++;
              } else {
                data[n].day = m;
                data[n].id = undefined;
                data[n].status = undefined;
                n++;
              };
            } else if ((Y == year) && (M == month - 1)) {
              let m = i + 1 - startWeek;
              data[n].day = m;
              if (a < 31) {
                data[n].id = timeData[a].id;
                data[n].status = timeData[a].status;
              } else {
                data[n].id = undefined;
                data[n].status = undefined;
              }
              a++;
              n++;
              //当前月的下一个月
            } else {
              //其他月
              let m = i + 1 - startWeek;
              data[n].day = m;
              data[n].id = undefined;
              data[n].status = undefined;
              n++;
            }
          } else {
            if ((Y == year) && (M == month)) {
              let m = i + 1 - (startWeek + fullDay);
              if (count < 31) {
                let newday = {
                  id: timeData[count].id,
                  status: timeData[count].status,
                  day: m
                }
                nextMonth.push(newday);
                count++;
                next++;
              }
            } else {
              let m = i + 1 - (startWeek + fullDay);
              if (count < 31) {
                let newday = {
                  id: timeData[count].id,
                  day: m
                }
                nextMonth.push(newday);
                count++;
              }
            }
          }
        }
        that.setData({
          monthList: newMonthList,//月份
          yearList: newYearList, //年份范围
          lastMonthDaysList,   //上月总天数
          currentMonthDaysList, //当前月总天数
          nextMonthDaysList,  //下月总天数
          nextMonth,
          day_status: data,
          nums: count,
          nextCut: next
        });
        var tmonth = month + 1;
        that.setData({
          dataTime: year + "-" + tmonth + "-01"
        });
      })
    })

  },

  //选择月
  chooseMonth: function (e) {
    let nowMonth = e.detail.value;
    var chose_month = parseInt(nowMonth) + 1 == 13 ? 1 : parseInt(nowMonth);
    this.setData({
      cur_month: chose_month,
    });
    this.calendar(this.data.cur_year, this.data.cur_month)
  },

  //选择年
  chooseYear: function (e) {
    var idx = e.detail.value;
    var y = this.data.yearList[idx];
    this.setData({
      itemIndex: idx,
      cur_year: y,
    });
    this.calendar(y, this.data.cur_month);

  },

  //操作月
  handleMonth: function (e) {
    let nowyear = new Date().getFullYear();
    let nowmonth = new Date().getMonth();
    let days = this.data.day_status;
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    const index = this.data.itemIndex;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      let idx = index;
      if (newMonth < 0) {
        newYear = cur_year - 1;
        idx = index - 1;
        newMonth = 11;
      }

      this.calendar(newYear, newMonth);
      this.setData({
        cur_year: newYear,
        cur_month: newMonth,
        itemIndex: idx
      });

    } else {

      let newMonth = cur_month + 1;
      let newYear = cur_year;
      let idx = index;
      if (newMonth > 11) {
        newYear = cur_year + 1;
        idx = index + 1;
        newMonth = 0;
      }

      if ((nowyear == cur_year) && (nowmonth == cur_month)) {
        this.calendar(newYear, newMonth, days);
      } else {
        this.calendar(newYear, newMonth);
      }

      this.setData({
        cur_year: newYear,
        cur_month: newMonth,
        itemIndex: idx
      });
    }
  },
  onShow: function () {
    //日历初始化
    var that = this;
    var cur_year = new Date().getFullYear();
    var cur_month = new Date().getMonth();
    var cur_day = new Date().getDay() - 1;
    that.setData({
      dataTime: cur_year + "-" + cur_month + "-01"
    });

    that.calendar(cur_year, cur_month);
    //拿到当前的年月，渲染第一次进来小程序的日期数据
    that.setData({
      cur_year,
      cur_month,
    });
  }
})