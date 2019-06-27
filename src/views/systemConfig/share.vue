<template>
  <div class="websiteBox">
    <h2>分享设置</h2>
    <div class="formBox">
      <Button type="success" style="margin-bottom: 10px;" icon="md-add" @click="add">添加</Button>
      <Table
        :columns="columns"
        :data="data"
      >
        <template slot-scope="{ row }" slot="status">
          <span :style="{'color':row.status==0 ? 'blue':'red'}">{{row.status==0?'开启':'关闭'}}</span>
        </template>
        <template slot-scope="{ row }" slot="buttonUrl">
          <img :src="row.buttonUrl" style="width: 80px">
        </template>
        <template slot-scope="{ row }" slot="imageType">
          <span :style="{'color':row.imageType==1 ? 'blue':'red'}">{{ row.imageType == 1?'短视频封面':'用户头像'}}</span>
        </template>
      </Table>
    </div>
    <Modal v-model="shareWeChat" title="分享设置">
      <div class="fromShow">
        <div class="fromShowL">
          <p>分享内容视频相关信息</p>
          <Form :model="formItem" :label-width="150" >
            <FormItem label="类型名称">
              <Select v-model="formItem.name" style="width:200px">
                <Option v-for="item in shareList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="开启状态">
              <i-switch v-model="formItem.status">
                <span slot="open">开</span>
                <span slot="close">关</span>
              </i-switch>
            </FormItem>
            <FormItem label="分享标题">
              <Input v-model="formItem.title" placeholder="不填写默认为“人人咖短视频”"></Input>
            </FormItem>
            <FormItem label="平台自定义描述">
              <Input v-model="formItem.content" placeholder="不填写默认为“人人咖短视频"></Input>
            </FormItem>
            <FormItem label="分享缩略图">
              <RadioGroup v-model="formItem.imageType" @on-change="shareRadio">
                <Radio label="1">短视频封面</Radio>
                <Radio label="2">用户头像</Radio>
              </RadioGroup>
            </FormItem>
            <div style="height:8px;background:rgba(246,248,255,1);"></div>
            <p>分享内容底部平台信息</p>
            <FormItem label="分享信息底部图标">
              <div class="demo-upload-list" v-for="item in uploadList">
                <template v-if="item.status === 'finished'">
                  <img :src="item.url">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                  </div>
                </template>
                <template v-else>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
              </div>
              <div>
                不填写默认为平台logo , 支持png/jpg，大小不超过2M
              </div>
              <Upload
                ref="upload"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                action="//jsonplaceholder.typicode.com/posts/"
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
              <Modal title="View Image" v-model="visible">
                <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
              </Modal>
            </FormItem>
            <FormItem label="分享信息底部标题">
              <Input v-model="formItem.buttonTitle" placeholder="不填写默认为“人人咖短视频"></Input>
            </FormItem>
          </Form>
        </div>
        <div class="fromShowR">
          <div class="fromShowR_first">
            <p>分享样式示例</p>
            <div class="shareBox">
              <h2>#人人咖短视频#此处为被分享的短视频标题描述</h2>
              <div>
                <span>此处为平台自定义的描述</span>
                <img v-if="imgShow" style="width: 44px;float:right;" src="@/assets/images/img_user.png">
                <img v-if="!imgShow" style="width: 44px;float:right;" src="@/assets/images/img_video.png">
              </div>
              <div style="height: 34px;">
                <img src="../../../src/assets/images/img_renrenka.png" style="width: 34px;vertical-align: middle;margin-right: 15px;">
                <span>人人咖</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" size="large"  @click="handler">提交</Button>
        <Button type="error" size="large"  @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {getShareSetting,postShareSetting}  from '@/api/systemConfig'
  export default {
    data() {
      return {
        shareList: [
          {
            value: '微信分享',
            label: '微信分享'
          },
          {
            value: '微信朋友圈分享',
            label: '微信朋友圈分享'
          },
          {
            value: 'QQ空间分享',
            label: 'QQ空间分享'
          },
          {
            value: '微博分享',
            label: '微博分享'
          },
          {
            value: '站内好友',
            label: '站内好友'
          },
          {
            value: '短信分享',
            label: '短信分享'
          },
          {
            value: '钉钉分享',
            label: '钉钉分享'
          },
          {
            value: '保存到相册',
            label: '保存到相册'
          }
        ],
        columns: [
          {
            title: '分享类型名称',
            key: 'name'
          },
          {
            title: '分享标题',
            key: 'title'
          },
          {
            title: '分享描述',
            key: 'content'
          },
          {
            title: '缩略图',
            slot: 'imageType'
          },
          {
            title: '底部图标',
            slot: 'buttonUrl'
          },
          {
            title: '底部标题',
            key: 'buttonTitle'
          },
          {
            title: '开启状态',
            slot: 'status'
          },
          {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.shareWeChat = true
                      this.formItem.name = params.row.name
                      this.formItem.title = params.row.title
                      this.formItem.imageType = params.row.imageType
                      this.formItem.content = params.row.content
                      this.formItem.buttonTitle = params.row.buttonTitle
                      this.formItem.buttonUrl = params.row.buttonUrl
                      params.row.status === 0 ? this.formItem.status = true:this.formItem.status = false
                    }
                  }
                }, '编辑'),
              ]);
            }
          }
        ],
        data:[],
        shareWeChat:false,
        imgShow:false,
        formItem: {
          name: '',
          title: '',
          imageType: '1',
          content:'',
          buttonTitle:'',
          buttonUrl:'',
          status:true,
        },
        defaultList: [],
        imgName: '',
        visible: false,
        uploadList: []
      }
    },
    mounted () {
      // this.uploadList = this.$refs.upload.fileList;
      this.getData()
    },
    methods: {
      getData(){
        getShareSetting().then(res=>{
          if(res.data.code === 0){
            this.data = res.data.data
          }
        })
      },
      // 缩略图选择
      shareRadio(v){
        v == 2 ? this.imgShow = true : this.imgShow = false
      },
      handler (){
        let obj = Object.assign({}, this.formItem);
       obj.status ? obj.status = 0 :obj.status = 1
        postShareSetting(obj).then(res=>{
          if(res.data.code == 0){
              this.shareWeChat = false
              this.getData()
            this.$Message.success('操作成功！');
              for(var key in this.formItem){
                if(key==='imageType'){
                  this.formItem[key]='1'
                } else if(key==='status'){
                  this.formItem[key]=true
                }else {
                  this.formItem[key]= ''
                }
              }
            }else {
              this.$Message.error('数据请求有误，请重试');
            }
          })
      },
      cancel () {
        this.shareWeChat = false
      },
      add(){
        for(var key in this.formItem){
          if(key==='imageType'){
            this.formItem[key]='1'
          } else if(key==='status'){
            this.formItem[key]=true
          }else {
            this.formItem[key]= ''
          }
        }
        this.shareWeChat = true
      },
      handleView (name) {
        this.imgName = name;
        this.visible = true;
      },
      handleRemove (file) {
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      },
      handleSuccess (res, file) {
        file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
        file.name = '7eb99afb9d5f317c912f08b5212fd69a';
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: 'The file format is incorrect',
          desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
        });
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: 'Exceeding file size limit',
          desc: 'File  ' + file.name + ' is too large, no more than 2M.'
        });
      },
      handleBeforeUpload () {
        const check = this.uploadList.length < 5;
        if (!check) {
          this.$Notice.warning({
            title: 'Up to five pictures can be uploaded.'
          });
        }
        return check;
      }
    },

  }
</script>

<style lang="less" scoped>
  .websiteBox {
    width: 100%;
    height: 100%;
    .formBox {
      position: relative;
      padding: 20px 20px;
      margin-top: 10px;
      background-color: #fff;
      box-shadow: 0px -8px 15px -8px #ccc, -5px 0px 15px -8px #ccc, 5px 0px 15px -8px #ccc, 0px 5px 15px -3px #ccc;
    }
  }
  .weChat {
    overflow: hidden;
  }
  .fromShow{
    display: flex;
    padding: 10px;
    .fromShowL {
      flex: 2;
      p {
        color: #969EB8;
        font-size: 16px;
        border-left: 5px solid #969EB8;
        padding-left: 15px;
        margin: 30px 0;
      }
    }
    .fromShowR {
      padding-left:10px ;
      margin-top: 20px;
      flex: 1;
      .fromShowR_first {
        padding: 20px;
        background-color: #F6F8FF;
        p {
          color: #969EB8;
          font-size: 16px;
          margin-bottom: 10px;
          border-left: 5px solid #969EB8;
          padding-left: 15px;
        }
        .shareBox {
          display: flex;
          flex-direction:column;
          justify-content: space-between;
          background-color: #fff;
          height: 260px;
          padding: 10px;
          span {
            font-size:16px;
            color: #969EB8;
          }
        }
      }
    }
  }
  .ivu-modal-header-inner{
    font-size: 20px;
  }
  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
  .ivu-upload-drag {
    background-image: url("../../../src/assets/images/img_renrenka.png");
    background-size: 100%,100%;
    i {
      display: none;
    }
  }
</style>

