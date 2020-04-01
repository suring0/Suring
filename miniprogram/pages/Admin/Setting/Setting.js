// pages/SystemSetting/SystemSetting.js
const app = getApp();
const db = wx.cloud.database();

var v1,v2,v3
var limit1,limit2,limit3
Page({
  data: {
    //array1: ['允许', '拒绝'],
    array2: ['风格一', '风格二'],
    array3: ['文章信息', '猫咪物语'],
  },
  onShow: function (options) {
    var that = this
    db.collection('PowerLimit').get({
      success(res) {
        limit1 = res.data[0].updataInfolimit
        limit2 = res.data[0].articleshow
        limit3 = res.data[0].articletype
        if (res.data[0].articleshow == 0) {
          that.setData({
            Varieties2: '风格一'
          })
        }else{
          that.setData({
            Varieties2: '风格二'
          })
        }
        if (res.data[0].articletype == 1){
          that.setData({
            Varieties3: '文章信息'
          })
        }else{
          that.setData({
            Varieties3: '猫咪物语'
          })
        }
      }
    })
  },
 
  varietiesChange1(e) {
    var Varieties1 = this.data.array1[parseInt(e.detail.value)]
    v1 = Varieties1
    console.log(v1)
    if (v1 == '允许') {
      wx.cloud.callFunction({
        name: 'Powerlimit2',
        data: {
          limit2: 1
        },
        success: res => {
          console.log(res)
          this.setData({
            Varieties1: Varieties1
          })
        }
      })
    }else{
      wx.cloud.callFunction({
        name: 'Powerlimit2',
        data: {
          limit2: 0
        },
        success: res => {
          console.log(res)
          this.setData({
            Varieties1: Varieties1
          })
        }
      })
    }
  },
  
  //消息显示形式
  varietiesChange2(e) {
    var that = this
    var Varieties2 = this.data.array2[parseInt(e.detail.value)]
    v2 = Varieties2
    console.log(v2)
    if(limit2 == 2){
      that.setData({
        Varieties2: Varieties2
      })
    }else{
      if (v2 == '风格一') {
        db.collection("PowerLimit").doc('a6539511-305b-49d6-b0ff-be9e3e58297e').update({
          data:{
             articleshow: 0,
          },success(res){
            console.log(res)
            that.setData({
              Varieties2: Varieties2
            })
          }
        })
      } else {
        db.collection("PowerLimit").doc('a6539511-305b-49d6-b0ff-be9e3e58297e').update({
          data:{
             articleshow: 1,
          },success(res){
            console.log(res)
            that.setData({
              Varieties2: Varieties2
            })
          }
        })
      }
    }
  },

  //消息显示内容
  varietiesChange3(e) {
    var that = this
    var Varieties3 = this.data.array3[parseInt(e.detail.value)]
    v3 = Varieties3
    console.log(v3)
    if (v3 == '文章信息') {
      db.collection("PowerLimit").doc('a6539511-305b-49d6-b0ff-be9e3e58297e').update({
        data:{
           articleshow: 0,
        },success(res){
          console.log(res)
          that.setData({
            Varieties3: Varieties3
          })
        }
      })
    }else{
      db.collection("PowerLimit").doc('a6539511-305b-49d6-b0ff-be9e3e58297e').update({
        data:{
           articleshow: 1,
        },success(res){
          console.log(res)
          that.setData({
            Varieties3: Varieties3
          })
        }
      })
    }
  },
  updatapwd() {
    wx.navigateTo({
      url: '../Updatapwd/Updatapwd',
    })
  },
})