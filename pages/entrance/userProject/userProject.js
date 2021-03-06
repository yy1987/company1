import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();


Page({

  data: {
    mainData:[],
    isFirstLoadAllStandard:['getMainData'],
  },

  onLoad: function () {
    const self = this;

    api.commonInit(self);  	
    self.getMainData();
  },


  getMainData(){
    const  self =this;
     if(wx.getStorageSync('entrance_info').info.phone.length == 0){
    	api.showToast('请补全信息','none',2000,function(){
    		api.pathTo('/pages/entrance/userInfor/userInfor','redi')
    	});
    	return;
    };
    const postData={};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id,
      contactPhone:wx.getStorageSync('entrance_info').info.phone
    };
    postData.getBefore ={
     caseData:{
        tableName:'label',
        searchItem:{
          title:['=',['项目管理']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.articleGet(postData,callback);
  },


  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll&&self.data.buttonCanClick){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


})
