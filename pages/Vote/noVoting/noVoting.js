// pages/Vote/noVoting/noVoting.js
Page({
  data: {
    HeadPortrait: '',
    InitiatorName: '',
    InitiatorTime: '',
    status: '',
    is_vote: 'N',
    VoteTitle: '',
    Close: '',
    orOpen: '',
    desc: '',
    VoteImg: true,
    endDate: '',
    endTime: '',
    optionsImg: [
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //获取url里面的参数ac_id
    var ac_id = getCurrentPages()[getCurrentPages().length - 1].options.ac_id;
    var openid = getCurrentPages()[getCurrentPages().length - 1].options.openid;
    if (getApp().globalData.openid === ''){
      that.login(ac_id, openid)
    }else{
      that.SearchVote(ac_id, openid)
    }
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var avatarUrl = userInfo.avatarUrl,
            nickName = userInfo.nickName;
        that.setData({
          userHeadImg: avatarUrl,
          nickName: nickName,
          openid: openid
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
    var that = this;
    if (that.data.orOpen === '公开') {
      return {
        title: '微投票',
        path: '/pages/Vote/noVoting/noVoting?openid=' + that.data.openid + '&ac_id=' + that.data.ac_id,
      }
    } else if (that.data.orOpen === '指定') {
      return {
        title: '微投票',
        path: '/pages/Vote/noVotings/noVoting?openid=' + that.data.openid + '&ac_id=' + that.data.ac_id,
      }
    }
  },
  /**
   * 查询活动通过ac_id  openid
   */
  SearchVote: function (ac_id, openid) {
    var that = this;
    wx.showLoading({
      title: '数据加载中，请稍等',
      mask: true
    })
    wx.request({
      url: getApp().globalData.urlData + 'queryVoteActivity.do',
      data: {
        "openid": openid,
        "acType": ac_id
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data && res.data.result === 'success') {
          var voteInfo = res.data.voteLis[0]
          that.CurIsVote(ac_id, voteInfo.is_public)
          voteInfo.status = new Date(Date.parse(voteInfo.deadline.replace(/-/g, "/"))) >= new Date ? '进行中' : '已完结'
          that.data.orOpen = voteInfo.is_public === 'Y' ? '公开' : '指定'
          that.setData({
            VoteTitle: voteInfo.ac_motif,
            InitiatorName: voteInfo.nickname,
            InitiatorTime: voteInfo.create_date,
            Close: voteInfo.option_type === 'O' ? '单选' : '多选',
            orOpen: voteInfo.is_public === 'Y' ? '公开' : '指定',
            endDate: voteInfo.deadline,
            status: voteInfo.status,
            ac_id: ac_id,
            HeadPortrait: voteInfo.headimg,
            VoteImg: voteInfo.option_setting === 'img' ? true : false,
            desc: voteInfo.ac_desc,
            optionsImg: voteInfo.voteSetting
          })
        }else{
          wx.showModal({
            title: '提示框',
            content: '数据加载失败，请稍后重试',
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showModal({
          title: '提示框',
          content: '数据加载失败，请稍后重试',
        })
      }
    })
  },
  // 查询当前用户是否已经投过票
  CurIsVote: function (ac_id, orOpen) {
    var that = this;
    wx.request({
      url: getApp().globalData.urlData + 'is_vote.do',
      data: {
        "openid": getApp().globalData.openid,
        "ac_id": ac_id
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        if (res.data.result === 'success') {
          that.setData({
            is_vote: res.data.msg
          })
          if (res.data.msg === 'Y') {
            if (orOpen === 'Y') {
              wx: wx.navigateTo({
                url: '../Voted/Voted?openid=' + getApp().globalData.openid + '&ac_id=' + ac_id
              })
            } else if (orOpen === 'N'){
              wx: wx.navigateTo({
                url: '../Voteds/Voted?openid=' + getApp().globalData.openid + '&ac_id=' + ac_id
              })
            }

          }
        }
      },
      fail: function (res) {
      }
    })
  },
  radioChange: function (e) {
    var that = this;
    for (var i = 0; i < that.data.optionsImg.length; i++) {
      var curEle = that.data.optionsImg[i]
      if (curEle.opt_title === e.detail.value) {
        that.setData({
          option_id: curEle.option_id
        })
      }
    }
  },
  checkboxChange: function (e) {
    var that = this;
    var options = [];
    var Evalue = e.detail.value;
    for (var i = 0; i < that.data.optionsImg.length; i++) {
      var curEle = that.data.optionsImg[i];
      for (var j = 0; j < Evalue.length; j++) {
        if (curEle.opt_title == e.detail.value[j]) {
          options.push(curEle.option_id)
        }
      }
    }
    var optionStr = options.join(',')
    that.setData({
      option_id: optionStr
    })
  },
  /**
   * 投票
   */
  Voted: function () {
    var that = this;
    if (that.data.is_vote === 'Y') {
      wx.showModal({
        title: '消息提示框',
        content: '此活动您已经投过，不可以重复投票！',
      })
      return;
    }
    if (that.data.status === '已完结') {
      wx.showModal({
        title: '消息提示框',
        content: '此活动已结束，不可以投票！',
      })
      return;
    }
    if (!that.data.option_id) {
      wx.showModal({
        title: '消息提示框',
        content: '请选择你要投票的选项',
      })
      return;
    }
    wx.request({
      url: getApp().globalData.urlData + 'vote.do',
      data: {
        "ac_id": that.data.ac_id,
        "option_id": that.data.option_id,
        "openid": getApp().globalData.openid,
        "headimg": that.data.userHeadImg,
        "nickname": that.data.nickName
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        if (res.data.result === 'success') {
          that.setData({
            is_vote: 'Y'
          })
          wx: wx.navigateTo({
            url: '../Voted/Voted?openid=' + that.data.openid + '&ac_id=' + that.data.ac_id
          })
        } else {
          wx.showToast({
            title: '投票失败',
            icon: 'cancel',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '投票失败',
          icon: 'cancel',
          duration: 2000
        })
      }
    })
  },
  login: function (ac_id, openid) {
    var that = this;
    wx.login({
      success: function (res) {
        getApp().globalData.js_code = res.code;
        that.openID(res.code, ac_id, openid)
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
  openID: function (code, ac_id, openid) {
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
        that.SearchVote(ac_id, openid)
      }
    })
  }
})