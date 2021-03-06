import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({
  data: {
    caseData:[],
    isFirstLoadAllStandard:['getMainData'],
  },



  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.getMainData()
    if(options.scene){
      var scene = decodeURIComponent(options.scene)
    };
    if(options.parentNo){
      var scene = options.parentNo
    };
    if(options.passage1){
      var scene = options.passage1
    };
    
    if(scene){
      var num = scene.search('_');
      var sceneNew = scene.substring(0,scene.length-1);

      if(num==-1){
        var token = new Token({parent_no:scene}); 
      }else{
        var token = new Token({passage1:sceneNew}); 
      }   
      token.getMallToken();
      console.log('getToken',sceneNew)
    };
  },

  getMainData(){
    const self = this;
    const postData = {};
    postData.paginate = self.data.paginate;
    postData.searchItem = {
      thirdapp_id:getApp().globalData.mall_thirdapp_id
    };
    postData.getBefore = {
      caseData:{
        tableName:'label',
        searchItem:{
          title:['=',['案例展示']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.caseData.push.apply(self.data.caseData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_caseData:self.data.caseData,
      });
    };
    api.articleGet(postData,callback);
  },

  onShareAppMessage(res){
    const self = this;
    return {
      title: '纯粹科技',
      path: 'pages/mall/index/index?parentNo='+wx.getStorageSync('info').user_no,
      success: function (res){
        console.log(res);
      }
    }
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

  intoPathRedi(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },

})
