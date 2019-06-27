<template>
  <div class="websiteBox">
    <h2>网站安全配置</h2>
    <div class="formBox">
      <Form :model="formItem" :label-width="180" :rules="ruleValidate" ref="formValidate" >
        <FormItem label="允许注册">
          <i-switch v-model="formItem.allowRegist" size="large" :disabled="disabled">
            <span slot="open">开</span>
            <span slot="close">关</span>
          </i-switch>
        </FormItem>
        <FormItem label="登录验证码">
          <i-switch v-model="formItem.captchaStatus" size="large"  :disabled="disabled">
            <span slot="open">开</span>
            <span slot="close">关</span>
          </i-switch>
        </FormItem>
        <FormItem label="加密密匙" prop="encryptKey">
          <Input v-model="formItem.encryptKey" placeholder="请输入加密密匙" v-if="isSubmission"></Input>
          <p v-text="formItem.encryptKey" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="数据库备份根目录" prop="backupRoot">
          <Input v-model="formItem.backupRoot" placeholder="请输入数据库备份根目录" v-if="isSubmission"></Input>
          <p v-text="formItem.backupRoot" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="会话数据前缀" prop="sessionPrefix">
          <Input v-model="formItem.sessionPrefix" placeholder="请输入会话数据前缀" v-if="isSubmission"></Input>
          <p v-text="formItem.sessionPrefix" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="管理员邮箱" prop="manageEmail">
          <Input v-model="formItem.manageEmail" placeholder="请输入管理员邮箱" v-if="isSubmission"></Input>
          <p v-if="isSubmission" style="color: #969EB8">注意：仅支持网易，腾讯，谷歌邮箱。</p>
          <p v-text="formItem.manageEmail" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem label="管理员手机号" prop="manageMobile">
          <Input v-model="formItem.manageMobile" placeholder="请输入管理员手机号" v-if="isSubmission"></Input>
          <p v-text="formItem.manageMobile" v-if="!isSubmission" class="subInfo"></p>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')" v-if="isSubmission">提交</Button>
          <!--<Button style="margin-left: 8px" @click="isSubmission = !isSubmission" v-if="isSubmission">取消</Button>-->
          <Button type="primary"  @click="editor" v-if="!isSubmission">编辑</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
  import { getSecurity,postSecurity }  from '@/api/systemConfig'
  export default {
    data() {
      return {
        disabled: false,
        isSubmission:false,
        formItem: {
          backupRoot: '',
          manageEmail: '',
          manageMobile:'',
          sessionPrefix:'',
          encryptKey: '',
          allowRegist: false,
          captchaStatus: false,
        },
        ruleValidate: {
          encryptKey: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          backupRoot: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          manageEmail: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          manageMobile: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
          sessionPrefix: [
            { required: true, message: '输入框内容不能为空', trigger: 'blur' }
          ],
        }
      }
    },
    mounted(){
      this.getSet()
    },
    methods: {
      getSet(){
        getSecurity().then(res=>{
          if(res.data.msg === '查询数据不存在'){
            this.isSubmission = true
          }
          if(res.data.code == 0){
            for(let key in res.data.data){
              if(res.data.data[key] === 0) {res.data.data[key] = true}
              if(res.data.data[key] === 1){res.data.data[key] = false}
            }
            this.formItem = res.data.data
            this.disabled = true
          }
        }).catch(error=> {
          this.isSubmission = true
        });
      },
      // 提交
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let obj = Object.assign({}, this.formItem);
            for(let key in obj){
              if(obj[key] === true) {obj[key] = 0}
              if(obj[key] === false){obj[key] = 1}
            }
            postSecurity(obj).then(res=>{
              console.log(res)
            })
            this.isSubmission = false
            this.disabled = true
            this.$Message.success('提交成功!');
          } else {
            this.$Message.error('请完善信息!');
          }
        })
      },
      editor(){
        this.isSubmission = !this.isSubmission
        this.disabled = false
      }
    }
  }
</script>

<style lang="less" scoped>
  .subInfo {
    color: #969EB8;
    font-size: 16px;
    text-decoration:underline;
  }
  .websiteBox {
    padding-bottom: 30px;
    padding-right: 80px;
    padding-left: 20px;
    .formBox {
      padding: 50px;
      border-radius: 4px;
      margin-top: 15px;
      background-color: #fff;
      box-shadow: 0px -8px 15px -8px #ccc, -5px 0px 15px -8px #ccc, 5px 0px 15px -8px #ccc, 0px 5px 15px -3px #ccc;
      .ivu-form-item-content {
        width: auto;
      }
    }
  }

</style>

