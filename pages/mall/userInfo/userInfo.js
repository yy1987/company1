import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    sForm:{
      phone:'',
      name:'', 
      gender:'', 
      passage1:'',
      address:''  
    },
    mainData:{},
    isFirstLoadAllStandard:['userInfoGet'],
  },


  onLoad(){
    
    const self = this;
    api.commonInit(self);
    self.userInfoGet();
    
  },

 getPhoneNumber: function (e) {
	console.log(e.detail.iv);
	console.log(e.detail.encryptedData);
	wx.login({
		success: res => {
			console.log(res.code);
			wx.request({
			    url: 'https://api.solelycloud.com/api/public/index.php/api/v1/Base/ProgrameToken/get',
			    method:'POST',
			    data: {
					'encryptedData': encodeURIComponent(e.detail.encryptedData),
					'iv': e.detail.iv,
					'code': res.code
				},
			       
			success: function (res) {
				console.log(res)
				if (res.solely_code ==100000) {//我后台设置的返回值为1是正确
				//存入缓存即可
					wx.setStorageSync('phone', res.phone);
				}
			},
			fail: function (err) {
				console.log(err);
			}
			})
		}
	})
},


  userInfoGet(){
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getMallToken';
    const callback = (res)=>{
      console.log(res)
      self.data.mainData = res;
      self.data.sForm.phone = res.info.data[0].info.phone;
      self.data.sForm.name = res.info.data[0].info.name;
      self.data.sForm.gender = res.info.data[0].info.gender;
      self.data.sForm.address = res.info.data[0].info.address
      self.setData({
        web_sForm:self.data.sForm,
        web_mainData:self.data.mainData
      });
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'userInfoGet',self);
    };
    api.userGet(postData,callback);
  },


  changeBind(e){
    const self = this;
    if(api.getDataSet(e,'value')){
      self.data.sForm[api.getDataSet(e,'key')] = api.getDataSet(e,'value');
    }else{
      api.fillChange(e,self,'sForm');
    };
    console.log(self.data.sForm);
    self.setData({
      web_sForm:self.data.sForm,
    });  
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


  userInfoUpdate(){

    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('mall_token');
    postData.data = {};
    postData.data = api.cloneForm(self.data.sForm);
    const callback = (data)=>{
      if(data.solely_code==100000){
        api.showToast('完善成功','none');
        setTimeout(function(){
          api.pathTo('/pages/User/user','redi')
        },1000);  
      }else{
        api.showToast('网络故障','none')
      };
      api.buttonCanClick(self,true)
    };
    api.userInfoUpdate(postData,callback);

  },
  

  

  submit(){
    const self = this;
    api.buttonCanClick(self);
    var phone = self.data.sForm.phone;
    const pass = api.checkComplete(self.data.sForm);
    if(pass){
      if(phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)){
        api.showToast('手机格式不正确','none')
      }else{
        self.userInfoUpdate();   
      }
    }else{
      api.showToast('请补全信息','none');
    };
  },

  bindDateChange(e) {
    const self = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    self.data.sForm.passage1 =  e.detail.value;
    self.setData({
      web_sForm: self.data.sForm
    })
    console.log(self.data.sForm)
  },
 
})
