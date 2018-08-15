// pages/other/other.js
const utils = require('../../utils/util.js')
const config = require('../../utils/config.js')

const device = wx.getSystemInfoSync()
const W = device.windowWidth
const H = device.windowHeight - 50
let cropper = require('../welCropper/welCropper.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: 560,
    selectedImg: '',
    title: '',
    showCropper: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let statusHeight = wx.getSystemInfoSync().statusBarHeight
    let height = wx.getSystemInfoSync().windowHeight - statusHeight - 134
    let that = this
    // 初始化组件数据和绑定事件
    cropper.init.apply(that, [W, H]);

    let userinfo = wx.getStorageSync('userinfo')
    let nickname = ''
    if(userinfo != ''){
      let nickname2 = userinfo.nickName
      if (nickname2 != ''){
        nickname = nickname2
      }
    }
    this.setData({
      showCropper: true,
      scrollHeight: height,
      title: nickname
    })
  },
  /**
   * 输入标题
   */
  inputTitle: function (e) {
    this.setData({
      title: e.detail.value
    })
  },

  /**
   * 跳转添加界面
   */
  next: function () {
    let title = this.data.title
    let selectedImg = this.data.selectedImg
    let userid = wx.getStorageSync('userid')

    // 拒绝跳转
    if (title == '' || selectedImg == '') {
      wx.showModal({
        title: '错误',
        content: '昵称和头像不能为空！',
        showCancel: false,
      })
      return 0
    }

    // 设置头像信息和标题信息
    wx.setStorageSync('myicon', selectedImg)
    wx.setStorageSync('nickname', title)
    //跳转
    wx.navigateTo({
      url: '/pages/result/result',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 点击 自我印象
   */
  clickMe: function () {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 选择图片
   */
  selecteImg: function (e) {
    let that = this
    let mode = e.currentTarget.dataset.mode
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        let tempFilePath = res.tempFilePaths[0]
        that.showCropper({
          src: tempFilePath,
          mode: mode,
          sizeType: ['original', 'compressed'],
          callback: (res) => {
            that.setData({
              showCropper: false,
              selectedImg: res
            })
          }
        })
      }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})