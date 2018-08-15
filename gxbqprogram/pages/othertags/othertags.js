
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagsInfo: [
      { x: 156, y: 100, f: 40 },
      { x: 372, y: 190, f: 28 },
      { x: 86, y: 247, f: 26 },
      { x: 256, y: 315, f: 40 },
      { x: 80, y: 410, f: 22 }, //这两条是头像旁边的
      { x: 482, y: 490, f: 22 }, //这两条是头像旁边的
      { x: 208, y: 752, f: 32 },
      { x: 348, y: 856, f: 26 },
      { x: 86, y: 937, f: 24 },
      { x: 282, y: 1017, f: 38 }
    ],
    result: [
      '我也就多才多艺，寥寥数十个优点而已。',
      '上天太偏心了，为什么要把所有的优点都集中在我身上。',
      '地铁上说请勿携带易燃易爆品，我果断下了车，因为我萌爆了。',
      '有人说我帅，我想了一晚上，究竟是谁走漏了风声。'
    ],
    nickname: '不知道星人',
    path: '',
    bottomPath: '',
    backPath: '',
    iconPath: '',

    /**
     * 前面都是之前的数据
     */
    shareImgUrl: '/images/myselt_share.jpg',
    tags: [],
    showCropper: false,
    detail:{},
    myicon:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var tags = wx.getStorageSync('otherTags')
    console.log(tags)
    var result = wx.getStorageSync('otherResult')
    this.setData({
      tags: tags,
      detail:result
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.downloadIcon()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  downloadIcon:function(){
    let url = this.data.detail.imgurl
    let that = this
    wx.downloadFile({
      url: url,
      success:function(res){
        that.setData({
          myicon:res.tempFilePath
        })
        setTimeout(function(){
          that.clipIcon()
        },500)
      }
    })
  },

  clipIcon: function () {
    let res = this.data.myicon
    wx.showLoading({
      title: '加载中...',
    })

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
          }, 1000)
        }
      }, this)
    })
  },


  /**
   * 进行图片拼接
   */
  combine: function () {

    var ctx = wx.createCanvasContext('share', this)

    var backImg = '/images/bg5.jpg'
    var miniCodePath = '/images/grbq_minicode.jpg'
    let iconpath = this.data.iconPath
    // var icon_back = '/images/icon_back2.png'
    var tags = this.data.tags
    var that = this

    /**
     * 背景和icon的背景图
     */
    ctx.drawImage(backImg, 0, 0, 750, 1334)
    // ctx.drawImage(icon_back,275,380,200,200)
    var icon_back = '/images/icon_back2.png'
    ctx.drawImage(iconpath, 280, 392, 190, 190)
    ctx.drawImage(icon_back, 275, 385, 200, 200)
    ctx.drawImage(miniCodePath, 542, 1096, 168, 168)

    /**
     * 设置标题信息
     */
    let title = this.data.detail.title
    ctx.setTextAlign('center')
    ctx.setTextBaseline('middle')
    ctx.setFontSize(40)
    ctx.fillText(title, 375, 660)


    /**
     * 设置标签信息
     */
    var tagsBackUrl = '/images/listback.png'
    var tagsLeftUrl = '/images/list-left.png'
    var tagsRightUrl = '/images/list-right.png'

    let infodata = this.data.tagsInfo
    let tagsLen = tags.length

    if (tagsLen >= 10) {
      tagsLen = 10
    }

    let newtags = that.getRandArr(tags, tagsLen)
    let newarr = that.getRandArr(infodata, tagsLen)

    for (let i = 0; i < newarr.length; i++) {
      let current = newarr[i]
      let tag = tags[i]
      let tagLen = tag.length
      let x = current.x
      let y = current.y
      let f = current.f

      let newTag = ''
      if (x == 482 || x == 80) {
        if (tagLen > 6) {
          newTag = tag.slice(0, 6)
          newTag += '...'
          tag = newTag
          tagLen = 7
        }
      }

      ctx.drawImage(tagsLeftUrl, x, y, 10, 10)
      ctx.drawImage(tagsBackUrl, x, y, f * tagLen + 30, f + 30);
      ctx.drawImage(tagsRightUrl, x + f * tagLen - 30, y + f + 30, 12, 3)
      ctx.setTextAlign('left')
      ctx.setTextBaseline('middle')
      ctx.setFontSize(f)

      ctx.fillText(tag, x + 15, y + (f + 30) / 2)
    }

    /**
     * 设置底部信息
     */

    ctx.setTextAlign('left')
    ctx.setTextBaseline('bottom')

    ctx.setFontSize(30)
    ctx.fillText('我是', 83, 1165)

    ctx.setFontSize(38)
    ctx.setFillStyle('#FF0000')
    let nickname = wx.getStorageSync('userinfo').nickName
    if (nickname == '') {
      nickname = this.data.nickname
    }
    ctx.fillText(nickname, 152, 1165)

    ctx.setFontSize(28)
    ctx.setFillStyle('#000000')
    let resultsarr = this.data.result
    let results = that.getRandArr(resultsarr, 1)
    let result = results[0]

    let length = result.length
    let text = ''
    let text2 = ''
    if (length > 15) {

      text = result.substring(0, 15)
      text2 = result.substring(15, length)
    } else {
      text = result
      text2 = ''
    }

    ctx.fillText(text, 80, 1205)
    ctx.fillText(text2, 80, 1238)

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
        canvasId: 'share',
        success: res => {
          that.setData({
            shareImgUrl: res.tempFilePath
          })
          wx.hideLoading()
        }
      }, this)
    })

  },

  /**
   * 随机返回数组的n个元素
   */
  getRandArr: function (infodata, len = 0) {
    if (len <= 0 || len > 10) {
      return 0
    }

    // let infodata = this.data.tagsInfo
    let newsrr = []
    for (let i = 0; i < len; i++) {

      var ran = Math.floor(Math.random() * infodata.length);

      newsrr.push(infodata[ran]);

      var center = infodata[ran];

      infodata[ran] = infodata[infodata.length - 1];

      infodata[infodata.length - 1] = center;

      console.log(infodata)
      console.log('error=')
      infodata = infodata.slice(0, infodata.length - 1);
      // infodata = infodata.pop()
    }
    console.log('2222')
    return newsrr
  },

  /**
   * 预览图片
   */
  clickImg: function () {
    let url = this.data.shareImgUrl
    wx.previewImage({
      urls: [url],
    })
  },

  /**
   * 保存图片
   */
  saveToAlbum: function () {
    let url = this.data.shareImgUrl
    wx.saveImageToPhotosAlbum({
      filePath: url,
      success: function () {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
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