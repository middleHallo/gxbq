// pages/detail/detail.js
const utils = require('../../utils/util.js')
const config = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listid:'',
    grtype:0,
    tags:[],
    result:{},
    scrollHeight:530,
    isSelf: false,
    showModal: false,
    inputtext: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    var scene = decodeURIComponent(options.scene)
    console.log(scene)
    console.log(typeof (scene))
    if (typeof (scene) == "string" && scene == 'undefined'){
      this.setData({
        listid: options.listid,
        grtype: options.grtype,
      })
    }else{
      let arr = scene.split('&')
      let listid = (arr[0].split('='))[1]
      let grtype = (arr[1].split('='))[1]

      this.setData({
        listid: listid,
        grtype: grtype
      })
    }
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
    let barhight = wx.getSystemInfoSync().statusBarHeight
    let heigt = wx.getSystemInfoSync().screenHeight - 70 - barhight - 200
    this.setData({
      scrollHeight: heigt
    })
    this.getTags(1)
  },


  /**
   * getList
   */
  getTags:function(page){

    let listid = this.data.listid
    if(listid == ''){
      utils.myshowmodel('请求出错','listid为空')
      return 0
    }
    let that = this
    
    let userid = wx.getStorageSync('userid')
    let isSelf = false
    
    let url = config.service.requesturl + 'gxbq/getTags?listid=' + listid + '&page=' + page
    console.log(url)
    utils.getData(url,function(res){

      if(res.data.code != 200){
        return 0
      }
      console.log(res)

      if (userid == '') {
        isSelf = false
      }else{
        if(userid == res.data.content.userid){
          isSelf = true
        }
      }

      let data = []

      if(page == 1){
        data = res.data.tags
      }else{
        data.concat(res.data.tags)
      }

      that.setData({
        result:res.data.content,
        tags: data,
        isSelf: isSelf
      })
    })

  },

  add:function(){
    this.setData({
      showModal: true
    })
  },

  /**
   * 生成预览
   */
  previewOtherTags:function(){
    let tags = this.data.tags
    let othertags = []

    for(let i=0;i<tags.length;i++){
      othertags.push(tags[i].detailtext)
    }

    let result = this.data.result
    wx.setStorageSync('otherTags', othertags)


    wx.setStorageSync('otherResult', result)

    wx.navigateTo({
      url: '/pages/othertags/othertags',
    })

  },

  /**
   * 返回首页
   */
  backto:function(){
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },

  /**
   * 点击取消
   */
  modalCancel: function () {
    this.setData({
      showModal: false,
      inputtext: ''
    })
  },

  /**
   * 点击确认
   */
  modalConfirm: function () {

    var tag = this.data.inputtext
    var newtag = tag.trim()

    if (newtag == '') {
      this.setData({
        showModal: false,
        inputtext: ''
      })
      return 0
    }

    let listid = this.data.listid
    let url = config.service.requesturl + 'gxbq/addTags?listid=' + listid + '&detailtext=' + newtag
    let that = this
    utils.getData(url,function(res){
      if(res.data.code == 200){
        that.setData({
          showModal: false
        })
        that.getTags(1)
      }else{
        utils.myshowmodal(res.data.error_title,res.data.error_message)
        return 0
      }
    })

  },

  /**
   * 监听输入框事件
   */
  inputTags: function (event) {
    this.setData({
      inputtext: event.detail.value
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