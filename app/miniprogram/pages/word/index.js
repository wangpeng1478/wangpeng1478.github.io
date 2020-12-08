const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    jt:'等风来不如追风去'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const Info = await App.UserInfo();
    if (Info.openid) {
      this.setData({
        userInfo: Info
      })
      this.sampleJt();
    } else {
      wx.showToast({
        title: '获取用户信息失败',
        icon: 'none'
      })
    }
  },
  sampleJt(){
    const db = wx.cloud.database();
    db.collection('jt')
        .aggregate()
        .sample({
          size: 1
        })
        .end()
        .then(res=>{
          if(res.errMsg==="collection.aggregate:ok"){
            try {
              console.log(res);
              this.setData({
                jt:res.list[0].n
              })
            } catch (error) {}
          }
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