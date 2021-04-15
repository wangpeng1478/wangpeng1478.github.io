const App = getApp();
const { richTextChange } = require('../../libs/tools');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    keyword: '',
    heatLoading: true,
    loading: false,
    keywordShow:false,
    keywordListNull: false,
    searchFocus: false,
    keywordList: [],
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
      this.getHeat();
    } else {
      wx.showToast({
        title: '获取用户信息失败',
        icon: 'none'
      })
    }
  },
  bindinputSearch(e) {
    this.setData({
      keyword: e.detail.value
    })
    this.search();
  },
  bindfocusSearch() {
    this.setData({
      keywordShow:true,
      searchFocus: true
    })
    const {keywordList} = this.data;
    if(keywordList.length===0){
      this.search();
    }
  },
  bindblurSearch() {
    this.setData({
      searchFocus: false
    })
  },
  cancel(){
    wx.vibrateShort();
    this.setData({
      keyword:"",
      keywordShow:false,
      searchFocus: false
    })
  },
  search() {
    const getInf = (str, key) => str.toString().replace(new RegExp(`${key}`, 'g'), `%%${key}%%`).split('%%');
    const keyword = this.data.keyword || '';
    this.setData({
      loading: true,
      keywordListNull: false
    });
    const db = wx.cloud.database();
    db.collection('word').where({
      show: true,
      name: new db.RegExp({
        regexp: keyword,
        options: 'i',
      }),
    })
      .field({
        explanation: false
      })
      .orderBy('sort', 'desc')
      .get().then(res => {
        if (res.errMsg === "collection.get:ok") {
          try {
            let data = res.data || [];
            let list = [];
            data.forEach((element, index) => {
              element.nameArr = getInf(unescape(element.name), keyword)
              element.name = unescape(element.name);
              element.translation = unescape(element.translation);
              list.push(element);
            });
            this.setData({
              loading: false,
              keywordList: list,
              keywordListNull: list.length === 0
            });
          } catch (error) {
            console.log(error);
            wx.vibrateShort();
            wx.showToast({
              title: '请求失败',
              icon: 'none'
            })
            this.setData({
              loading: false,
              keywordListNull: false
            });
          }
        }
      }).catch(err => {
        wx.vibrateShort();
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        })
        console.log(err);
        this.setData({
          loading: false,
          keywordListNull: false
        });
      })

  },
  getHeat() {
    this.setData({
      heatList:[],
      heatLoading: false
    })
  },
  goview(e){
    let id = e.currentTarget.dataset.id;
    if(id){
      wx.navigateTo({
        url:`/pages/view/index?id=${id}`
      })
    }
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