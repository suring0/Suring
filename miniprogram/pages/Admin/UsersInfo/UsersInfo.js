let  app = getApp()
const db = wx.cloud.database()
var limitpage = 5
var limit 
var temp = []
var totalTopic = {}
Page({
  data:{
  },
  onLoad: function (options){ //onLoad从二级界面返回时不会刷新
    this.getUsers()
  },
  //分批次获取用户信息
  getUsers(){
    limit = limitpage
    var that = this 
    db.collection('Users').count({
      success(res) {
        that.data.totalCount = res.total;
      }
    })
    //获取前几条
    db.collection('Users')
    .limit(limitpage) // 限制返回数量
    .orderBy('_createDate', 'desc')
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
     this.getUsers()
  },

  //下拉加载用户信息
  onReachBottom() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var temp = []
    // 获取后面内容
    if(limitpage < this.data.totalCount){
      db.collection('Users')
        .skip(limit)
        .limit(limitpage) // 限制返回数量
        .orderBy('_createDate', 'desc')	// 排序
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

  },

  // 修改用户管理员身份
  check(e){
    var that = this
    var admin
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '您确定变更该用户身份？',
      success: function (res) {
        if (res.confirm) {

          db.collection('Users').where({
            _id: id
          }).get({
            success(res){
              admin = !res.data[0]._isAdmin
              console.log(res.data[0]._isAdmin)
              db.collection("Users").doc(id).update({
                data:{
                  _isAdmin: admin
                },success(res){
                  console.log(res)
                  that.getUsers()
                }
              })
            }
          })

        }
      }
    })

  },

})