// pages/result/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[
      '好听的话不会说，暖心的事干不完',
      '一直在努力做最好的自己',
      '颜值满分',
      '划船不用桨，全靠浪...'
    ],
    path:'',
    bottomPath:'',
    backPath:'',
    iconPath:''
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
    this.clipIcon()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 裁剪圆形icon
   */
  clipIcon:function(){
    wx.showLoading({
      title: '加载中...',
    })

    let avatar = wx.getStorageSync('avatar')
    
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
    ctx.drawImage(avatar, x, y, d, d)
    ctx.save()

    ctx.draw('true', function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 200,
        height: 200,
        destWidth: 200,
        destHeight: 200,
        fileType: 'png',
        canvasId: 'icon',
        success: res => {
          console.log(res)
          that.setData({
            iconPath: res.tempFilePath
          })
          setTimeout(function(){
            that.loadBottomFile()
          },1000)
        }
      }, this)
    })
  },

  /**
   * 裁剪封装
   */
  circleImg: function (ctx, img, x, y, r) {
    ctx.save();
    var d = 2 * r;
    var cx = x + r;
    var cy = y + r;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(img, x, y, d, d);
  },

  /**
   * 下载底部图片
   */
  loadBottomFile:function(){
    
    let bottomImagePath = 'http://192.168.1.110/public/uploads/grbq/2.jpg'
    let that = this
    wx.downloadFile({
      url:bottomImagePath,
      success:res=>{
        that.setData({
          bottomPath:res.tempFilePath
        })
        setTimeout(function(){
          that.loadBackFile()
        },500)
      }
    })
    
  },

  /**
   * 下载模板文件
   */
  loadBackFile:function(){
    let path = 'http://192.168.1.110/public/uploads/grbq/back.png'
    let that = this
    wx.downloadFile({
      url: path,
      success: res => {
        that.setData({
          backPath: res.tempFilePath
        })
        setTimeout(function () {
          that.combine()
        },500)
      }
    })
  },

  /**
   * 合并
   */
  combine:function(){

    let ctx = wx.createCanvasContext('grbq', this)

    let backImg = this.data.backPath
    let bottomPath = this.data.bottomPath
    let items = this.data.items
    let iconPath = this.data.iconPath
    
    let that = this
    ctx.drawImage(bottomPath,0,0,750,1334)
    
    ctx.setFillStyle('rgba(0, 0, 0, 0.65)')
    ctx.fillRect(0,0,750,1334)
    ctx.drawImage(backImg,0,0,750,1334)
    // 头像
    ctx.drawImage(iconPath,270,330,200,200)

    /**
     * 设置颜色 水平对齐方式 垂直对齐方式
     */
    ctx.setFillStyle('#FFFFFF')
    ctx.setTextAlign('center')
    ctx.setTextBaseline('middle')

    ctx.setFontSize(44)
    ctx.fillText(items[0],395,178)

    ctx.setFontSize(36)
    ctx.fillText(items[1], 542,878)

    ctx.setFontSize(40)
    ctx.fillText(items[2], 120, 1078)

    ctx.setFontSize(44)
    ctx.fillText(items[3], 408, 586)

    ctx.save()
    ctx.draw('true',function(){
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 750,
        height: 1334,
        destWidth: 750,
        destHeight: 1334,
        fileType: 'png',
        canvasId: 'grbq',
        success: res => {
          console.log(res)
          that.setData({
            path:res.tempFilePath
          })
          wx.hideLoading()
        }
      }, this)
    })
    
  },

  /**
   * 预览图片
   */
  clickImg:function(){
    let url = this.data.path
    wx.previewImage({
      urls: [url],
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