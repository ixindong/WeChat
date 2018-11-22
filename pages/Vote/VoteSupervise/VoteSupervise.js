// pages/Vote/VoteSupervise/VoteSupervise.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    delBtnWidth: 102,
    selected: true,
    selected1: false,
    HeadPortrait: '',
    Information: [],
    MyInformation: [],
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
    let that = this;
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var HeadPortrait = userInfo.avatarUrl
        that.setData({
          HeadPortrait: HeadPortrait
        })
      }
    })
    that.getVote()
    that.getMyVote()
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
  //触摸开始
  touchS: function (e) {
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX
      });
    }
  },
  //触摸时触发，手指在屏幕上每移动一次，触发一次
  touchM: function (e) {
    var that = this
    if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      var disX = that.data.startX - moveX;
      var delBtnWidth = that.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {
        return
      } else if (disX > 0) {
        txtStyle = "left:-" + disX + "rpx";
        if (disX >= delBtnWidth) {
          txtStyle = "left:-" + delBtnWidth + "rpx";
        }
      }
      //获取手指触摸的是哪一个item
      let index = e.currentTarget.dataset.index;
      let list = that.data.Information;
      //将拼接好的样式设置到当前item中
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        Information: list
      });
    }
  },
  //触摸结束
  touchE: function (e) {
    var that = this
    if (e.changedTouches.length == 1) {
      //手指移动结束后触摸点位置的X坐标
      let endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      let disX = that.data.startX - endX;
      let delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      let txtStyle = disX > delBtnWidth ? "left:-" + delBtnWidth + "rpx" : "left:0rpx";
      //获取手指触摸的是哪一项
      let index = e.currentTarget.dataset.index;
      let list = that.data.Information;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      that.setData({
        Information: list
      });
    }
  },
  //触摸开始
  myTouchS: function (e) {
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX
      });
    }
  },
  //触摸时触发，手指在屏幕上每移动一次，触发一次
  myTouchM: function (e) {
    var that = this
    if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      var disX = that.data.startX - moveX;
      var delBtnWidth = that.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {
        return
      } else if (disX > 0) {
        txtStyle = "left:-" + disX + "rpx";
        if (disX >= delBtnWidth) {
          txtStyle = "left:-" + delBtnWidth + "rpx";
        }
      }
      //获取手指触摸的是哪一个item
      let index = e.currentTarget.dataset.index;
      let list = that.data.MyInformation;
      //将拼接好的样式设置到当前item中
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        MyInformation: list
      });
    }
  },
  //触摸结束
  myTouchE: function (e) {
    var that = this
    if (e.changedTouches.length == 1) {
      //手指移动结束后触摸点位置的X坐标
      let endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      let disX = that.data.startX - endX;
      let delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      let txtStyle = disX > delBtnWidth ? "left:-" + delBtnWidth + "rpx" : "left:0rpx";
      //获取手指触摸的是哪一项
      let index = e.currentTarget.dataset.index;
      let list = that.data.MyInformation;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      that.setData({
        MyInformation: list
      });
    }
  },
  /**
   * 删除发起活动
   */
  MyDel: function (e) {
    let that = this;
    wx.showActionSheet({
      itemList: ['删除', '取消'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          let index = e.currentTarget.dataset.index;
          let voteInfo = e.currentTarget.dataset.id;
          let list = that.data.MyInformation;
          list.splice(index, 1);
          wx.request({
            url: getApp().globalData.urlData + "delVote.do",
            data: {
              ac_id: voteInfo.ac_id,
              openid: getApp().globalData.openid
            },
            header: {
              "Content-Type": "application/json"
            },
            success: function (res) {
              if (res.data.result === 'fail') {
                wx: wx.showToast({
                  title: '删除活动失败',
                  icon: 'cancel',
                  duration: 2000
                })
              } else {
                that.setData({
                  MyInformation: list
                });
                wx: wx.showToast({
                  title: '删除活动成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            },
            fail: function (res) {
              wx: wx.showToast({
                title: '删除活动失败',
                icon: 'cancel',
                duration: 2000
              })
            }
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  /**
   * 删除参与活动
   */
  Del: function (e) {
    let that = this;
    wx.showActionSheet({
      itemList: ['删除'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          let index = e.currentTarget.dataset.index;
          let voteInfo = e.currentTarget.dataset.id;
          let list = that.data.Information;
          list.splice(index, 1);
          console.log(voteInfo.ac_id)
          console.log(getApp().globalData.openid)
          wx.request({
            url: getApp().globalData.urlData + "delVote.do",
            data: {
              ac_id: voteInfo.ac_id,
              openid: getApp().globalData.openid
            },
            header: {
              "Content-Type": "application/json"
            },
            success: function (res) {
              console.log(res.data)
              if (res.data.result === 'fail') {
                wx: wx.showToast({
                  title: '删除活动失败',
                  icon: 'cancel',
                  duration: 2000
                })
              } else {
                that.setData({
                  Information: list
                });
                wx: wx.showToast({
                  title: '删除活动成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            },
            fail: function (res) {
              wx: wx.showToast({
                title: '删除活动失败',
                icon: 'cancel',
                duration: 2000
              })
            }
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  /**
   * 获取我参与的活动
   */
  getVote: function () {
    var that = this;
    wx.showLoading({
      title: '数据加载中，请稍等',
      mask: true
    })
    wx.request({
      url: getApp().globalData.urlData + "queryVoteActivity.do",
      data: {
        openid: getApp().globalData.openid,
        acType: 'take'
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        wx.hideLoading()
        var arrList = []
        if (res.data.result === 'success') {
          res.data.voteLis.forEach(function (v, i) {
            arrList.unshift(v)
            v.status = new Date(Date.parse(v.deadline.replace(/-/g, "/"))) >= new Date ? '进行中' : '已完结'
          })
          that.setData({
            Information: arrList
          })
        }
      },
      fail: function () {
        wx.hideLoading()
        wx.showModal({
          title: '提示框',
          content: '数据加载异常，请稍后重试',
        })
      }
    })
  },
  /**
   * 获取我发起的活动
   */
  getMyVote: function () {
    var that = this;
    console.log(getApp().globalData.openid)
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: getApp().globalData.urlData + "queryVoteActivity.do",
      data: {
        openid: getApp().globalData.openid,
        acType: 'initiate'
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        wx.hideLoading();
        var arrList = [];
        if (res.data.result === 'success') {
          res.data.voteLis.forEach(function (v, i) {
            arrList.unshift(v)
            v.status = new Date(Date.parse(v.deadline.replace(/-/g, "/"))) >= new Date ? '进行中' : '已完结'
          })
          that.setData({
            MyInformation: arrList
          })
        }else{
          wx.showToast({
            title: '数据加载异常',
          })
        }
      },
      fail: function () {
        wx.hideLoading()
        wx.showModal({
          title: '提示框',
          content: '数据加载异常，请稍后重试',
        })
      }
    })
  },
  /**
   * 进入我参与的活动详情
   */
  DetailVote: function (e) {
    var that = this;
    var voteInfo = e.currentTarget.dataset.id,
      HeadPortrait = that.data.HeadPortrait;
    that.setData({
      ac_id: e.currentTarget.dataset.id.ac_id
    })
    console.log(getApp().globalData.openid)
    if (voteInfo.is_public === 'N' && HeadPortrait != voteInfo.headimg) {
      wx.navigateTo({
        url: '../Voteds/Voted?openid=' + getApp().globalData.openid + '&ac_id=' + voteInfo.ac_id,
      })
    } else {
      wx.navigateTo({
        url: '../Voted/Voted?openid=' + getApp().globalData.openid + '&ac_id=' + voteInfo.ac_id,
      })
    }
  },
  /**
   * 进入我发起的活动详情
   */
  MyDetailVote: function (e) {
    var that = this;
    var voteInfo = e.currentTarget.dataset.id;
    that.setData({
      ac_id: e.currentTarget.dataset.id.ac_id
    })
    if (voteInfo.is_vote === 'N') {
      wx.navigateTo({
        url: '../noVoting/noVoting?openid=' + getApp().globalData.openid + '&ac_id=' + voteInfo.ac_id
      })
    } else {
      wx.navigateTo({
        url: '../Voted/Voted?openid=' + getApp().globalData.openid + '&ac_id=' + voteInfo.ac_id
      })
    }
  },
  /**
   * 发起投票
   */
  LaunchVote: function () {
    wx.navigateTo({
      url: '../LaunchVote/LaunchVote'
    })
  }
})