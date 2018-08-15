//index.js
const device = wx.getSystemInfoSync()
const W = device.windowWidth
const H = device.windowHeight - 50

let cropper = require('../welCropper/welCropper.js');

Page({
  data: {
    showModal:false,
    showCropper:false,
    tags:[],
    inputtext:'',
    scrollHeight:560
  },

  onReady: function(){

  },

  onShow: function(){
    let statusHeight = wx.getSystemInfoSync().statusBarHeight
    let height = wx.getSystemInfoSync().windowHeight - statusHeight - 134
    let tags = wx.getStorageSync('tags')
    if(tags == ''){
      tags = []
    }
    this.setData({
      scrollHeight: height,
      tags: tags
    })
  },

  onLoad: function () {

    var that = this
    // 初始化组件数据和绑定事件
    cropper.init.apply(that, [W, H]);
    that.setData({
      showCropper: true
    })
  },

  /**
   * 点击取消
   */
  modalCancel:function(){
    this.setData({
      showModal: false,
      inputtext: ''
    })
  },

  /**
   * 点击确认
   */
  modalConfirm:function(){
    var list = this.data.tags
    var tag = this.data.inputtext
    var newtag = tag.trim()
    
    if (newtag == ''){
      this.setData({
        showModal: false,
        inputtext: ''
      })
      return 0
    }
    
    list.push(tag)
    this.setData({
      showModal: false,
      tags: list,
      inputtext: ''
    })
  }, 

  /**
   * 监听输入框事件
   */
  inputTags:function(event){
    this.setData({
      inputtext:event.detail.value
    })
  },

  /**
   * 添加标签
   */
  add:function(){

    this.setData({
      showModal:true
    })
  },

  /**
   * 删除标签
   */
  deletelist:function(event){
    var idx = event.currentTarget.dataset.idx
    var tags = this.data.tags
    if (tags.length > idx){
      tags.splice(idx, 1);
    }else{
      return 0
    }
    this.setData({
      tags: tags
    })
  },

  /**
   * 下一步
   */
  next:function(){
    var tags = this.data.tags
    if(tags.length < 1){
      wx.showModal({
        title: '不能跳转',
        content: '当前还未添加印象',
        showCancel:false
      })
      return 0
    }

    if(tags.length > 12){

        wx.showModal({
          title: '当前标签超过12条',
          content: '是否随机选择12条生成图片？',
          success:res=>{
            if(res.confirm){
              wx.setStorageSync('tags', tags)
              wx.navigateTo({
                url: '/pages/next/next',
              })
            }else{
            }
          }
        })

    }else{
      wx.setStorageSync('tags', tags)
      wx.navigateTo({
        url: '/pages/next/next',
      })
    }

    
  },

  /**
   * clickOther
   */
  clickOther:function(){
    wx.redirectTo({
      url: '/pages/other/other',
    })
  }
})
