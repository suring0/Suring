// pages/allfunction/allfunction.
var app = getApp();
const db = wx.cloud.database()
Page({
  data: {
  },
  onLoad: function (options) {
  },
  onShow: function (options) {
  },

  UsersInfo() {
    wx.navigateTo({
      url: '../../Admin/UsersInfo/UsersInfo',
    })
  },
  Setting(){
    wx.navigateTo({
      url: '../../Admin/Setting/Setting',
    })
  },
  WriteArticle() {
    wx.navigateTo({
      url: '../../Admin/PublicArticle/PublicArticle',
    })
  },

})