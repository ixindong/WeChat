// pages/Vote/Voted/Voted.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    HeadPortrait: '',
    InitiatorName: '',
    InitiatorTime: '',
    endDate: '',
    endTime: '',
    desc: '',
    VoteTitle: '',
    Close: '',
    orOpen: '',
    VoteManNum: 0,
    optionsNum: [],
    VoteManImg: []
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
    var that = this;
    var openid = getCurrentPages()[getCurrentPages().length - 1].options.openid;
    var ac_id = getCurrentPages()[getCurrentPages().length - 1].options.ac_id;
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var avatarUrl = userInfo.avatarUrl
        that.SearchVote(openid, ac_id, avatarUrl)
      }
    })
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
   * 查询活动通过ac_id  openid
   */
  SearchVote: function (openid, ac_id, userImg) {
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
        if (res.data && res.data.result === 'success') {
          var voteInfo = res.data.voteLis[0],
            headImg = [],
            num = null;
          if (voteInfo.headimgLis instanceof Array) {
            voteInfo.headimgLis.forEach(function (i) {
              headImg.push({
                VoteManImgSrc: i
              })
            })
          }
          voteInfo.voteSetting.forEach(function (v, i) {
            num += v.partCount
          })
          voteInfo.status = new Date(Date.parse(voteInfo.deadline.replace(/-/g, "/"))) >= new Date ? '进行中' : '已完结';
          voteInfo.voteSetting.forEach(function (v, i) {
            voteInfo.voteSetting[i].percentage = (v.partCount / num * 100).toFixed(1) + '%'
          })
          that.setData({
            VoteTitle: voteInfo.ac_motif,
            InitiatorName: voteInfo.nickname,
            InitiatorTime: voteInfo.create_date,
            Close: voteInfo.option_type === 'O' ? '单选' : '多选',
            orOpen: voteInfo.is_public === 'Y' ? '公开' : '指定',
            endDate: voteInfo.deadline,
            openid: openid,
            ac_id: ac_id,
            status: voteInfo.status,
            VoteManNum: voteInfo.partCount,
            HeadPortrait: voteInfo.headimg,
            VoteImg: voteInfo.option_setting === 'img' ? true : false,
            optionsNum: voteInfo.voteSetting,
            desc: voteInfo.ac_desc,
            VoteManImg: headImg,
            countVote: num,
            selfVote: userImg === voteInfo.headimg
          })
        }else{
          wx.showModal({
            title: '提示框',
            content: '数据加载失败，请稍后重试'
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showModal({
          title: '提示框',
          content: '数据加载失败，请稍后重试'
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  /**
   * 发起投票
   */
  Voteing: function () {
    var that = this;
    wx.navigateTo({
      url: '../LaunchVote/LaunchVote'
    })
  }
})