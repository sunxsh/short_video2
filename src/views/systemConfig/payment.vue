<template>
  <div class="websiteBox">
    <h2>支付配置</h2>
    <div class="formBox">
      <div class="weChat">
        <div style="float: left;">
          <div class="iconOpen" @click="isShowWeChat = !isShowWeChat">
            <img v-show="!isShowWeChat" src="@/assets/images/plate_close.png" class="imgShow" >
            <img v-show="isShowWeChat" src="@/assets/images/plate_open_hover.png" class="imgShow">
          </div>
          <h3>微信支付</h3>
          <p>开启后在APP中可以调起微信进行支付</p>
        </div>
        <div class="switchBox" >
          <i-switch v-model="switchWeChat" :disabled="disabledWeChat">
            <span slot="open">开</span>
            <span slot="close">关</span>
          </i-switch>
        </div>
      </div>
      <Form :model="formItem" :label-width="130" v-if="isShowWeChat" class="borderLine" :rules="ruleValidate" ref="formValidate">
        <FormItem label="微信商户名称" prop="merName">
          <Input v-model="formItem.merName" placeholder="请输入微信商户名称..." v-if="isSubmission"></Input>
          <p v-text="formItem.merName" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="微信商户号" prop="merId">
          <Input v-model="formItem.merId" placeholder="请输入微信商户ID..." v-if="isSubmission"></Input>
          <p v-text="formItem.merId" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="商户支付密钥" prop="paySecret">
          <Input v-model="formItem.paySecret" placeholder="请输入微信商户API密钥..." v-if="isSubmission"></Input>
          <p v-text="formItem.paySecret" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="微信AppId" prop="appId">
          <Input v-model="formItem.appId" placeholder="请输入微信AppId..." v-if="isSubmission"></Input>
          <p v-text="formItem.appId" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="微信AppSecret" prop="appSecret">
          <Input v-model="formItem.appSecret" placeholder="请输入微信AppSecret..." v-if="isSubmission"></Input>
          <p v-text="formItem.appSecret" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="CERT证书文件" prop="ext1">
          <Upload action="//jsonplaceholder.typicode.com/posts/" :on-success="successExt1" :on-remove="removeExt1">
            <Button icon="md-add">上传文件</Button>
          </Upload>
          <!--<Input v-model="formItem.ext1" type="file" v-if="isSubmission"></Input>-->
          <p v-text="formItem.ext1" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="KEY密钥文件" prop="ext2">
          <Upload action="//jsonplaceholder.typicode.com/posts/" :on-success="successExt1" :on-remove="removeExt1">
            <Button icon="md-add">上传文件</Button>
          </Upload>
          <p v-text="formItem.ext2" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="ROOT文件" prop="ext3">
          <Upload action="//jsonplaceholder.typicode.com/posts/" :on-success="successExt1" :on-remove="removeExt1">
            <Button icon="md-add">上传文件</Button>
          </Upload>
          <p v-text="formItem.ext3" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem>
          <Button type="primary" v-if="isSubmission" @click="handleWeChat('formValidate')">提交</Button>
          <Button type="primary" v-if="!isSubmission" @click="editWeChat">编辑</Button>
          <!--<Button style="margin-left: 8px" v-if="isSubmission" @click="isSubmission=!isSubmission">取消</Button>-->
        </FormItem>
      </Form>
    </div>
    <div class="formBox">
      <div class="weChat">
        <div style="float: left;">
          <div class="iconOpen" @click="isShowAlipay = !isShowAlipay">
            <img v-show="!isShowAlipay" src="@/assets/images/plate_close.png" class="imgShow" >
            <img v-show="isShowAlipay" src="@/assets/images/plate_open_hover.png" class="imgShow">
          </div>
          <h3>支付宝支付</h3>
          <p>开启后在APP中可以调起支付宝进行支付</p>
        </div>
        <div class="switchBox" >
          <i-switch v-model="switchAlipay" :disabled="disabledAlipay">
            <span slot="open">开</span>
            <span slot="close">关</span>
          </i-switch>
        </div>
      </div>
      <Form :model="formAlipay" :label-width="180" v-if="isShowAlipay" class="borderLine" :rules="ruleAlipay" ref="alipay">
        <FormItem label="合作者身份（PID）" prop="pid">
          <Input v-model="formAlipay.pid" placeholder="请输入微信商户名称..." v-if="isSubAlipay"></Input>
          <p v-text="formAlipay.pid" v-if="!isSubAlipay" class="subInfo"></p>
        </FormItem>
        <FormItem label="登录账号" prop="loginNum">
          <Input v-model="formAlipay.loginNum" placeholder="请输入微信商户ID..." v-if="isSubAlipay"></Input>
          <p v-text="formAlipay.loginNum" v-if="!isSubAlipay" class="subInfo"></p>
        </FormItem>
        <FormItem label="安全校验码（Key）" prop="key">
          <Input v-model="formAlipay.key" placeholder="请输入微信商户API密钥..." v-if="isSubAlipay"></Input>
          <p v-text="formAlipay.key" v-if="!isSubAlipay" class="subInfo"></p>
        </FormItem>
        <FormItem label="支付账户姓名" prop="ext1">
          <Input v-model="formAlipay.ext1" placeholder="请输入支付宝实名认证的名称" v-if="isSubAlipay"></Input>
          <p style="color: #969EB8" v-if="isSubAlipay">支付宝实名认证的名称(个人就填写个人姓名,企业就填写企业名称 , 要与支付宝上面的认证姓名一致)</p>
          <p v-text="formAlipay.pid" v-if="!isSubAlipay" class="subInfo"></p>
        </FormItem>
        <FormItem>
          <Button type="primary" v-if="isSubAlipay" @click="handleAlipay('alipay')">提交</Button>
          <Button type="primary" v-if="!isSubAlipay" @click="editAlipay">编辑</Button>
          <!--<Button style="margin-left: 8px" v-if="isSubAlipay" @click="isSubAlipay=!isSubAlipay">取消</Button>-->
        </FormItem>
      </Form>
    </div>
    <div class="formBox">
      <div class="weChat">
        <div style="float: left;">
          <div class="iconOpen" @click="isShowUnionPay = !isShowUnionPay">
            <img v-show="!isShowUnionPay" src="@/assets/images/plate_close.png" class="imgShow" >
            <img v-show="isShowUnionPay" src="@/assets/images/plate_open_hover.png" class="imgShow">
          </div>
          <h3>银联支付</h3>
          <p>开启后，在APP中可以添加银行卡进行支付</p>
        </div>
        <div class="switchBox" >
          <i-switch v-model="switchUnionPay" :disabled="disabledUnionPay" >
            <span slot="open">开</span>
            <span slot="close">关</span>
          </i-switch>
        </div>
      </div>
      <Form :model="formUnionPay" :label-width="180" v-if="isShowUnionPay" class="borderLine" :rules="ruleUnionPay" ref="unionPay">
        <FormItem label="银联商户号" prop="merId">
          <Input v-model="formUnionPay.merId" placeholder="请输入银联商户号" v-if="isSubUnionPay"></Input>
          <p v-text="formUnionPay.merId" v-if="!isSubUnionPay" class="subInfo"></p>
        </FormItem>
        <FormItem label="签名密码" prop="certPwd">
          <Input v-model="formUnionPay.certPwd" placeholder="请输入签名密码" v-if="isSubUnionPay"></Input>
          <p v-text="formUnionPay.certPwd" v-if="!isSubUnionPay" class="subInfo"></p>
        </FormItem>
        <FormItem>
          <Button type="primary" v-if="isSubUnionPay" @click="handleUnionPay('unionPay')">提交</Button>
          <Button type="primary" v-if="!isSubUnionPay" @click="editUnionPay">编辑</Button>
          <!--<Button style="margin-left: 8px" v-if="isSubUnionPay" @click="isSubUnionPay=!isSubUnionPay">取消</Button>-->
        </FormItem>
      </Form>
    </div>
    <div class="formBox">
      <div class="weChat">
        <div style="float: left;">
          <div class="iconOpen" @click="isShowQuick = !isShowQuick">
            <img v-show="!isShowQuick" src="@/assets/images/plate_close.png" class="imgShow" >
            <img v-show="isShowQuick" src="@/assets/images/plate_open_hover.png" class="imgShow">
          </div>
          <h3>快钱打钱</h3>
          <p>开启之后，佣金打款，可以使用快钱</p>
        </div>
        <div class="switchBox" >
          <i-switch v-model="switchQuick" :disabled="disabledQuick" >
            <span slot="open">开</span>
            <span slot="close">关</span>
          </i-switch>
        </div>
      </div>
      <Form :model="formQuick" :label-width="180" v-if="isShowQuick" class="borderLine" :rules="ruleQuick" ref="quickMoney">
        <FormItem label="商户号" prop="merId">
          <Input v-model="formQuick.merId" placeholder="请输入商户号" v-if="isSubQuick"></Input>
          <p v-text="formQuick.merId" v-if="!isSubQuick" class="subInfo"></p>
        </FormItem>
        <FormItem label="签名密码" prop="certPwd">
          <Input v-model="formQuick.certPwd" placeholder="请输入签名密码" v-if="isSubQuick"></Input>
          <p v-text="formQuick.certPwd" v-if="!isSubQuick" class="subInfo"></p>
        </FormItem>
        <FormItem>
          <Button type="primary" v-if="isSubQuick" @click="handleQuick('quickMoney')">提交</Button>
          <Button type="primary" v-if="!isSubQuick" @click="editQuick">编辑</Button>
          <!--<Button style="margin-left: 8px" v-if="isSubQuick" @click="isSubQuick=!isSubQuick">取消</Button>-->
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
  import { postPaySetting,getPaySetting }  from '@/api/systemConfig'
  export default {
    data() {
      return {
        disabledUnionPay:false,
        disabledAlipay:false,
        disabledWeChat:false,
        disabledQuick:false,
        isSubmission:true,
        isSubAlipay:true,
        isSubUnionPay:true,
        isSubQuick:true,
        switchWeChat: false,
        switchAlipay: false,
        switchUnionPay: false,
        switchQuick: false,
        isShowWeChat:false,
        isShowAlipay:false,
        isShowUnionPay:false,
        isShowQuick:false,
        formItem: {
          name:'微信支付',
          merName: '',
          merId: '',
          paySecret: '',
          appId:'',
          appSecret: '',
          ext1:'',
          ext2:'',
          ext3:'',
          isOpen:0
        },
        formAlipay: {
          name:'支付宝支付',
          pid: '',
          loginNum: '',
          key: '',
          ext1:'',
          isOpen:0
        },
        formUnionPay: {
          name:'银联支付',
          merId: '',
          certPwd: '',
          isOpen:0
        },
        formQuick: {
          name:'快钱支付',
          merId: '',
          certPwd: '',
          isOpen:0
        },
        ruleValidate: {
          merName: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          merId: [
            {required: true, message: '输入框内容不能为空',trigger: 'blur'},
          ],
          paySecret: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          appId: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          appSecret: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
        },
        ruleAlipay: {
          pid: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          loginNum: [
            {required: true, message: '输入框内容不能为空',trigger: 'blur'},
          ],
          key: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          ext1: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
        },
        ruleUnionPay: {
          merId: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          certPwd: [
            {required: true, message: '输入框内容不能为空',trigger: 'blur'},
          ]
        },
        ruleQuick: {
          merId: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          certPwd: [
            {required: true, message: '输入框内容不能为空',trigger: 'blur'},
          ]
        },
      }
    },
    mounted(){
      this.getConfig()
    },
    methods: {
      // 拉取配置
      getConfig(){
        getPaySetting().then(res=>{
          if(res.data.code === 0){
            res.data.data.forEach(item=>{
              if(item.name === '微信支付'){
                item.isOpen ? this.switchWeChat = false : this.switchWeChat = true
                this.formItem = item
                this.isSubmission = false
                this.disabledWeChat = true
              }
              if(item.name === '支付宝支付'){
                item.isOpen ? this.switchAlipay = false : this.switchAlipay = true
                this.formAlipay = item
                this.isSubAlipay = false
                this.disabledAlipay = true
              }
              if(item.name === '银联支付'){
                item.isOpen ? this.switchUnionPay = false : this.switchUnionPay = true
                this.formUnionPay = item
                this.isSubUnionPay = false
                this.disabledUnionPay = true
              }
            })
          }else{
              this.isSubmission = true
              this.isSubAlipay = true
              this.isSubUnionPay = true
          }
        })
      },
      // 证书上传
      successExt1(response, file, fileList){
        console.log(response);
      },
      removeExt1(file, fileList){},
      // 支付提交
      handleWeChat (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.switchWeChat ? this.formItem.isOpen = 0 : this.formItem.isOpen = 1
            postPaySetting(this.formItem).then(res=>{
              if(res.data.data != '保存成功'){
                this.$Message.error(res.data.data);
              }else {
                this.$Message.success(res.data.data);
                this.isSubmission = !this.isSubmission
                this.disabledWeChat = true
              }
            })
          } else {
            this.$Message.error('请完善信息!');
          }
        })
      },
      handleAlipay (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.switchAlipay ? this.formAlipay.isOpen = 0 : this.formAlipay.isOpen = 1
            postPaySetting(this.formAlipay).then(res=>{
              if(res.data.data != '保存成功'){
                this.$Message.error(res.data.data);
              }else {
                this.$Message.success(res.data.data);
                this.isSubAlipay = !this.isSubAlipay
                this.disabledAlipay = true
              }
            })
          } else {
            this.$Message.error('请完善信息!');
          }
        })
      },
      handleUnionPay (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.switchUnionPay ? this.formUnionPay.isOpen = 0 : this.formUnionPay.isOpen = 1
            postPaySetting(this.formUnionPay).then(res=>{
              if(res.data.data != '保存成功'){
                this.$Message.error(res.data.data);
              }else {
                this.$Message.success(res.data.data);
                this.isSubUnionPay = !this.isSubUnionPay
                this.disabledUnionPay = true
              }
            })
          } else {
            this.$Message.error('请完善信息!');
          }
        })
      },
      handleQuick (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.switchQuick ? this.formQuick.isOpen = 0 : this.formQuick.isOpen = 1
            postPaySetting(this.formQuick).then(res=>{
              if(res.data.data != '保存成功'){
                this.$Message.error(res.data.data);
              }else {
                this.$Message.success(res.data.data);
                this.isSubUnionPay = !this.isSubUnionPay
                this.disabledUnionPay = true
              }
            })
          } else {
            this.$Message.error('请完善信息!');
          }
        })
      },
      // 编辑
      editUnionPay(){
        this.isSubUnionPay = !this.isSubUnionPay
        this.disabledUnionPay = false
      },
      editQuick(){
        this.isSubQuick = !this.isSubQuick
        this.disabledQuick = false
      },
      editWeChat(){
        this.isSubmission = true
        this.disabledWeChat = false
      },
      editAlipay(){
        this.isSubAlipay = !this.isSubAlipay
        this.disabledAlipay = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .switchBox {
    float: right;
    margin-top: 10px;
  }
  .imgShow {
    width:50%;
    cursor:pointer;
  }
  .iconOpen {
    position:absolute;
    position: absolute;
    left: 20px;
    top: 26px;
  }
  .subInfo {
    color: #969EB8;
    font-size: 16px;
    text-decoration:underline;
  }
  .borderLine {
    margin-top: 10px;
    border-top: 1px solid #E7E7EF;
    padding-top: 20px;
  }
  .websiteBox {
    padding-bottom: 30px;
    padding-right: 80px;
    padding-left: 20px;
    .formBox {
      position: relative;
      padding: 20px 50px;
      margin-top: 15px;
      background-color: #fff;
      box-shadow: 0px -8px 15px -8px #ccc, -5px 0px 15px -8px #ccc, 5px 0px 15px -8px #ccc, 0px 5px 15px -3px #ccc;
      .ivu-form-item-content {
        width: auto;
      }
    }
  }
.weChat {
  overflow: hidden;
}
</style>

