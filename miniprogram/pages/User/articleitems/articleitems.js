let app = getApp()
const db = wx.cloud.database()
var pid
var path,isLike
Page({
  data: {
    hiddenVideo: true,
    tempFilePaths:'',
  },
  onLoad: function(options){
    if(app.AppData.openid == null || app.AppData.openid == ''){
      wx.showToast({
        title: '未登录',
        icon: 'none',
        duration: 1000
      })
    }else{
      this.getCollections()
    }

    if(options.articleType == 0){
      this.getIntroduce()
    }else{
      this.getAticle()
    }
  },

  //获取文章信息
  getAticle(){
    var that = this
    console.log("app.AppData:",app.AppData.id)
    db.collection('Articles').where({
      _id: app.AppData.id
    }).get({
      success(res) {
        console.log(res)
        if(res.data[0].video == "null") {
          that.setData({
            hiddenVideo: true
          })
        }else{
          that.setData({
            hiddenVideo: false
          })
        }
        pid = res.data[0]._id
        that.setData({
          src: res.data[0].video,
          title: res.data[0].title,
          time: res.data[0].time,
          content: res.data[0].content,
          images: res.data[0].images,
          name:res.data[0].name,
          avatarUrl:res.data[0].avatarUrl
        })
      }
    })
  },
  //获取猫咪图片
  getIntroduce(){
    var that = this
    db.collection('introduce').where({
      _id: app.AppData.id
    }).get({
      success(res) {

        if(res.data[0].video == "null") {
          that.setData({
            hiddenVideo: true
          })
        }else{
          that.setData({
            hiddenVideo: false
          })
        }
        console.log("video"+ res.data[0].video)
        that.setData({
          src: res.data[0].video,
        })
        that.setData({
          title: res.data[0].title,
        })
        that.setData({
          content: res.data[0].content,
        })
        that.setData({
          images: res.data[0].images,
        })
        that.setData({
          time: res.data[0].date,
        })
        wx.hideLoading()
      }
    })
  },

  //获取文章收藏情况
  getCollections(){
    var that = this
     db.collection("Collections").where({
       _openid: app.AppData.openid,
       _articleId: app.AppData.id
     }).get({
      success(res){
         console.log(res.data)
         if (res.data.length > 0) {
          that.refreshLikeIcon(true)
        } else {
          that.refreshLikeIcon(false)
        }
      }
     })
  },
  //刷新点赞按钮
  refreshLikeIcon(Like) {
    isLike = Like
    console.log("islike=",isLike)
    this.setData({
      isLike: isLike,
    })
  },

  //收藏或者移除收藏
  onLikeClick: function(event) {
    var that = this
    console.log("isLike=",isLike);
    if(app.AppData.openid == null || app.AppData.openid == ''){
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 1000
      })
    }else{
      if (isLike) {
        // 需要判断是否存在
        that.removeFromCollectServer();
      } else {
        that.saveToCollectServer();
      }
    }
  },

  //收藏文章
  saveToCollectServer: function(event) {
    var that = this
    db.collection('Collections').add({
      data: {
        _articleId: pid,
      },
      success: function(res) {
        that.refreshLikeIcon(true)
      },
    })
  },

  //移除收藏文章
  removeFromCollectServer: function(event) {
    var that = this 
    var id = null
    db.collection('Collections').where({
      _articleId: pid,
    }).get({
      success(res){
        db.collection('Collections').doc(res.data[0]._id).remove({
          success: that.refreshLikeIcon(false)
        })
      }
    })
  },

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