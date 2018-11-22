// pages/BusinessCard/InformationFilling/InformationFilling.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showView: false,
    cardType: null,  //存储新建的名片的类型，  0 为普通  1 为华夏
    num: null,   //工号
    disabled: false,
    template_id: '',  //存储模板id
    tempBomImg: 'http://pcwebtest.ihxlife.com/website/image_x/TemplateBG.png',  //模板底图
    name: '',
    mobile: '',
    company: '',
    position: '',
    email: '',
    self_introduce: '',
    avatarUrl: '',
    card_id: '',
    cardState: '',
    hiddenmodalput: true,
    imgShow: true,
    templateImgSrc: '',
    templateTitle: '',
    templateText: [],
    mobileFocus: false
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
    //获取页面url传递过来的cardType值
    var length = getCurrentPages().length,
      cardType = getCurrentPages()[length - 1].options.cardType,
      num = getCurrentPages()[length - 1].options.num; //工号
    console.log(cardType)
    self.setData({
      num: num,
      cardType: cardType
    })
    //获取本地存储cardState 判断名片是否是新建还是编辑
    wx.getStorage({
      key: 'cardState',
      success: function (res) {
        self.setData({
          cardState: res.data
        })
        if (res.data && res.data == 1) {
          wx.getStorage({
            key: 'userInfo',
            success: function (res) {
              self.setData({
                name: res.data.name,
                mobile: res.data.mobile,
                company: res.data.company,
                position: res.data.position,
                email: res.data.email,
                self_introduce: res.data.self_introduce,
                template_id: res.data.template_id,
                card_id: res.data.card_id,
                tempBomImg: res.data.template_src,
                isCollect: res.data.isCollect,
                userInfo: res.data,
                disabled: cardType === 'HX' ? true : false
              })
            },
          })
        } else if (cardType == 'HX') {
          console.log(num)
          self.searchHxInfo(num)
        }
      },
    })
    self.SearchTemplate()
    self.headImg()
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
   * 查询华夏员工信息
   */
  searchHxInfo: function (num) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: getApp().globalData.urlData + 'queryUserByid.do',
      data: {
        userid: num
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        if (res.data && res.data.msg) {
          wx.hideLoading()
          var userInfo = JSON.parse(res.data.msg).body.agent_info[0];
          that.setData({
            userInfo: userInfo,
            name: userInfo.name,
            mobile: userInfo.mobile,
            company: userInfo.manage_name2,
            disabled: true
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  /**
   * 获取用户姓名
   */
  nameInput: function (e) {
    var that = this;
    console.log(e.detail.value)
    that.setData({
      name: e.detail.value,
      self_introduce: that.data.self_introduce
    })
  },
  /**
   * 获取用户联系方式
   */
  mobileInput: function (e) {
    var that = this;
    that.setData({
      mobile: e.detail.value,
      self_introduce: that.data.self_introduce
    })
  },
  /**
   * 获取用户公司
   */
  companyInput: function (e) {
    var that = this;
    that.setData({
      company: e.detail.value,
      self_introduce: that.data.self_introduce
    })
  },
  /**
   * 获取用户职业
   */
  positionInput: function (e) {
    var that = this;
    that.setData({
      position: e.detail.value,
      self_introduce: that.data.self_introduce
    })
  },
  /**
   * 获取用户邮箱
   */
  emailInput: function (e) {
    var that = this;
    that.setData({
      email: e.detail.value,
      self_introduce: that.data.self_introduce
    })
  },
  /**
   * 获取用户自我介绍
   */
  selfIntroInput: function (e) {
    var that = this;
    that.setData({
      self_introduce: e.detail.value
    })
  },
  /**
   * 模板查询
   */
  SearchTemplate: function () {
    var self = this;
    wx.request({
      url: getApp().globalData.urlData + 'queryTemplate.do',
      data: {
        'openid': getApp().globalData.openid
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        if (res.data && res.data.result === 'success') {
          console.log(res.data.templateLis)
          self.setData({
            templateText: res.data.templateLis
          })
        }
      },
      fail: function () {
      }
    })
  },
  /**
   * 选择模板
   */
  CloseTemplate: function (e) {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  /**
   * 增加模板
   */
  TemplateAdd: function () {
    var that = this;
    that.addImg()

  },
  /**
   * 上传模板图片
   */
  addImg: function (e) {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0];
        console.log(tempFilePaths)
        that.submitTempalte(tempFilePaths)
        that.setData({
          templateImgSrc: tempFilePaths,
          imgShow: false
        })
      }
    })
  },
  /**
   * 提交模板数据
   */
  submitTempalte: function (data) {
    var that = this;
    wx.showLoading({
      title: '模板提交中',
      mask: true
    })
    wx.uploadFile({
      url: getApp().globalData.urlData + 'addTemplate.do',
      filePath: data,
      name: 'image',
      method: "POST",
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData:
      {
        openid: 'openid:' + getApp().globalData.openid,
        template_type: 'template_type:' + that.data.cardType,
        template_name: 'template_name:' + encodeURI('模板') + (that.data.templateText.length + 1)
      },
      success: function (res) {
        var templateInfo = JSON.parse(res.data)
        var templateList = that.data.templateText
        if (templateInfo.result === 'success') {
          wx.hideLoading()
          templateList.push({
            template_id: templateInfo.template_id,
            template_name: '模板' + (that.data.templateText.length + 1),
            template_openid: getApp().globalData.openid,
            template_src: that.data.templateImgSrc,
            template_type: that.data.cardType
          })
          wx.showToast({
            title: '模板上传成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            hiddenmodalput: true,
            templateText: templateList
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '模板上传失败',
            icon: 'cancel',
            duration: 2000
          })
          that.setData({
            hiddenmodalput: true
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '模板上传失败',
          icon: 'cancel',
          duration: 2000
        })
        that.setData({
          hiddenmodalput: true
        })
      }
    })
  },
  /**
   * 点击选择模板中的确认按钮
   */
  TemplateClose: function (e) {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  /**
   * 点击选择模板中的选中状态
   */
  radioChange: function (e) {
    var that = this,
      imgSrc = null;
    that.data.templateText.forEach((v, i) => {
      if (v.template_id === e.detail.value) {
        imgSrc = v.template_src
      }
    })
    that.setData({
      template_id: e.detail.value,
      tempBomImg: imgSrc
    })
  },
  /**
   * 点击选择模板中的确认按钮
   */
  confirm: function (e) {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  /**
   * 信息验证
   */
  validation: function (e) {
    var that = this;
    var keyword = ['华夏保险', '华夏人寿', '华夏人寿保险', '崋夏保险', '崋夏人寿', '崋夏人寿保险', '华夏保険', '华夏人寿保険', '崋夏保険', '崋夏人寿保険']
    if (!that.data.name) {
      wx.showModal({
        title: '消息提示框',
        content: '请填写姓名',
      })
      return;
    } else if (that.data.name && !(/^[a-zA-Z\u4e00-\u9fa5]+$/.test('' + that.data.name))) {
      wx.showModal({
        title: '消息提示框',
        content: '姓名只能输入中文和英文',
      })
      return
    }
    if (!that.data.mobile) {
      wx.showModal({
        title: '消息提示框',
        content: '请填写联系电话'
      })
      return;
    } else if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(that.data.mobile))) {
      wx.showModal({
        title: '消息提示框',
        content: '填写的电话格式不正确，请重新填写',
      })
      return;
    }
    var company = that.data.company.replace(/[^0-9a-zA-Z\u4e00-\u9fa5]/g, '');
    if (!that.data.company) {
      wx.showModal({
        title: '消息提示框',
        content: '请填写公司名称',
      })
      return;
    }
    if (that.data.cardType === 'ordinary' && ((company.toString().indexOf('华夏保险') !== -1) || (company.toString().indexOf('华夏人寿') !== -1) || (company.toString().indexOf('华夏人寿保险') !== -1) || (company.toString().indexOf('崋夏保险') !== -1) || (company.toString().indexOf('崋夏人寿') !== -1) || (company.toString().indexOf('崋夏人寿保险') !== -1) || (company.toString().indexOf('华夏保険') !== -1) || (company.toString().indexOf('华夏人寿保険') !== -1) || (company.toString().indexOf('崋夏保険') !== -1) || (company.toString().indexOf('崋夏人寿保険') !== -1))) {
      wx.showModal({
        title: '消息提示框',
        content: '普通名片公司名不可输入“华夏保险”或者“华夏人寿”或者“华夏人寿保险”等敏感字!',
      })
      return;
    }
    if (that.data.email && !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(that.data.email)) {
      wx.showModal({
        title: '消息提示框',
        content: '输入的邮箱格式不正确',
      })
      return;
    }
    if (!that.data.template_id) {
      wx.showModal({
        title: '消息提示框',
        content: '请选择名片模板！',
      })
      return;
    }
    if (that.data.cardState == 0) {
      that.saveCard()
    } else if (that.data.cardState == 1) {
      that.updateCard()
    }
    //修改名片状态
    wx.setStorage({
      key: 'cardState',  //保存一个名片状态 0 新名片 1 编辑名片
      data: 0,
    })
  },
  /**
   * 点击提交按钮
   */
  submit: function (e) {
    var that = this
    that.validation();
  },
  /**
   * 保存名片的信息
   */
  saveUserInfo: function (id) {
    var self = this;
    wx.setStorage({
      key: 'userInfo',
      data: {
        name: self.data.name,
        mobile: self.data.mobile,
        company: self.data.company,
        card_id: id,
        position: self.data.position,
        email: self.data.email,
        self_introduce: self.data.self_introduce,
        cardType: self.data.cardType,
        card_department: '',
        userid: self.data.num,
        template_id: self.data.template_id,
        template_src: self.data.tempBomImg,
        selfCard: true,
        isCollect: self.data.isCollect,
        wx_headimg: self.data.avatarUrl
      },
    })
  },
  /**
   * 获取头像
   */
  headImg: function () {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var avatarUrl = userInfo.avatarUrl
        getApp().globalData.avatarUrl = avatarUrl;
        that.setData({
          avatarUrl: avatarUrl
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  /**
   * 生成名片
  */
  saveCard: function () {
    var that = this;
    that.setData({
      disabled1: true
    })
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    wx.request({
      url: getApp().globalData.urlData + 'saveCard.do',
      data: {
        cardInfo: {
          "wx_headimg": that.data.avatarUrl,
          "card_tel": that.data.mobile,
          "card_post": that.data.position,
          "userid": that.data.cardType === 'HX' ? getApp().globalData.userid : '',  //业务员工号
          "card_name": that.data.name,
          "card_email": that.data.email,
          "card_company": that.data.company,
          "template_id": that.data.template_id,
          "card_type": that.data.cardType,
          "openid": getApp().globalData.openid,
          "card_department": "",
          "self_introduce": that.data.self_introduce
        }
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.result === 'success') {
          that.setData({
            card_id: res.data.msg
          })
          that.saveUserInfo(res.data.msg)
          wx.navigateTo({
            url: '../HaveCard/HaveCard?openid=' + getApp().globalData.openid + '&card_id=' + res.data.msg + '&selfCard=' + true,
          })
        }
      },
      fail: function () {
        wx.hideLoading()
        wx.showModal({
          title: '提示框',
          content: '名片创建失败，请稍后重试',
        })
        that.setData({
          disabled1: false
        })
      }
    })
  },
  /**
   * 编辑名片
   */
  updateCard: function () {
    var that = this;
    that.setData({
      disabled1: true
    })
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    var cardInfo = {
      "wx_headimg": that.data.avatarUrl,
      "card_tel": that.data.mobile,
      "card_post": that.data.position,
      "userid": that.data.cardType == 'HX' ? that.data.num : '',  //业务员工号
      "card_name": that.data.name,
      "card_email": that.data.email,
      "card_company": that.data.company,
      "template_id": that.data.template_id,
      "card_type": that.data.cardType,
      "openid": getApp().globalData.openid,
      "card_department": "",
      "card_id": that.data.card_id,
      "self_introduce": that.data.self_introduce
    }
    console.log(cardInfo)
    wx.request({
      url: getApp().globalData.urlData + 'updateCard.do',
      data: {
        cardInfo
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.result === 'success') {
          wx.navigateTo({
            url: '../HaveCard/HaveCard?openid=' + getApp().globalData.openid + '&card_id=' + that.data.card_id + '&selfCard=' + true,
          })
        } else {
          that.setData({
            disabled1: false
          })
          wx: wx.showModal({
            title: '消息提示框',
            content: '编辑名片失败，请稍后重试',
          })
          return;
        }
      },
      fail: function () {
        wx.hideLoading()
        wx: wx.showModal({
          title: '消息提示框',
          content: '编辑名片失败，请稍后重试',
        })
        that.setData({
          disabled1: false
        })
        return;
      }
    })
  },
  /**
   * 点击编辑图标，input自动获取焦点
   */
  ediorPhone: function () {
    var that = this;
    that.setData({
      mobileFocus: true
    })
  },
})