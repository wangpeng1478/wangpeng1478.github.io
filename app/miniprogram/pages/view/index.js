const App = getApp();
const translatePlugin = requirePlugin('translate-plugin');
const { richTextChange } = require('../../libs/tools');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    userInfo:{},
    info:{},
    richTextList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const Info = await App.UserInfo();
    if (Info.openid && options.id) {
      console.log(options.id);
      this.setData({
        id:options.id,
        userInfo: Info
      });
      this.getInfo(options.id);
    } else {
      this.navigateBackModal('页面参数错误');
    }
  },
  navigateBackModal(content) {
    let pagesLength = getCurrentPages().length;
    wx.showModal({
      title: '提示',
      content,
      showCancel: false,
      confirmText: pagesLength<=1?"去首页":"返回",
      success(res) {
        if(pagesLength<=1){
          wx.reLaunch({
            url: `/pages/word/index`
          })
        }else{
          wx.navigateBack();
        }
        
      }
    })
  },
  getInfo(id){
    const db = wx.cloud.database()
    db.collection('word').doc(id).get().then(res => {
      console.log(res)
      if(res.errMsg==="document.get:ok"){
        try {
          let explanation = JSON.parse(res.data.explanation||"[]");
          explanation.forEach((element,index) => {
            element.title = richTextChange(element.title);
            element.desc = richTextChange(element.desc);
          });
          res.data.name = unescape(res.data.name);
          res.data.translation = unescape(res.data.translation);
          res.data.explanation = explanation;
          this.setData({
            info:res.data
          });
          wx.nextTick(()=>{
            
          })
       } catch (error) {
        this.navigateBackModal('请求失败,请稍后再试');
       }
      }
    }).catch(err=>{
      this.navigateBackModal('请求失败,请稍后再试');
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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