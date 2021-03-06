import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    num:'',
    isShow:false,
    complete_api:[],
    searchItem:{},
  },
  //事件处理函数

  show:function(e){
    var isShow = !this.data.isShow;
    this.setData({
      isShow:isShow
    })
  },
  close:function(e){
     this.setData({
      isShow:false,
    })
  },
  onLoad(options) {
    const self = this;
    self.data.id = options.id;
    self.getMainData()
    self.setData({
      img:app.globalData.hotel,
    });
  },

  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.hotel_thirdapp_id,
      id:self.data.id
    };
    postData.getAfter={
      sku:{
        tableName:'sku',
        middleKey:'product_no',
        key:'product_no',
        condition:'=',
      } 
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
        self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      }else{
        api.showToast('门店不存在','none');
      }
      self.data.complete_api.push('getMainData')
      console.log(self.data.mainData)
      self.setData({
        web_skuData:self.data.mainData.sku[0],
        web_num:self.data.mainData.sku[0].id,
        web_mainData:self.data.mainData,
      });  
     self.checkLoadComplete()
    };
    api.productGet(postData,callback);
  },  


  getSkuData(){
    const self = this;
    const postData = {};
    postData.searchItem = api.cloneForm(self.data.searchItem)
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.skuData = res.info.data[0];
      }else{
        api.showToast('数据错误','none');
      }
      console.log(self.data.mainData)
      self.setData({
        web_skuData:self.data.skuData,
      });  
    };
    api.skuGet(postData,callback);
  },

  checkLoadComplete(){
    const self = this;
    var complete = api.checkArrayEqual(self.data.complete_api,['getMainData']);
    if(complete){
      wx.hideLoading();
      self.data.buttonClicked = false;
    };
  },

  menuClick: function (e) {
    const self = this;
    const num = e.currentTarget.dataset.num;
    self.changeSearch(num);
  },


  changeSearch(num){
    const self = this;
    self.setData({
      web_num: num
    });
    self.data.searchItem.id = num;
    self.getSkuData(true);
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
})

  