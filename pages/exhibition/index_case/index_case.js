import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({
  data: {
    artData:[],
    mainData:[],
    complete_api:[],
    indicatorDots: true,
    autoplay: true,
    intervalOne:2000,
    duration: 1000,
  },
  //事件处理函数


  onLoad() {
    const self = this;
    wx.showLoading();
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getArtData();
    self.getMainData();
  },

  getMainData(isNew){
    const self = this;
     if(isNew){
      api.clearPageIndex(self);
    }
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.exhibition_thirdapp_id
    };
    postData.getBefore = {
      mainData:{
        tableName:'label',
        searchItem:{
          title:['=',['案例列表']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      self.data.complete_api.push('getMainData');
      self.setData({
        web_mainData:self.data.mainData,
      });
      self.checkLoadComplete();
    };
    api.articleGet(postData,callback);
  },

  getArtData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.exhibition_thirdapp_id
    };
    postData.getBefore = {
      article:{
        tableName:'label',
        searchItem:{
          title:['=',['公司案例detail']],
          thirdapp_id:['=',[getApp().globalData.exhibition_thirdapp_id]],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      self.data.artData = {};
      if(res.info.data.length>0){
        self.data.artData = res.info.data[0];
        self.data.artData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      };
      self.data.complete_api.push('getArtData');
      self.setData({
        web_artData:self.data.artData,
      });
      self.checkLoadComplete();  
    };
    api.articleGet(postData,callback);
  },

  checkLoadComplete(){
    const self = this;
    var complete = api.checkArrayEqual(self.data.complete_api,['getMainData','getArtData']);
    if(complete){
      wx.hideLoading();
    };
  },
 
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


  intoPathRedi(e){
    const self = this;
    wx.navigateBack({
      delta:1
    })
  },

  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
 
})

  

  