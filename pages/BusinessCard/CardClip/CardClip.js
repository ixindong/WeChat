// pages/CardClip/CardClip.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    cardList: [],
    oldList: [],
    cardSelect:'',
    phoneNumber: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.userInfo();
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
    var that = this;
    that.getCardData()
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
   * 获取头像
   */
  userInfo: function () {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var avatarUrl = userInfo.avatarUrl
        getApp().globalData.avatarUrl = avatarUrl;
        that.setData({
          avatarUrl: getApp().globalData.avatarUrl
        })
      }
    })
  },
  /**
   * 获取名片夹数据
   */
  getCardData: function () {
    var self = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: getApp().globalData.urlData + 'queryCard.do',
      data: {
        openid: getApp().globalData.openid,
        queryType: 'collect'
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data && res.data.result === 'success' && res.data.cardLis.length > 0) {
          console.log(res.data.cardLis)
          self.setData({
            cardList: res.data.cardLis,
            oldList: res.data.cardLis
          })
        }
      },
      fail: function () {
        wx.hideLoading()
        wx.showModal({
          title: '提示框',
          content: '名片加载失败',
        })
      }
    })
  },

  playPhone: function (e) {
    let phoneNumberText = e.currentTarget.dataset.text;
    wx.makePhoneCall({
      phoneNumber: phoneNumberText
    })
  },
  /**
   * 用户输入姓名或者公司名进行名片的查询
   */
  inputValue: function (e) {
    var that = this,
        EleArr = [],
        oldArr = that.data.oldList;
    const length = that.data.cardList.length;
    // 判断是否有名片，如果有就查询，没有就不查询
    if (length > 0) {
      // 循环名片数组
      for (var i = 0; i < length; i++) {
        var cur = that.data.cardList[i];
        //查找姓名或者公司名匹配的数组，加入到数组EleArr中
        if (cur.card_name.indexOf(e.detail.value) != -1 || cur.card_company.indexOf(e.detail.value) != -1){
          EleArr.push(cur)
        }
      }
    }
    console.log(EleArr)
    if(EleArr.length>0){
      that.setData({
        cardList: EleArr
      })
    }else {
      wx.showToast({
        title: '没有符合找到的内容！',
        icon: 'success',
        duration: 2000
      })
      that.setData({
        cardList: oldArr
      })
    }
    if (e.detail.value == ''){
      that.setData({
        cardList: oldArr
      })
    }
  },
  /**
   * 名片详情
   */
  cardDetail: function (e) {
    var that = this;
    var cardInfo = e.target.dataset.index;
    wx.setStorage({
      key: 'cardState',
      data: 1,
    })
    wx.redirectTo({
      url: '../HaveCard/HaveCard?openid=' + cardInfo.openid +'&card_id=' + cardInfo.card_id + '&selfCard=' + false
    })
  }
})