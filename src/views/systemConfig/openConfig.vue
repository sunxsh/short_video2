<template>
  <div class="websiteBox">
    <h2>开放登录配置表</h2>
    <div class="formBox">
      <Button type="success" style="margin-bottom: 10px;" icon="md-add" @click="add">添加</Button>
      <Table
        :columns="columns"
        :data="data"
      >
        <template slot-scope="{ row }" slot="autologin">
          <span :style="{'color':row.autologin==0 ? 'blue':'red'}">{{row.autologin==0?'开启':'关闭'}}</span>
        </template>
        <template slot-scope="{ row }" slot="status">
          <span :style="{'color':row.status==0 ? 'blue':'red'}">{{row.status==0?'开启':'关闭'}}</span>
        </template>
      </Table>
    </div>
    <Modal v-model="modal1" title="添加配置">
      <Form :model="formItem" :label-width="130" style="padding-left: 30px;padding-right: 30px;" ref="formValidate" :rules="ruleValidate">
        <FormItem label="自动登录">
          <i-switch v-model="formItem.autologin" size="large" >
            <span slot="open">开</span>
            <span slot="close">关</span>
          </i-switch>
        </FormItem>
        <FormItem label="状态">
          <i-switch v-model="formItem.status" size="large" >
            <span slot="open">开</span>
            <span slot="close">关</span>
          </i-switch>
        </FormItem>
        <FormItem label="名称" prop="name">
        <Input v-model="formItem.name" placeholder="请输入名称" ></Input>
        </FormItem>
        <FormItem label="应用ID" prop="clientId">
        <Input v-model="formItem.clientId" placeholder="请输入应用ID" ></Input>
        </FormItem>
        <FormItem label="应用密码" prop="clientSecret">
        <Input v-model="formItem.clientSecret" placeholder="请输入应用密码" ></Input>
        </FormItem>
        <FormItem label="网站验证" prop="verification">
        <Input v-model="formItem.verification" placeholder="请输入网站验证" ></Input>
        </FormItem>
        <FormItem label="回调地址" prop="callbackUrl">
        <Input v-model="formItem.callbackUrl" placeholder="请输入回调地址"></Input>
        </FormItem>
        <FormItem label="网页组件" prop="widget">
        <Input v-model="formItem.widget" placeholder="请输入微信商户API密钥" ></Input>
        </FormItem>
        <FormItem label="排列次序" prop="sort">
        <Input v-model="formItem.sort" placeholder="请输入排列次序" ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
      <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
      <Button @click="handleReset('formValidate')" >取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import { getOauthSetting,postOauthSetting,putOauthSetting,deleteOauthSetting }  from '@/api/systemConfig'
  export default {
    data() {
      return {
        flag:false,
        columns: [
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '应用ID',
            key: 'clientId'
          },
          {
            title: '应用密码',
            key: 'clientSecret'
          },
          {
            title: '网站验证',
            key: 'verification'
          },
          {
            title: '回调地址',
            key: 'callbackUrl'
          },
          {
            title: '网页组件',
            key: 'widget'
          },
          {
            title: '自动登录',
            slot: 'autologin'
          },
          {
            title: '排列次序',
            key: 'sort'
          },
          {
            title: '状态',
            slot: 'status',
          },
          {
            title: '操作',
            key: 'action',
            width: 100,
            fixed: 'right',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginTop:'10px',
                    marginBottom: '10px',
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      this.modal1 = true
                      this.formItem.id=params.row.id
                      this.formItem.name=params.row.name
                      this.formItem.clientId=params.row.clientId
                      this.formItem.clientSecret=params.row.clientSecret
                      this.formItem.verification=params.row.verification
                      this.formItem.widget=params.row.widget
                      this.formItem.callbackUrl=params.row.callbackUrl
                      this.formItem.sort=params.row.sort
                      params.row.status==0?this.formItem.status = true :this.formItem.status = false
                      params.row.autologin==0?this.formItem.autologin = true :this.formItem.autologin = false
                      this.flag = false
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    marginBottom: '10px'
                  },
                  //on就是用来绑定事件的
                  on: {
                    //获取当前行信息，并更新赋值
                    click: () => {
                      if(params.row.isDelete==="删除"){
                        return this.$Modal.error({"title":"该条数据已删除"})
                      }
                      this.$Modal.confirm({"title":"是否确认删除？",
                        onOk: () => {
                          deleteOauthSetting(params.row.id).then(res=>{
                            console.log(res);
                            if(res.data.code===0){
                              this.$Message.info("删除成功")
                              this.getSet()
                            }
                          })
                        },
                        onCancel: () => {}
                      })
                    }
                  }
                }, '删除'),
              ]);
            }
          }
        ],
        data:[],
        modal1: false,
        formItem: {
          id:'',
          name:'',
          status: false,
          autologin: false,
          clientId: '',
          clientSecret:'',
          verification:'',
          callbackUrl:'',
          widget:'',
          sort:'',
        },
        ruleValidate: {
          name: [
            { required: true, message: '输入框不能为空', trigger: 'blur' }
          ],
          clientId: [
            { required: true, message: '输入框不能为空', trigger: 'blur' }
          ],
          clientSecret: [
            { required: true, message: '输入框不能为空', trigger: 'blur' }
          ],
          verification: [
            { required: true, message: '输入框不能为空', trigger: 'blur' }
          ],
          callbackUrl: [
            { required: true, message: '输入框不能为空', trigger: 'blur' }
          ],
          widget: [
            { required: true, message: '输入框不能为空', trigger: 'blur' }
          ],
          sort: [
            { required: true, message: '输入框不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    mounted(){
      this.getSet()
    },
    methods: {
      getSet(){
        getOauthSetting().then(res=>{
          if(res.data.code === 0){
            this.data = res.data.data
          }
        })
      },
      add(){
        this.modal1 = true
        this.flag = true
      },
      // 提交
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let obj = {...this.formItem}
            for(let key in obj){
              if(obj[key] === true) {obj[key] = 0}
              if(obj[key] === false){obj[key] = 1}
            }
            // 添加确定
            if(this.flag){
              postOauthSetting(obj).then(res=>{
                console.log(res);
                if(res.data.code === 0){
                  this.modal1 = false
                  this.getSet()
                  this.$refs[name].resetFields();
                  this.$Message.info('添加成功');
                }
              })
            }else { //编辑确定
              putOauthSetting(obj).then(res=>{
                if(res.data.code === 0){
                  this.modal1 = false
                  this.getSet()
                  this.$refs[name].resetFields();
                  this.$Message.info('编辑成功');
                }
              })
            }
          } else {
            this.$Message.error('请完善表单!');
          }
        })
      },
      // 取消
      handleReset (name) {
        this.modal1 = false
        this.$refs[name].resetFields();
        this.getSet()
      },
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
    .formBox {
      position: relative;
      padding: 20px ;
      margin-top: 15px;
      background-color: #fff;
      box-shadow: 0px -8px 15px -8px #ccc, -5px 0px 15px -8px #ccc, 5px 0px 15px -8px #ccc, 0px 5px 15px -3px #ccc;
    }
  }

</style>

