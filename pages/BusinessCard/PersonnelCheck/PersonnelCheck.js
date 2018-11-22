// pages/BusinessCard/PersonnelCheck/PersonnelCheck.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: '',
    ErrorShow: false,
    avatarUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        getApp().globalData.avatarUrl = avatarUrl;
        that.setData({
          avatarUrl: avatarUrl
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

  },
  /**
   * 获取用户输入的工号
   */
  userIdInput: function(e){
    var self = this;
    self.setData({
      userid : e.detail.value
    })
  },
  /**
   * 根据工号查询信息
   */
  requestNum: function(){
    var self = this;
    if(!self.data.userid){
      wx.showModal({
        title: '消息提示框',
        content: '请填写员工工号!',
      })
      return;
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: getApp().globalData.urlData + 'queryUserByid.do', 
      data: {
        userid: self.data.userid
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        wx.hideLoading()
        var userInfo = JSON.parse(res.data.msg)
        if (userInfo.body.agent_info.length > 0){
          getApp().globalData.userid = self.data.userid;
          wx.setStorage({
            key: 'cardState',  //保存一个名片状态 0 新名片 1 编辑名片
            data: 0,
          })
          wx.navigateTo({
            url: "../InformationFilling/InformationFilling?cardType=HX&num=" + self.data.userid
          })
        }else{
          self.setData({
            ErrorShow: true
          })
        }
      },
      fail: function(){
        wx.hideLoading()
        self.setData({
          ErrorShow: true
        })
      }
    })
  },

  /**
   * 确认提交
   */
  submit: function(){
    this.requestNum()
  }
})