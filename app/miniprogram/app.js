//app.js
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'jy-9g3ldpcae419218f',
        traceUser: true,
      })
    }
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  },
  UserInfo(data={type:'get'}){
    return new Promise((resolve)=>{
      wx.showLoading({
        title: 'Loading',
        mask:true
      })
      let info = {};
      try {
        var userInfo = wx.getStorageSync('UserInfo')
        if (userInfo) {
          resolve(userInfo);
          wx.hideLoading()
        }else{
          wx.cloud.callFunction({
            name: 'user',
            data
          }).then(res => {
            if(res.errMsg==="cloud.callFunction:ok"){
              info = res.result;
              wx.setStorageSync('UserInfo', info);
              resolve(info);
              wx.hideLoading()
            }else{
              resolve(info);
              wx.hideLoading()
            }
          }).catch(err => {
            console.log(err)
            resolve(info);
            wx.hideLoading()
          })
        }
      } catch (e) {
        console.log(e)
        resolve(info);
        wx.hideLoading()
      }
    })
    
  }
})

