const translatePlugin = requirePlugin('translate-plugin');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name: {
      type: String,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    loading:true,
    playing:false
  },
  ready(){
    const userInfo = wx.getStorageSync('UserInfo');
    if(userInfo.openid){
      translatePlugin.init({
        openid:userInfo.openid
      })
      this.setData({
        loading:false
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    play(e){
      const vm = this;
      let PlayTime;
      let EndTime;
      const {loading,playing} = this.data;
      if(loading){
        return;
      }
      this.setData({loading:true})
      const name = e.currentTarget.dataset.name;
      translatePlugin.playTTS({
        text:name,
        onPlay(){
          PlayTime = new Date().getTime();
          vm.setData({playing:true});
          console.log('onPlay');
        },
        onPause(){
          console.log('onPause');
        },
        onStop(){
          console.log('onStop');
        },
        onEnded(){
          EndTime = new Date().getTime();
          const duration = EndTime-PlayTime;
          if(duration>1000){
           vm.setData({playing:false});
          }else{
            setTimeout(()=>{
              vm.setData({playing:false});
            },1000-duration)
          }
        }
      }).then(res => {
         console.log('播放成功啦', res)
         this.setData({loading:false})
      })
    }
  }
})
