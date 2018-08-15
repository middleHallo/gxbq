// pages/authrise/authrise.js
const utils = require('../../utils/util.js')
const config = require('../../utils/config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 获取用户信息
   */
  getInfo:function(e){
    
    if (e.detail.errMsg == 'getUserInfo:ok'){
      wx.setStorageSync('userinfo', e.detail.userInfo)
      this.wxlogin()
    }
  },

  /**
   * wx方login获取code
   */
  wxlogin:function(){
    let that = this
    wx.showLoading({
      title: '登录中...',
    })
    wx.login({
      success:res=>{
        that.grbqlogin(res.code)
        return 0
      }
    })
  },

  // 个人登录
  grbqlogin:function(code){
    let url = config.service.requesturl + 'gxbq/grbqlogin'
    let userinfo = wx.getStorageSync('userinfo')
    let params = {
      nickname: userinfo.nickName,
      gender:userinfo.gender,
      avatarurl:userinfo.avatarUrl,
      country:userinfo.country,
      province:userinfo.province,
      city:userinfo.city,
      code:code
    }

    utils.post(url, params,function(res){
      if(res.data.code != 200){
        wx.showModal({
          title: '登录失败',
          content: '请稍后重试！',
          showCancel:false
        })
        return 0
      }
      wx.setStorageSync('userid', res.data.userid)
      wx.showToast({
        title: '登录成功！',
        icon:'success',
        complete:function(){
          setTimeout(function(){
            wx.navigateBack({})
          },1000)
        }
      })

    },
    function(){ // complete()
      wx.hideLoading() 
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
  
  }
})