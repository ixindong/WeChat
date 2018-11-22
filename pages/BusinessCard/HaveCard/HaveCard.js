// pages/BusinessCard/HaveCard/HaveCard.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selected: true,
    selected1: false,
    selected2: false,
    isCollect: '点击收藏名片',
    selfCard: false,
    tempBomImg: 'http://pcwebtest.ihxlife.com/website/image_x/CardBanner1.jpeg',
    name: '',
    mobile: '',
    company: '',
    position: '',
    email: '',
    self_introduce: '',
    productList: [
      {
        title: '常青树全能版',
        desc1: '150种疾病保障， 80岁领取祝寿金',
        desc2: '轻症3次赔付，不占重疾保额',
        desc3: '百万医疗保驾护航，重疾绿通就医不愁',
        classStr: 'green',
        imgSrc: 'http://hx-third.oss-cn-hangzhou.aliyuncs.com/polysoft/1513735928945.png',
        types: '健康险'
      },
      {
        title: '常青树2016',
        desc1: '110种疾病保障，保障直至终身',
        desc2: '轻症5次赔付，未成年特别关爱',
        desc3: '百万医疗保驾护航，重疾绿通就医不愁',
        classStr: 'green',
        imgSrc: 'http://hx-third.oss-cn-hangzhou.aliyuncs.com/polysoft/1513735940746.png',
        types: '健康险'
      },
      {
        title: '福临门吉祥版',
        desc1: '固定年金终身给付',
        desc2: '80周岁返已交保费',
        desc3: '身故全残全面保障',
        classStr: 'yellow',
        imgSrc: 'http://hx-third.oss-cn-hangzhou.aliyuncs.com/polysoft/1513735956240.png',
        types: '理财险'
      },
      {
        title: '医保通',
        desc1: '终身500万限额，年度最高200万',
        desc2: '住院/特殊门诊医疗费用统统报销',
        desc3: '续保无忧，一生呵护',
        classStr: 'green',
        imgSrc: '../../image/hotProduct4.png',
        types: '健康险'
      }
    ]
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
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    var card_id = getCurrentPages()[getCurrentPages().length - 1].options.card_id;
    var selfard = getCurrentPages()[getCurrentPages().length - 1].options.selfCard;
    var openid = getCurrentPages()[getCurrentPages().length - 1].options.openid;
    if (getApp().globalData.openid === '') {
      self.login(selfard, card_id)
    } else {
      self.GetCardInfo(selfard, card_id, getApp().globalData.openid);
    }
    self.getcompandInfo()
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
    var that = this;
    return {
      title: '这是我的名片，请惠存',
      path: '/pages/BusinessCard/HaveCard/HaveCard?openid=' + getApp().globalData.openid + '&card_id=' + that.data.card_id + '&selfCard=' + false
    }
  },
  /**
   * 获取名片信息
   */
  GetCardInfo: function (selfCard, card_id, openid) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    wx.request({
      url: getApp().globalData.urlData + 'queryCard.do',
      data: {
        openid: openid,
        queryType: card_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.result === 'success' && res.data.cardLis.length > 0) {
          var cardInfo = res.data.cardLis[0];
          that.setData({
            name: cardInfo.card_name,
            mobile: cardInfo.card_tel,
            company: cardInfo.card_company,
            position: cardInfo.card_post,
            email: cardInfo.card_email,
            template_id: cardInfo.template_id,
            selfCard: selfCard === 'false' ? false : true,
            self_introduce: cardInfo.self_introduce,
            cardType: cardInfo.card_type,
            userid: cardInfo.userid,
            card_id: cardInfo.card_id,
            tempBomImg: cardInfo.template_src,
            isCollect: cardInfo.isCollect === '0' ? '点击收藏名片' : '已收藏该名片',
            headImg: cardInfo.wx_headimg
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showModal({
          title: '提示框',
          content: '数据加载异常，请稍后重试',
        })
      }
    })
  },

  /**
     * 保存名片的信息
     */
  saveUserInfo: function () {
    var self = this;
    wx.setStorage({
      key: 'userInfo',
      data: {
        name: self.data.name,
        mobile: self.data.mobile,
        company: self.data.company,
        card_id: self.data.card_id,
        position: self.data.position,
        email: self.data.email,
        self_introduce: self.data.self_introduce,
        cardType: self.data.cardType,
        hidden: self.data.cardType === 'ordinary' ? true : false,
        card_department: '',
        userid: self.data.userid,
        template_id: self.data.template_id,
        template_src: self.data.tempBomImg,
        wx_headimg: self.data.avatarUrl
      },
    })
  },

  selected: function (e) {
    this.setData({
      selected1: false,
      selected2: false,
      selected: true
    })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected2: false,
      selected1: true
    })
  },
  selected2: function (e) {
    this.setData({
      selected1: false,
      selected: false,
      selected2: true
    })
  },
  /**
   * 编辑名片
   */
  editCard: function () {
    var that = this;
    wx.setStorage({
      key: 'cardState',  //保存一个名片状态 0 新名片 1 编辑名片
      data: 1,
    })
    that.saveUserInfo()
    wx.navigateTo({
      url: '../InformationFilling/InformationFilling?cardType=' + that.data.cardType + '&num=' + that.data.userid
    })
  },

  /**
   * 收藏功能
   */
  collectTop: function () {
    var that = this;
    if (that.data.isCollect === '点击收藏名片') {
      that.collectFunc()
    } else {
      wx.showModal({
        title: '消息提示框',
        content: '是否取消对该名片的收藏？',
        success: function (res) {
          console.log(res)
          if (res.confirm === true) {
            that.collectFunc()
          }
        },
        fail: function (res) { },
      })
    }
  },
  /**
   * 收藏方法
   */
  collectFunc: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.urlData + 'collect.do',
      data: {
        "openid": getApp().globalData.openid,
        "cardid": that.data.card_id,
        "type": that.data.isCollect === '点击收藏名片' ? 'collect' : 'del_collect'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "GET",
      dataType: "json",
      success: function (res) {
        console.log(res)
        if (res.data.result === 'success') {
          that.setData({
            isCollect: that.data.isCollect === '点击收藏名片' ? '已收藏该名片' : '点击收藏名片'
          })
        } else {
          wx.showToast({
            title: '收藏失败',
            icon: 'warn',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '收藏失败',
          icon: 'warn',
          duration: 2000
        })
      }
    })
  },
  /**
   * 拨打电话
   */
  takePhone: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.mobile //仅为示例，并非真实的电话号码
    })
  },
  /**
   * 创建名片
   */
  createCard: function () {
    wx.setStorage({
      key: 'cardState',  //保存一个名片状态 0 新名片 1 编辑名片
      data: 0,
    })
    wx: wx.redirectTo({
      url: '../BusinessCardIndex/BusinessCardIndex',
    })
  },
  login: function (selfard, card_id) {
    var that = this;
    wx.login({
      success: function (res) {
        getApp().globalData.js_code = res.code;
        that.openID(res.code, selfard, card_id)
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.userInfo']) {
              wx.authorize({
                scope: 'scope.userInfo',
                success() {
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
  openID: function (code, selfard, card_id) {
    var that = this;
    //获取openid
    wx.request({
      url: getApp().globalData.urlData + 'getOpenid.do',
      data: {
        js_code: code,
        secret: getApp().globalData.AppSecret
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        getApp().globalData.openid = res.data.openid
        console.log(res.data.openid)
        that.GetCardInfo(selfard, card_id, res.data.openid)
      }
    })
  },
  /**
   * 请求公司信息
   */
  getcompandInfo: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.urlData + 'queryCompanyProfile.do',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        if (res.data.result === 'success' && res.data.msg !== '') {
          that.setData({
            companyInfo: res.data.msg.split(/\n/g)[1],
            enterprise: res.data.msg.split(/\n/g)[3],
            product: res.data.msg.split(/\n/g)[5],
            publicWelfare: res.data.msg.split(/\n/g)[7]
          })
        }
      },
      fail: function (res) {
      }
    })
  }
})