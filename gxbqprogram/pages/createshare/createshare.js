// pages/createshare/createshare.js
const utils = require('../../utils/util.js')
const config = require('../../utils/config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconPath:'',
    miniCodePath:'',
    shareImgUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    this.downloadMiniCode()
  },

  // 下载小程序码
  downloadMiniCode:function(){
    let url = wx.getStorageSync('minicodeurl')

    let that = this
    wx.downloadFile({
      url:url,
      success:res=>{
        that.setData({
          miniCodePath:res.tempFilePath
        })
        setTimeout(function(){
          that.clipIcon()
        },300)
        
      },
      fail:function(){
        wx.hideLoading()
        wx.showModal({
          title: '请求失败！',
          content: '下载小程序码时出错，请重试！',
          showCancel:false
        })
        return 0
      }
    })
  },

  /**
   * 将头像切成圆形
   */
  clipIcon:function(){
    let res = wx.getStorageSync('icon')
    let ctx = wx.createCanvasContext('icon');
    let that = this

    let r = 100
    let x = 0
    let y = 0
    var d = 2 * r;
    var cx = x + r;
    var cy = y + r;
    ctx.beginPath();

    ctx.arc(cx, cy, r, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(res, x, y, d, d)
    ctx.save()

    ctx.draw('true', function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 750,
        height: 1334,
        destWidth: 750,
        destHeight: 1334,
        fileType: 'png',
        canvasId: 'icon',
        success: res => {
          that.setData({
            iconPath: res.tempFilePath
          })
          setTimeout(function () {
            that.combine()
          }, 300)
        }
      }, this)
    })

  },

  clickImg:function(){
    let url = this.data.shareImgUrl
    wx.previewImage({
      urls: [url],
    })
  },

  /**
   * 拼接图片
   */
  combine:function(){
    let that = this
    let iconPath = this.data.iconPath
    let miniCodePath = this.data.miniCodePath
    let back = '/images/bg5.jpg'
    let iconback = '/images/icon_back.png'
    let title = wx.getStorageSync('title')
    let ctx = wx.createCanvasContext('share', this)


    /**
     * 设置图片
     */
    ctx.drawImage(back,0,0,750,1334)
    ctx.drawImage(iconPath, 280, 392, 190, 190)
    ctx.drawImage(iconback, 275, 385, 200, 200)
    ctx.drawImage(miniCodePath,542,1096,168,168)
    

    /**
     * 设置文字
     */
    ctx.setTextAlign('center')
    ctx.setTextBaseline('middle')

    ctx.setFontSize(36)
    ctx.fillText(title,375,655)

    ctx.setTextAlign('left')
    ctx.setTextBaseline('bottom')
    ctx.setFontSize(30)
    ctx.fillText('我是', 83, 1165)

    ctx.setFontSize(38)
    ctx.setFillStyle('#FF0000')
    let nickname = (wx.getStorageSync('userinfo')).nickName
    if (nickname == '') {
      nickname = '孟美丽小姐姐'
    }
    ctx.fillText(nickname, 152, 1165)

    ctx.setFontSize(25)
    ctx.setFillStyle('#000000')
    let result = '我身上也就多才多艺，寥寥数十个优点而已。快扫一扫告诉我你的看法吧！—>'

    let length = result.length
    let text = ''
    let text2 = ''
    if (length > 17) {

      text = result.substring(0, 17)
      text2 = result.substring(17, length)
    } else {
      text = result
      text2 = ''
    }

    ctx.fillText(text, 80, 1205)
    ctx.fillText(text2, 80, 1238)

    // let text3 = '扫码来告诉我—>>'
    // ctx.setFillStyle('#FF99CC')
    // ctx.fillText(text3, 295, 1240)
    ctx.save()

    ctx.draw(true, function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 750,
        height: 1334,
        destWidth: 750,
        destHeight: 1334,
        fileType: 'png',
        canvasId: 'share',
        success: res => {
          that.setData({
            shareImgUrl: res.tempFilePath
          })
          wx.hideLoading()
        },
        fail:function(){
          
        }
      }, this)
    })
  },

  /**
   * 返回首页
   */
  backto:function(){
    wx.navigateBack({
      delta:2
    })
  },

  /**
   * 保存图片
   */
  save:function(){
    let url = this.data.shareImgUrl
    if(url == ''){
      wx.showModal({
        title: '出错啦！',
        content: '请稍后重试！',
        showCancel:false
      })
      return 0
    }
    wx.saveImageToPhotosAlbum({
      filePath: url,
      success:function(){
        wx.showModal({
          title: '保存成功！',
          content: '快去发朋友邀请好友来聊聊吧~',
          showCancel:false
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
  
  }
})