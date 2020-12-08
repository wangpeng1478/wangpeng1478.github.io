
const App = getApp();
const translatePlugin = requirePlugin('translate-plugin');
const { richTextChange } = require('../../libs/tools');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    richTextList:[],
    nodes:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const Info = await App.UserInfo();
    if(Info.openid){
      this.setData({
        userInfo:Info
      })
    }else{
      wx.showToast({
        title: '获取用户信息失败',
        icon: 'none'
      })
    }
   
    const db = wx.cloud.database()
    db.collection('word').doc('e62469b25fc85aa200c0454979a5079a').get().then(res => {
      console.log(res)
      if(res.errMsg==="document.get:ok"){
        try {
          let explanation = JSON.parse(res.data.explanation||"[]");
          explanation.forEach((element,index) => {
            element.title = richTextChange(element.title);
            element.desc = richTextChange(element.desc);
          });
          this.setData({
            richTextList:explanation
          });
          wx.nextTick(()=>{
            
          })
       } catch (error) {
         console.log(error);
       }
      }
    }).catch(err=>{
        console.log(err);
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const userInfo = this.data.userInfo;
    console.log(userInfo);
    translatePlugin.init({
      openid:userInfo.openid
    })
  },
  translate(){
    // translatePlugin.detectLang({
    //   type: 1, // type为0表示直接返回语种检测的结果，1表示返回阈值大于90的检测结果
    //   text: 'background-color'
    // }).then(res => {
    //   console.log('detectLang res', res)
    // })
    translatePlugin.translate({
      query: 'background-color',
      to:'zh'
    }).then(res => {
      console.log('translate res', res)
    })
  },
  playTTS(){
    translatePlugin.playTTS({
      text: 'background-color',
      onPlay(){
        console.log('onPlay');
      },
      onPause(){
        console.log('onPause');
      },
      onStop(){
        console.log('onStop');
      },
      onEnded(){
        console.log('onEnded');
      }
    }).then(res => {
      console.log('播放成功啦', res)
    })
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