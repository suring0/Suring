let app = getApp()
const db = wx.cloud.database()
var limitpage = 6
var limit 
var temp = []
var totalTopic = {}
var type
var articleType,articleShow
Page({
  data:{
    list:[],
  },
  onLoad: function (options){ //onLoad从二级界面返回时不会刷新
    var that = this
    db.collection('PowerLimit').get({
      success:function(res){
        articleType = res.data[0].articletype //显示内容的类型 0猫咪图片 1文章消息
        articleShow = res.data[0].articleshow //文章的显示风格 0大图标   1详细信息
        if(res.data[0].articletype == 0 && res.data[0].articleshow == 0){ 
          that.setData({
            showlimit: 0,
            title:"猫咪图片"
          })
          that.getIntroduce() 
        }else if(res.data[0].articletype == 0 && res.data[0].articleshow == 1){
          that.setData({
            showlimit: 1,
            title:"猫咪图片"
          })
          that.getIntroduce() 
        }else if(res.data[0].articletype == 1 && res.data[0].articleshow == 0){
          that.setData({
            showlimit: 0,
            title:"文章列表"
          })
          that.getArticle() 
        }else if(res.data[0].articletype == 1 && res.data[0].articleshow == 1){
          that.setData({
            showlimit: 1,
            title:"文章列表"
          })
          that.getArticle() 
        }else if(res.data[0].articletype == 2){
          that.setData({
            showlimit: 2,
          })
          that.getAbout() 
        }

      }
    })
  },
  //分批次获取文章信息
  getArticle(){
    limit = limitpage
    var that = this 
    db.collection('Articles').count({
      success(res) {
        that.data.totalCount = res.total;
      }
    })
    //获取前几条
    db.collection('Articles').where({
      type: 0
    })
    .limit(limitpage) // 限制返回数量
    .orderBy('time', 'desc')
    .get({
      success: function(res) {
        totalTopic  = res.data;
        that.setData({
          list: res.data
        })          
      },
      fail: function(event) {
      }
    })
  },
  //上拉刷新文章信息
  onPullDownRefresh(){
     this.getArticle()
  },
  //下拉加载文章信息
  onReachBottom() {
    if(articleType == 1){
      wx.showLoading({
        title: '加载中',
      })
      var that = this;
      var temp = []
      // 获取后面内容
      if(limitpage < this.data.totalCount){
        db.collection('Articles').where({
          type: 0
        })
          .skip(limit)
          .limit(limitpage) // 限制返回数量
          .orderBy('time', 'desc')	// 排序
          .get({
            success: function (res) {
              if (res.data.length > 0) {
                for(var i=0; i < res.data.length; i++){
                  var tempTopic = res.data[i];
                  temp.push(tempTopic);
                }
                
                totalTopic =  totalTopic.concat(temp);
                console.log(totalTopic);
                that.setData({
                  list: totalTopic,
                })
                wx.hideLoading()
                limit = limit + limitpage
              } else {
                wx.hideLoading()
              }
            },
            fail: function (event) {
              console.log("======" + event);
            }
          })
      }else{
        wx.hideLoading()
      }

    }

  },

  // 跳转至详情页
  check(e){
    app.AppData.id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../User/articleitems/articleitems?articleType=' + articleType,
    })
  },

})