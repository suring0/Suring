var util = require('../../utils/util.js')
var video = 'null'
var images = []
var title,content
const app = getApp()
const db = wx.cloud.database();
Page({
  data: {
    title:'',
    content: '',
    images: [],
    user: {},
    isLike: false,
    max:50000
  },
  onShow: function(){

    console.log("app.AppData == ",app.AppData)
  },
  onLoad: function (options) {
    console.log("onload")
    this.setData({
      title: '',
      textContent:''
    })
    title = ''
    content = ''
    video = 'null'
    images = []
  },
  //填写内容
  getTextAreaContent:function(event) {
    content = event.detail.value;
  },
  //输入标题
  inputTitle:function(event){
    title = event.detail.value;
    console.log(title)
  },
  //上传视频
  chooseVideo:function(event){
    var that = this
    if (title == '' || title == null) {
      wx.showToast({
        icon: 'none',
        title: '没写标题呢',
      })
    } else {
      wx.chooseVideo({
        sourceType: ['album','camera'],
        maxDuration: 60, //默认拍摄时间 单位秒
        camera: 'back',
        success: function (res) {
          wx.showLoading({
            title: '视频上传中',
          })
          console.log("视频临时路径" + res.tempFilePath)
          wx.cloud.uploadFile({
            // 指定要上传的文件的小程序临时文件路径
            cloudPath: that.videotostr(res.tempFilePath),
            filePath: res.tempFilePath,
            // 成功回调
            success: res => {
              wx.hideLoading()
              video = res.fileID
              console.log("video:"+video)
              wx.showToast({
                title: '上传成功',
              })
            },
          })
        }
      })
    }
  },
  //选择图片
  chooseImage: function (event) {
    var that = this
    if (title == '') {
      wx.showToast({
        icon: 'none',
        title: '没写标题呢',
      })
    } else {
      wx.chooseImage({
        sourceType: ['album', 'camera'],
        count: 6,
        success: function (res) {
          wx.showLoading({
            title: '图片上传中',
          })
          // 设置图片
          that.setData({
            images: res.tempFilePaths,
          })
          images = []
          console.log(res.tempFilePaths)
          for (var i in res.tempFilePaths) {
            // 将图片上传至云存储空间
            wx.cloud.uploadFile({
              // 指定要上传的文件的小程序临时文件路径
              cloudPath: that.imagetostr(res.tempFilePaths[i]),
              filePath: res.tempFilePaths[i],
              // 成功回调
              success: res => {
                wx.hideLoading()
                images.push(res.fileID)
                wx.showToast({
                  title: '上传成功',
                })
              },
            })
          }
        },
      })
    }
  },
  // 图片路径格式化
  imagetostr(filepath) {
    var that = this
    var file = filepath
    var randnum = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    var str = 'Articles' + '/' + 'Public_Articles' + '/' + title + '/' + randnum + filepath.match(/\.[^.]+?$/)[0];
    return str;
    console.log('str', str)
    if (str == null) {
      this.timetostr(file)
      console.log('重新加载')
    }
  },
  // 视频路径格式化
  videotostr(filepath) {
    var that = this
    var file = filepath
    var randnum = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    var str = 'Video' + '/' + title + randnum + filepath.match(/\.[^.]+?$/)[0];
    return str;
    console.log('str', str)
    if (str == null) {
      this.timetostr(file)
      console.log('重新加载')
    }
  },
  //发布
  formSubmit: function (e) {
    var that = this
    console.log('图片：', images)
    if (title == '') {
      wx.showToast({
        icon: 'none',
        title: '没写标题呢',
      })
    } else {
      if (images.length > 0) {
        this.saveDataToServer();
      } else if (content.trim() != '') {
        this.saveDataToServer();
      } else {
        wx.showToast({
          icon: 'none',
          title: '写点东西吧',
        })
      }
    }
  },
  //保存到文章集合中
  saveDataToServer() {
    var that = this
    var time = util.formatTime(new Date());
    console.log(time)
    db.collection('Articles').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        title: title,
        content: content,
        time: time,
        images: images,
        name: app.AppData.nickName,
        type: 0,
        video:video,
        avatarUrl: app.AppData.avatarUrl
      },
      success: function (res) {
        wx.showToast({
          title: '发布成功',
        })
      },
    })
  },
  //删除图片
  removeImg: function (event) {
    var position = event.currentTarget.dataset.index;
    this.data.images.splice(position, 1);
    // 渲染图片
    this.setData({
      images: this.data.images,
    })
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      //当前显示图片
      current: this.data.images[index],
      //所有图片
      urls: this.data.images
    })
  },
})