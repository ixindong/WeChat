//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    imgs:"http://pcwebtest.ihxlife.com/website/image_x/indexBg.png",
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  onLoad: function () {
    var that = this;
    wx.login({
      success: function (res) {
        console.log(res)
        getApp().globalData.js_code = res.code;
        that.openID()
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.userInfo']) {
              wx.authorize({
                scope: 'scope.userInfo',
                success(){
                  // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                  console.log('已经授权成功用户信息')
                }
              })
            }
          }
        });
      }
    })
  },
  BusinessCard: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../BusinessCard/BusinessCardIndex/BusinessCardIndex'
    })
  },
  // 获取openid
  openID: function () {
    //获取openid
    wx.request({
      url: getApp().globalData.urlData + 'getOpenid.do',
      data: {
        js_code: getApp().globalData.js_code,
        secret: getApp().globalData.AppSecret
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        getApp().globalData.openid = res.data.openid
        console.log(res.data.openid)
        if(res.data.result === 'success'){
        }
      }
    })
  },
})
