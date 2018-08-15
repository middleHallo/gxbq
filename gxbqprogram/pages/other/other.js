// pages/other/other.js
const utils = require('../../utils/util.js')
const config = require('../../utils/config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: 560,
    listdata:[],
    currentPage:1,
    totalPage:1
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let statusHeight = wx.getSystemInfoSync().statusBarHeight
    let height = wx.getSystemInfoSync().windowHeight - statusHeight - 134
    this.setData({
      scrollHeight: height
    })
  },

  /**
   * 点击跳转详情
   */
  detail:function(e){
    let idx = e.currentTarget.dataset.idx
    let data = this.data.listdata[idx]
    let listid = data.listid
    let url = '/pages/detail/detail?grtype=0&listid=' + listid
    wx.navigateTo({
      url: url,
    })
  },

  deletelist:function(e){
    let idx = e.currentTarget.dataset.idx

    let data = this.data.listdata[idx]
    let listid = data.listid
    let userid = wx.getStorageSync('userid')

    let url = config.service.requesturl + 'gxbq/deleteList?userid=' + userid + '&listid=' + listid
    let that = this
    utils.getData(url,function(res){
        if(res.data.code != 200){
          utils.myshowmodel(res.data.error_title,res.data.error_title)
          wx.hideLoading();

          return 0
        }

      utils.showsuccess('删除成功')
          //getListData
      that.getListData(1)
    })
  },

  /**
   * 跳转添加界面
   */
  add:function(){

    let userid = wx.getStorageSync('userid')

    if (userid== ''){
      wx.showModal({
        title: '当前未登录',
        content: '是否跳转登录后进行操作',
        success:res=>{
          if(res.confirm){
            wx.navigateTo({
              url: '/pages/authrise/authrise',
            })
          }else{
            // 什么也不做
          }
        }
      })
      return 0
    }

    wx.navigateTo({
      url: '/pages/addother/addother',
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
  clickMe:function(){
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let userid = wx.getStorageSync('userid')
    if(userid == ''){
      wx.showModal({
        title: '当前未登录',
        content: '无法获取相关信息，是否跳转登录？',
        success:res=>{
          if(res.confirm){
            wx.navigateTo({
              url: '/pages/authrise/authrise',
            })
          }else{
            // 什么也不做
          }
        }
      })

      return 0
    }

    this.getListData(1)

  },

  /**
   * 获取信息
   */
  getListData:function(page){
    let userid = wx.getStorageSync('userid')
    let url = config.service.requesturl + 'gxbq/getList?userid=' + userid + '&page=' + page
    let that = this

    utils.getData(url,function(res){
        
        if(res.data.code != 200){
          wx.showModal({
            title: '请求完成',
            content: '当前无更多信息',
            showCancel:false
          })
          return 0
        }

      console.log(res)

        that.setData({
          listdata:res.data.contents,
          currentPage:res.data.currentPage,
          totalPage:res.data.totalPage
        })
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