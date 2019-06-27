<template>
  <div>
    <h2>短信设置</h2>
    <div class="explain">
      <div class="msgBox">
        <h4>短信提醒配置说明</h4>
        <p> 短信提醒现支持 <span>阿里云短信（新版）、腾讯云</span>两家行业领先接口，接口所有参数需在此处设置。</p>
        <p>参数设置：在此页面开启所需的服务商API并设置服务商提供的参数。</p>
      </div>
      <img src="@/assets/images/img_explain.png">
    </div>
    <div class="fromBox">
        <div class="top">
          <p>阿里云短信（新版）<a href="https://account.aliyun.com/login/login.htm?oauth_callback=https%3A%2F%2Fhome.console.aliyun.com%2F" target="_blank">立即申请 >></a></p>
          <div>
            <i-switch v-model="alipayFrom.status" :disabled="disabledAlipay">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </div>
        </div>
      <div style=" padding-top: 40px;">
        <Form :model="alipayFrom" :label-width="180" :rules="ruleValidate" ref="formValidate">
          <FormItem label="Access Key ID" prop="key">
            <Input v-model="alipayFrom.key" v-if="isSubmission"></Input>
            <p v-text="alipayFrom.key" v-if="!isSubmission" class="subInfo"></p>
          </FormItem>
          <FormItem label="Access Key Secret" prop="keySecret">
            <Input v-model="alipayFrom.keySecret" v-if="isSubmission"></Input>
            <p v-text="alipayFrom.keySecret" v-if="!isSubmission" class="subInfo"></p>
          </FormItem>
          <FormItem>
            <Button type="primary" v-if="isSubmission" @click="handleAlipay('formValidate')">提交</Button>
            <!--<Button style="margin-left: 8px" v-if="isSubmission" @click="isSubmission=!isSubmission">取消</Button>-->
            <Button type="primary" v-if="!isSubmission" @click="editAlipay">编辑</Button>
          </FormItem>
        </Form>
      </div>
    </div>
    <div class="fromBox">
      <div class="top">
        <p>腾讯云 <a href="https://cloud.tencent.com/?fromSource=gwzcw.2212127.2212127.2212127&utm_medium=cpd&utm_id=gwzcw.2212127.2212127.2212127" target="_blank"> 立即申请 >></a></p>
        <div>
          <i-switch v-model="tencentFrom.status" :disabled="disabledTencent">
            <span slot="open">开</span>
            <span slot="close">关</span>
          </i-switch>
        </div>
      </div>
      <div style=" padding-top: 40px;">
        <Form :model="tencentFrom" :label-width="180" :rules="ruleTencent" ref="formTencent">
          <FormItem label="Access Key ID" prop="key">
            <Input v-model="tencentFrom.key" v-if="isSubTencent"></Input>
            <p v-text="tencentFrom.keySecret" v-if="!isSubTencent" class="subInfo"></p>
          </FormItem>
          <FormItem label="Access Key Secret" prop="keySecret">
            <Input v-model="tencentFrom.keySecret" v-if="isSubTencent"></Input>
            <p v-text="tencentFrom.keySecret" v-if="!isSubTencent" class="subInfo"></p>
          </FormItem>
          <FormItem>
            <Button type="primary" v-if="isSubTencent" @click="handleTencent('formTencent')">提交</Button>
            <!--<Button style="margin-left: 8px" v-if="isSubTencent" @click="clear('formTencent')">取消</Button>-->
            <Button type="primary" v-if="!isSubTencent" @click="editTencent">编辑</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>
<script>
  import {postMessageSetting,getMessageFindAll}  from '@/api/systemConfig'
  export default {
    data() {
      return {
        disabledAlipay:false,
        disabledTencent:false,
        isSubmission:false,
        isSubTencent:false,
        alipayFrom: {
          key: '',
          name: '阿里云短信（新版）',
          keySecret: '',
          status:true
        },
        tencentFrom: {
          key: '',
          name: '腾讯云',
          keySecret: '',
          status:true
        },
        ruleValidate: {
          key: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          keySecret: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
        },
        ruleTencent: {
          key: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          keySecret: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
        },
      }
    },
    mounted () {
      this.getData()
    },
    methods:{
      getData(){
        getMessageFindAll().then(res=>{
          if(res.data.code === 0){
            res.data.data.forEach(item=>{
                if(item.name === '腾讯云'){
                  this.tencentFrom = item
                  item.status ? item.status = false : item.status = true
                  this.isSubmission = false
                  this.disabledTencent = true
                }
                if(item.name === '阿里云短信（新版）'){
                  this.alipayFrom = item
                  item.status ? item.status = false : item.status = true
                  this.isSubTencent = false
                  this.disabledAlipay = true
                }
              })
          }
        }).catch(error=>{
          this.isSubTencent = true
          this.isSubmission = true
        })
      },
      // 提交
      handleAlipay (name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            let obj = {...this.alipayFrom}
            obj.status ? obj.status = 0 :obj.status = 1
            postMessageSetting(obj).then(res=>{
              if(res.data.data !== '保存成功！'){
                this.$Message.error(res.data.data);
              }else {
                this.$Message.success(res.data.data);
                this.isSubmission = false
                this.disabledAlipay = true
              }
            })
          } else {
            this.$Message.error('请完善信息!');
          }
        })
      },
      handleTencent (name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            let obj = {...this.tencentFrom}
            obj.status ? obj.status = 0 :obj.status = 1
            postMessageSetting(obj).then(res=>{
              if(res.data.data !== '保存成功！'){
                this.$Message.error(res.data.data);
              }else {
                this.$Message.success(res.data.data);
                this.isSubTencent = false
                this.disabledTencent = true
              }
            })
          } else {
            this.$Message.error('请完善信息!');
          }
        })
      },
      // 编辑
      editAlipay(){
        this.isSubmission = true
        this.disabledAlipay = false
      },
      editTencent(){
        this.isSubTencent = true
        this.disabledTencent = false
      },
    }
  }
</script>

<style lang="less" scoped>
  .explain {
    min-width: 1292px;
    display: flex;
    height: 143px;
    margin-top: 20px;
    justify-content:space-between;
    background: linear-gradient(to right, #FF5C00 , #FEB231);
    box-shadow:0px 0px 1px 1px #F66B1D;
    .msgBox {
      margin:30px;
      font-family:Microsoft YaHei;
      h4 {
        font-size: 18px;
        color: #fff;
        font-weight: 400;
      }
      p {
        font-size: 16px;
        color: #FFD4BA;
        line-height:30px;
        white-space:nowrap;
        span {
          color: #FEE201;
        }
      }
    }
    img {
      height: 100% ;
      vertical-align: middle
    }
  }
  .fromBox {
    background-color: #fff;
    padding: 50px;
    margin-top: 30px;
    box-shadow:0px 0px 2px 2px #E7E7EF;
    .top {
      display: flex;
      justify-content:space-between;
      border-bottom: 1px solid #ccc;
      p {
        font-family:Microsoft YaHei;
        font-size: 18px;
        color: #656D8B;
        margin-bottom: 30px;
        a {
          color: #3447FF;
          font-size: 14px;
        }
      }
    }
  }
  .subInfo {
    color: #969EB8;
    font-size: 16px;
    text-decoration:underline;
  }
</style>

