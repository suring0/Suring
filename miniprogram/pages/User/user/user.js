var util = require('../../utils/util.js')
const app = getApp()
const db = wx.cloud.database();
var city,province,country,nickName,avatarUrl,openid
Page({
  data: {
    avatarUrl: '../../../images/user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    login:'点击登录',
    limit: false
  },
  onLoad: function () {
  },
  onShow(){
    this.getUserPower()
  },

  //查询个人管理权限
  getUserPower(){
    var that = this
    db.collection('Users').where({
      _openid: openid
    }).get({
      success:function(res){
        console.log(res.data[0]._isAdmin)
        if(res.data[0]._isAdmin == true){
          that.setData({
            limit: true,
          })
        }else{
          that.setData({
            limit: false,
          })
        }
      }
    })
  },

  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    city = e.detail.userInfo.city 
    province = e.detail.userInfo.province
    country = e.detail.userInfo.country
    app.AppData.nickName = nickName = e.detail.userInfo.nickName 
    app.AppData.avatarUrl = avatarUrl = e.detail.userInfo.avatarUrl

    this.setData({
      avatarUrl: e.detail.userInfo.avatarUrl,
      login: e.detail.userInfo.nickName
    })

    this.onGetOpenid()
  },

  //调用云函数,获取openid
  onGetOpenid() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.AppData.openid = openid = res.result.openid
        this.CheckUserInfo()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  
  //查询用户是否存在
  CheckUserInfo(){
    var that = this
    db.collection("Users").where({
       _userOpenid: openid
    }).get({
      success(res){
        if(res.data.length == 0 ){
          that.AddUserInfo()
        }
      }
    })

  },

  //添加新用户
  AddUserInfo(){
    var time = util.formatTime(new Date());
    db.collection("Users").add({
      data:{
        _userOpenid: openid,
        nickName: nickName,
        city: city,
        province: province,
        country: country,
        avatarUrl: avatarUrl,
        _isAdmin: false,
        _createDate: time
      },success(res){
        console.log("添加新用户成功")
      }
    })
  },

  admin(){
    if(openid == null || openid == ''){
      wx.showToast({
        title: '请点击登录',
        icon: 'none',
        duration: 1000
      })
    }else{
      wx.redirectTo({
        url: "../../Admin/AdminIndex/AdminIndex"
      })
    }
  },
  admin(){
    if(openid == null || openid == ''){
      wx.showToast({
        title: '请点击登录',
        icon: 'none',
        duration: 1000
      })
    }else{
      wx.redirectTo({
        url: "../../User/collect/collect"
      })
    }
  }

})
