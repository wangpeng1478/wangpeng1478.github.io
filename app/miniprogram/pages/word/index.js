const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    jt:'等风来不如追风去',
    cardCur: 0,
    typeList:[],
    typeLoading:true,
    heatLoading: true,
    heatList: [],
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
      this.getType();
      this.getHeat();
    } else {
      wx.showToast({
        title: '获取用户信息失败',
        icon: 'none'
      })
    }
  },
  goview(e){
    let id = e.currentTarget.dataset.id;
    if(id){
      wx.navigateTo({
        url:`/pages/view/index?id=${id}`
      })
    }
  },
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
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
  getType(){
    const db = wx.cloud.database();
    this.setData({
      typeLoading: true
    });
    db.collection('type')
      .orderBy('sort', 'desc')
      .get().then(res => {
        if (res.errMsg === "collection.get:ok") {
          try {
            let data = res.data || [];
            let list = [];
            data.forEach((element, index) => {
              element.name = unescape(element.name);
              element.translation = unescape(element.translation);
              list.push(element);
            });
            console.log(list);
            this.setData({
              typeList: list,
              typeLoading: false
            })
          } catch (error) {
            wx.vibrateShort();
            console.log(error);
            this.setData({
              typeLoading: false
            });
          }
        }
      }).catch(err => {
        wx.vibrateShort();
        console.log(err);
        this.setData({
          typeLoading: false
        });
      })
  },
  showSort(){
    var vm = this;
    wx.showActionSheet({
      itemList: ['查看人数', '赞赏', '批评'],
      success (res) {
        let sortName = "view"
        if(res.tapIndex===0){
            sortName = "view";
        }else if(res.tapIndex===1){
          sortName = "praise";
        }else if(res.tapIndex===2){
          sortName = "critique";
        }
        wx.vibrateShort();
        vm.getHeat(sortName);
      }
    })
  },
  getHeat(sortName="view") {
    this.setData({ heatLoading: true});
    const db = wx.cloud.database();
    db.collection('word')
      .where({
        show: true
      })
      .field({
        explanation: false
      })
      .orderBy(sortName, 'desc')
      .get().then(res => {
        if (res.errMsg === "collection.get:ok") {
          try {
            let data = res.data || [];
            let list = [];
            data.forEach((element, index) => {
              element.name = unescape(element.name);
              element.translation = unescape(element.translation);
              list.push(element);
            });
            console.log(list);
            this.setData({
              heatList: list,
              heatLoading: false
            })
          } catch (error) {
            wx.vibrateShort();
            console.log(error);
            this.setData({
              heatLoading: false
            });
          }
        }
      }).catch(err => {
        wx.vibrateShort();
        console.log(err);
        this.setData({
          heatLoading: false
        });
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