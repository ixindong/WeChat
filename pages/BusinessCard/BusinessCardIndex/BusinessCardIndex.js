// pages/BusinessCard/BusinessCardIndex.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hxCartList: [],
    ordinaryCartList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.GetCard()
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
   * 创建华夏名片
   */
  HXNewCart: function (e) {
    wx.setStorage({
      key: 'cardState',  //保存一个名片状态 0 新名片 1 编辑名片
      data: 0,
    })
    wx.redirectTo({
      url: '../PersonnelCheck/PersonnelCheck'
    })
  },
  /**
   * 创建普通名片
   */
  ordinaryNewCart: function (e) {
    wx.setStorage({
      key: 'cardState',  //保存一个名片状态 0 新名片 1 编辑名片
      data: 0,
    })
    wx.navigateTo({
      url: "../InformationFilling/InformationFilling?cardType=ordinary&num=null"
    })
  },
  /**
   * 获取名片
   */
  GetCard: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: getApp().globalData.urlData + 'queryCard.do', //仅为示例，并非真实的接口地址
      data: {
        openid: getApp().globalData.openid,
        queryType: 'self'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
        console.log(getApp().globalData.openid)
        if (getApp().globalData.openid === '') {
          wx.showModal({
            title: '警告框',
            content: '网络加载异常，请稍后重试'
          })
        }
        if (res.data && res.data.result === 'success' && res.data.cardLis.length != 0) {
          var cardList = res.data.cardLis,
            ordinaryList = [],
            HXList = [];
          for (var i = 0; i < cardList.length; i++) {
            let curCard = cardList[i]
            if (curCard.card_type === 'ordinary') {
              ordinaryList.push(curCard)
            } else {
              HXList.push(curCard)
            }
          }
          that.setData({
            hxCartList: HXList.length == 0 ? [] : new Array(HXList[HXList.length-1]),
            ordinaryCartList: ordinaryList.length == 0 ? [] : new Array(ordinaryList[ordinaryList.length - 1]),
          })
        }
      },
      fail: function(){
        wx.hideLoading()
        wx.showModal({
          title: '提示框',
          content: '数据加载失败，请稍后重试',
        })
      }
    })
  },
  /**
   * 进入名片夹页面
   */
  collectCard: function (e) {
    wx.navigateTo({
      url: '../CardClip/CardClip',
    })
  },
  /**
   * 进入名片详情
   */
  cardDetail: function(e){
    var that=this;
    var cardInfo = e.currentTarget.dataset.item;
    wx.setStorage({
      key: 'cardState',
      data: 1,
    })
    wx.navigateTo({
      url: '../HaveCard/HaveCard?openid=' + cardInfo.openid + '&card_id=' + cardInfo.card_id + '&selfCard=' + true
    })
  },
  /**
   * 编辑名片详情
   */
  editorDetail: function (e) {
    var that = this;
    var cardType = e.currentTarget.dataset.type;
    if (cardType === 'HX'){
      var cardInfo = that.data.hxCartList[0]
    }else{
      var cardInfo = that.data.ordinaryCartList[0]
    }
    that.saveCardInfo(cardInfo)
    wx.setStorage({
      key: 'cardState',
      data: 1,
    })
    wx.navigateTo({
      url: '../InformationFilling/InformationFilling?cardType=' + cardInfo.card_type + '&num=' + cardInfo.userid,
    })
  },
  /**
   * 保存名片数据
   */
  saveCardInfo: function (cardInfo){
    wx.setStorage({
      key: 'userInfo',
      data: {
        name: cardInfo.card_name,
        mobile: cardInfo.card_tel,
        company: cardInfo.card_company,
        position: cardInfo.card_post,
        email: cardInfo.card_email,
        self_introduce: cardInfo.self_introduce,
        template_id: cardInfo.template_id,
        card_id: cardInfo.card_id,
        card_type: cardInfo.card_type,
        openid: cardInfo.openid,
        userid: cardInfo.userid,
        wx_headimg: cardInfo.wx_headimg,
        template_src: cardInfo.template_src,
        isCollect: cardInfo.isCollect,
        selfCard: true
      },
    })
  },
  /**
   * 点击页面电话，拨打电话
   */
  playPhone: function (e) {
    let phoneNumberText = e.currentTarget.dataset.text;
    wx.makePhoneCall({
      phoneNumber: phoneNumberText
    })
  }
})