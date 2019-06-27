<template>
  <div class="websiteBox">
    <h2>网站设置</h2>
    <div class="formBox">
      <Form :model="formItem" :label-width="180" :rules="ruleValidate" ref="formValidate" >
        <FormItem label="公司名称：" prop="companyName">
          <Input v-model="formItem.companyName" placeholder="请输入公司名称" v-if="isSubmission"></Input>
          <p v-text="formItem.companyName" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="站点标题：" prop="title">
          <Input v-model="formItem.title" placeholder="请输入站点标题" v-if="isSubmission"></Input>
          <p v-text="formItem.title" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="站点标语：" prop="slogan">
          <Input v-model="formItem.slogan" placeholder="请输入站点标语" v-if="isSubmission"></Input>
          <p v-text="formItem.slogan" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="站点公告：" prop="closedAnnouncement">
          <Input v-model="formItem.closedAnnouncement" placeholder="请输入站点公告" v-if="isSubmission"></Input>
          <p v-text="formItem.closedAnnouncement" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="标志图片：" prop="logoUrl">
          <Upload action="//jsonplaceholder.typicode.com/posts/" v-if="isSubmission">
            <Button icon="md-add">上传图片</Button>
          </Upload>
          <div v-if="!isSubmission" style="width: 80px;height: 80px;margin-top: 8px;">
            <img :src="formItem.logoUrl" style="width: 100%">
          </div>
        </FormItem>
        <FormItem label="主页地址：" prop="homepage">
          <Input v-model="formItem.homepage" placeholder="请输入站点标语" v-if="isSubmission"></Input>
          <p v-text="formItem.homepage" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="网站头部标签：" prop="metaTags">
          <Input v-model="formItem.metaTags" placeholder="请输入站点标语" v-if="isSubmission"></Input>
          <p v-text="formItem.metaTags" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="网站默认关键词：" prop="metaKeywords">
          <Input v-model="formItem.metaKeywords" placeholder="请输入站点标语" v-if="isSubmission"></Input>
          <p style="color: #969EB8" v-if="isSubmission">关键词以空格隔开，最好10个以下，搜索引擎将忽略过多的关键词</p>
          <p v-text="formItem.metaKeywords" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="网站默认描述："  prop="metaDescription">
          <Input v-model="formItem.metaDescription" placeholder="请输入站点标语" v-if="isSubmission"></Input>
          <p style="color: #969EB8" v-if="isSubmission">140-200个字符或者100个左右的汉字</p>
          <p v-text="formItem.metaDescription" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="网站编码：" prop="metaCharset">
          <Input v-model="formItem.metaCharset" placeholder="请输入网站编码" v-if="isSubmission"></Input>
          <p v-text="formItem.metaCharset" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="当前使用的语言：" prop="langCurrent">
          <Input v-model="formItem.langCurrent" placeholder="请输入当前使用的语言" v-if="isSubmission"></Input>
          <p v-text="formItem.langCurrent" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="站点状态：" prop="status">
          <RadioGroup v-model="formItem.status" v-if="isSubmission">
            <Radio label='0'>运营中</Radio>
            <Radio label='1'>关闭</Radio>
            <Radio label='2'>暂停</Radio>
          </RadioGroup>
          <p  v-if="!isSubmission" class="subInfo">
            <span v-if="formItem.status === '0'">运营中</span>
            <span v-if="formItem.status === '1'">关闭</span>
            <span v-if="formItem.status === '2'">暂停</span>
          </p>
        </FormItem>
        <FormItem label="网站底部信息：" prop="footinfo">
          <Input v-model="formItem.footinfo" placeholder="请输入网站底部信息" v-if="isSubmission"></Input>
          <p v-text="formItem.footinfo" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="网站翻译引擎：" prop="langTranslater">
          <Input v-model="formItem.langTranslater" placeholder="请输入网站翻译引擎" v-if="isSubmission"></Input>
          <p v-text="formItem.langTranslater" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="应用程序名称：" prop="appname">
          <Input v-model="formItem.appname" placeholder="请输入应用程序名称" v-if="isSubmission"></Input>
          <p v-text="formItem.appname" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="应用程序版本：" prop="appversion">
          <Input v-model="formItem.appversion" placeholder="请输入应用程序版本" v-if="isSubmission"></Input>
          <p v-text="formItem.appversion" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem>
          <Button type="primary"  v-if="isSubmission" @click="handleSubmit('formValidate')"> 提交</Button>
          <!--<Button  v-if="isSubmission" @click="isSubmission=!isSubmission" style="margin-left: 20px;"> 取消</Button>-->
          <Button type="primary"  v-if="!isSubmission" @click="isSubmission=!isSubmission">编辑</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
  import { tbSiteSetting,getSiteSetting }  from '@/api/systemConfig'
  export default {
    data() {
      return {
        flag:false,
        isSubmission:false,
        formItem: {
          companyName: '',
          title: '',
          slogan:'',
          langTranslater: '',
          logoUrl:'',
          homepage:'',
          metaTags:'',
          metaKeywords:'',
          metaDescription:'',
          metaCharset:'',
          langCurrent:'',
          status:'0',
          footinfo:'',
          appname:'',
          appversion:'',
          closedAnnouncement:''
        },
        ruleValidate: {
          companyName: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          slogan: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          langTranslater: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          homepage: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          metaTags: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          metaKeywords: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          metaDescription: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' },
            { type: 'string', max: 200, message: '最多两百字', trigger: 'change' }
          ],
          metaCharset: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          langCurrent: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          footinfo: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          language: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          appname: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          appversion: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          closedAnnouncement: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          status:[
            { required: true, message: '请选择状态', trigger: 'change' }
          ],
          logoUrl:[
            { required: true, message: '请上传图标', trigger: 'blur' }
          ]
        }
      }
    },
    mounted(){
      this.getSet()
    },
    methods:{
      getSet(){
        getSiteSetting().then(res=>{
          if(res.data.code == 0){
            for(let key in res.data.data){
              if(res.data.data[key] === 0) {res.data.data[key] = true}
              if(res.data.data[key] === 1){res.data.data[key] = false}
            }
            this.formItem = res.data.data
          }
          if(res.data.msg === '查询数据不存在' ){
            this.isSubmission = true
          }
        }).catch(error=> {
          this.isSubmission = true
        });
      },
      // 提交
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if(this.formItem.logoUrl == '') return this.$Message.error('请上传图标!');
              tbSiteSetting(this.formItem).then(res=>{
                if(res.data.code == 0){
                  this.$Message.success('提交成功!');
                  this.isSubmission = !this.isSubmission
                }
              })
          } else {
            this.$Message.error('请完善信息!');
          }
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .subInfo {
    color: #969EB8;
    font-size: 16px;
    text-decoration:underline;
  }
  .websiteBox {
    padding-right: 80px;
    padding-left: 20px;
    .formBox {
      border-radius: 4px;
      padding: 50px 50px 20px 50px;
      margin-top: 15px;
      background-color: #fff;
      box-shadow:0px 0px 8px rgba(23,0,255,0.1);
      .ivu-form-item-content {
        width: auto;
      }
    }
  }
</style>

