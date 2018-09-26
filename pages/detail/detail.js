import {Api} from '../../utils/api.js';
var api = new Api();
var app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();


Page({


  data: {
    mainData:[],
    chooseId:[],
    tabCurrent:0,
    isShow:false,
    labelData:[],
    complete_api:[],
    keys:[],
    values:[],
    skuData:[],
    count:1
  },
  
  onLoad(options){
    const self = this;
    wx.showLoading();
    if(!wx.getStorageSync('token')){
      var token = new Token();
      token.getUserInfo();
    };
    self.setData({
      fonts:app.globalData.font,
    })
    if(options.id){
      self.data.id = options.id
    };
    self.getMainData();
    if(wx.getStorageSync('collectData')[self.data.id]){
      self.setData({
        url: '/images/collect1.png',
      });
    }else{
      self.setData({
        url: '/images/collect.png',
      });
    };
    wx.showShareMenu({
      withShareTicket: true
    });
  },


  userInfo:function(){
    wx.navigateTo({
      url:'/pages/userInfo/userInfo'
    })
  },

  collect(){
    const self = this;
    const id = self.data.id;
    if(wx.getStorageSync('collectData')&&wx.getStorageSync('collectData')[id]){
      api.deleteFootOne(id,'collectData');
      self.setData({
        url: '/images/collect.png',
      });
    }else{
      api.footOne(self.data.mainData,'id',100,'collectData');  
      self.setData({
        url: '/images/collect1.png',
      });
    };
  },

  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
    };
    postData.getBefore={
      sku:{
        tableName:'sku',
        searchItem:{
          id:['in',[self.data.id]]
        },
        fixSearchItem:{
          status:1
        },
        key:'product_no',
        middleKey:'product_no',
        condition:'in',
      } 
    };
    postData.getAfter={
      sku:{
        tableName:'sku',
        middleKey:'product_no',
        key:'product_no',
        condition:'=',
        searchItem:{
          status:['in',[1]]
        },
      } 
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
        for(var key in self.data.mainData.label){    
          self.data.keys.push(key);    
          self.data.values.push(self.data.mainData.label[key]);   
        };
        for (var i = 0; i < self.data.mainData.sku_array.length; i++) {
          for (var j = 0; j < self.data.keys.length; j++) {
            if(self.data.mainData.sku_array[i]==self.data.keys[j]){
              self.data.labelData.push(self.data.values[j])
            } 
          }
        };
        for (var i = 0; i < self.data.mainData.sku.length; i++) {
          if(self.data.mainData.sku[i].id==self.data.id){
            self.data.skuData.push(self.data.mainData.sku[i])
          }
        }
        self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
        self.data.complete_api.push('getMainData')
      }else{
        api.showToast('商品信息有误','none')
      }

      self.setData({
        web_skuData:self.data.skuData[0],
        web_labelData:self.data.labelData,
        web_mainData:self.data.mainData,
      });
      self.checkLoadComplete();
    };
    api.productGet(postData,callback);
  },



  counter(e){
    const self = this;
    if(api.getDataSet(e,'type')=='+'){
      self.data.skuData[0].count++;
    }else if(self.data.skuData[0].count > '1'){
      self.data.skuData[0].count--;
    }
    console.log(self.data.skuData[0].count)
    self.setData({
      web_skuData:self.data.skuData[0],
    });
    self.countTotalPrice();
  },

  bindManual(e) {
    const self = this;
    var count = e.detail.value;
    self.setData({
      count:count
    });

  },

  countTotalPrice(){  
    const self = this;
    var totalPrice = 0;
    totalPrice += self.data.skuData[0].count*parseFloat(self.data.skuData[0].price);
    self.data.totalPrice = totalPrice;
    self.setData({
      web_totalPrice:self.data.totalPrice.toFixed(2)
    });
  },

  

  goBuy:function(){
    var isShow = !this.data.isShow;
    this.setData({
      isShow:isShow
    })
  },

  close:function(){
    this.setData({
      isShow:false
    })
  },

  chooseType(e){
    const self = this;
    self.data.chooseId = []
    self.data.chooseId.push(e.currentTarget.dataset.id);
    self.setData({
      web_chooseId:chooseId
    })

  },

  onShareAppMessage(res){
    const self = this;
     console.log(res)
      if(res.from == 'button'){
        self.data.shareBtn = true;
      }else{   
        self.data.shareBtn = false;
      }
      return {
        title: '纯粹科技',
        path: 'pages/detail/detail?id='+self.data.id,
        success: function (res){
          console.log(res);
          console.log(parentNo)
          if(res.errMsg == 'shareAppMessage:ok'){
            console.log('分享成功')
            if (self.data.shareBtn){
              if(res.hasOwnProperty('shareTickets')){
              console.log(res.shareTickets[0]);
                self.data.isshare = 1;
              }else{
                self.data.isshare = 0;
              }
            }
          }else{
            wx.showToast({
              title: '分享失败',
            })
            self.data.isshare = 0;
          }
        },
        fail: function(res) {
          console.log(res)
        }
      }
  },

  checkLoadComplete(){
    const self = this;
    var complete = api.checkArrayEqual(self.data.complete_api,['getMainData']);
    if(complete){
      wx.hideLoading();
    };
  },

})
