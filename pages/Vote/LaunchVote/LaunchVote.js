// pages/Vote/LaunchVote/LaunchVote.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    time: '',
    index: 0,
    selected: true,
    selected1: false,
    selected2: true,
    selected3: false,
    describe: '',
    templateText: [{
      SrcIcon: 'http://pcwebtest.ihxlife.com/website/image_x/reduce.png',
      NumText: 1,
      text: '添加图片'
    },
    {
      SrcIcon: 'http://pcwebtest.ihxlife.com/website/image_x/reduce.png',
      NumText: 2,
      text: '添加图片'
    }
    ],
    lists: [],
    imgLists: [],
    arrImg: []
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
    var that = this;
    that.userInfo()
    var formData = require('../../../utils/util.js'),
      myDate = new Date(),
      hours = myDate.getHours(),
      minu = myDate.getMinutes();
    that.setData({
      date: that.fun_date(),
      time: '23:59',
      startTime: hours + ':' + minu
    })

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
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true
    })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true
    })
  },
  selected2: function (e) {
    this.setData({
      selected3: false,
      selected2: true
    })
  },
  selected3: function (e) {
    this.setData({
      selected2: false,
      selected3: true
    })
  },
  reduce: function (e) {
    let that = this;
    let options = that.data.templateText;
    let optionText = that.data.lists;
    let index = e.currentTarget.dataset.index;
    options.splice(index, 1);
    optionText.splice(index, 1);
    that.setData({
      templateText: options,
      lists: optionText
    });
  },
  add: function () {
    let that = this;
    let options = that.data.templateText;
    let lastNumText = options[options.length - 1].NumText;
    let NewNumText = {
      SrcIcon: 'http://pcwebtest.ihxlife.com/website/image_x/reduce.png',
      NumText: lastNumText + 1,
      text: '添加图片'
    };
    options.push(NewNumText)
    that.setData({
      templateText: options
    })
  },
  //  点击时间组件确定事件  
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value,
      setTime: true
    })
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value,
      setTime: true
    })
  },
  /**
   * 默认活动截止日期增加7天
   */
  fun_date: function (aa) {
    var date1 = new Date(),
      time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();//time1表示当前时间
    return time1;
  },
  /**
   * 投票主题
   */
  nameInput: function (e) {
    this.setData({
      name: e.detail.value,
      describe: this.data.describe
    })
  },
  /**
   * 投票描述
   */
  descInput: function (e) {
    this.setData({
      describe: e.detail.value
    })
  },
  /**
   * 投票选项
   */
  optionInput: function (e) {
    let id = e.currentTarget.dataset.id;
    if (e.detail.value !== null){
      this.data.lists[id] = e.detail.value;
    }
  },
  /**
   * 投票可多选
   */
  switchOption: function (e) {
    this.setData({
      switch: e.detail.value
    })
  },
  /**
   * 投票匿名
   */
  Anonymity: function (e) {
    this.setData({
      anonymity: e.detail.value
    })
  },
  /**
   * 图片模式
   */
  chooseImg: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id,
      index = e.currentTarget.dataset.index,
      oldImgs = that.data.arrImg;
    console.log(index)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        oldImgs[index] = res.tempFilePaths
        // 图片上传
        that.setData({
          arrImg: oldImgs
        })
        that.imgUpload(res.tempFilePaths[0], id)
      }
    })
  },
  /**
   * 验证活动信息
   */
  validation: function () {
    var that = this;
    if (!that.data.name) {
      wx.showModal({
        title: '消息提示框',
        content: '请填写活动主题',
      })
      return;
    }
    if (!that.data.describe) {
      wx.showModal({
        title: '消息提示框',
        content: '请填写活动描述',
      })
      return;
    }
    console.log(that.data.templateText.length)
    console.log(that.data.lists.length)
    if (that.data.lists.length > 0){
      for (var i = 0; i < that.data.lists.length; i++) {
        if (that.data.lists[i] === '') {
          wx.showModal({
            title: '消息提示框',
            content: '选项文字不能为空',
          })
          return;
        }
      }
    }  
    if (that.data.lists.length > 0 && that.data.templateText.length > that.data.lists.length) {
      wx.showModal({
        title: '消息提示框',
        content: '选项文字不能为空',
      })
      return;
    }
    if (that.data.lists.length < 2) {
      wx.showModal({
        title: '消息提示框',
        content: '选项文字不能为空',
      })
      return;
    }
    if (that.data.selected1 && (that.data.templateText.length > that.data.imgLists.length)) {
      wx.showModal({
        title: '消息提示框',
        content: '请添加图片',
      })
      return;
    }

    that.Vote()
  },
  /**
   * 发布
   */
  playVote: function () {
    this.validation()
  },
  /**
   * 获取个人信息
   */
  userInfo: function () {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        console.log(res.userInfo)
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        getApp().globalData.avatarUrl = avatarUrl;
        that.setData({
          nickName: nickName,
          avatarUrl: avatarUrl
        })
      }
    })
  },
  /**
   * 活动发布
   */
  Vote: function () {
    var that = this;
    var curArr = [];
    for (var i = 0; i < that.data.lists.length; i++) {
      curArr[i] = {
        "opt_title": that.data.lists[i],
        "opt_img": that.data.imgLists[i] === undefined ? '' : that.data.imgLists[i]
      }
    }
    var voteInfo = {
      "option_setting": that.data.selected1 ? 'img' : 'text',
      "openid": getApp().globalData.openid,
      "anonymity": that.data.anonymity ? 'Y' : 'N',   //匿名
      "deadline": that.data.date + ' ' + that.data.time,
      "nickname": that.data.nickName,
      "is_public": that.data.selected2 ? 'Y' : 'N',  // 公开
      "ac_motif": that.data.name,
      "ac_desc": that.data.describe,
      "voteSetting": curArr,
      "option_type": that.data.switch ? 'M' : 'O',  // 多选,
      "headimg": that.data.avatarUrl
    }
    that.saveVote(voteInfo)
  },
  /**
   * 发布
   */
  saveVote: function (data) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: getApp().globalData.urlData + 'initVote.do',
      data: { "voteInfo": data },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.result && res.data.result === 'success') {
          wx.navigateTo({
            url: '../noVoting/noVoting?openid=' + getApp().globalData.openid + '&ac_id=' + res.data.ac_id,
          })
        } else {
          wx.showModal({
            title: '消息提示框',
            content: '活动发布失败，请稍后重试！！！',
          })
          return;
        }
      },
      fail: function () {
        wx.hideLoading()
        wx.showModal({
          title: '消息提示框',
          content: '活动发布失败，请稍后重试！！！',
        })
        return;
      }
    })
  },
  /**
   * 上传图片
   * 
   */
  imgUpload: function (imgUrl, id) {
    var that = this;
    let list = that.data.templateText;
    wx.uploadFile({
      url: getApp().globalData.urlData + 'pic.do',
      filePath: imgUrl,
      name: 'image',
      method: "POST",
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {},
      success: function (res) {
        console.log(res)
        var imgData = JSON.parse(res.data)
        that.data.imgLists[id] = imgData.msg;
        list[id].text = "已添加"
        that.setData({
          templateText: list
        })
      },
      fail: function (res) {
      }
    })
  },
  /**
   * 类型说明
   */
  showInfo: function () {
    wx.showModal({
      title: '提示',
      content: '公开型：所有人可参加。\r\n指定型：仅限发起者指定群成员参加。',
    })
  }
})