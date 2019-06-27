<template>
  <div>
    <div id="btn">
      <Button type="primary" @click="ModifyDelShortVideoMusic">批量删除</Button>
      <Button type="primary" @click="ModifyDelUnrecShortVideoMusic">批量删除(不可恢复)</Button>
      <Button type="primary">视频信任用户</Button>
    </div>
    <div id="isShow">
      显示多选框：
      <i-switch v-model="showSelection" style="margin-right: 5px;margin-bottom:5px;"></i-switch>显示文件地址：
      <i-switch v-model="showFileurl" style="margin-right: 5px;margin-bottom:5px;"></i-switch>
    </div>
    <!-- Table -->
    <Button type="primary" class="upload-music" @click="openUploadForm">添加音乐</Button>
    <div>
      <Card style="width:100%">
        <Table
          stripe
          highlight-row
          ref="tables"
          :data="newTableData"
          :columns="newcolumns"
          :loading="isLoading"
          @on-selection-change="handleSelectionChange"
        ></Table>
        <change-page :totalPage="dataCount" @getPages="handlePage" @changes="handleChange"></change-page>
      </Card>
    </div>
    <!-- 查看详情弹出框 -->
    <Modal
      title="查看详情"
      v-model="modalDetil"
      :mask-closable="false"
      @on-ok="asyncOK('formCustom')"
      :width="widthForm"
      :styles="{top: '20px'}"
      :scrollable="true"
      >
      <Form ref="formCustom" :model="formCustom" :label-width="100" inline>
        <FormItem label="音乐编号">
          <Input type="text" v-model="formCustom.id" disabled/>
        </FormItem>
        <FormItem label="音乐名称">
          <Input type="text" v-model="formCustom.name" disabled/>
        </FormItem>
        <FormItem label="音乐作者">
          <Input type="text" v-model="formCustom.author" disabled/>
        </FormItem>
        <FormItem label="相关用户编号">
          <Input type="text" v-model="formCustom.userid" disabled/>
        </FormItem>
        <!--  //0 非原创  1原创  -->
        <FormItem label="是否原创">
          <Select v-model="formCustom.isoriginal" disabled>
            <Option
              :value="item.value"
              v-for="item in isoriginalOpt"
              :key="item.value"
            >{{item.content}}</Option>
          </Select>
        </FormItem>
        <FormItem label="文件地址">
          <Input type="text" v-model="formCustom.fileurl" disabled/>
        </FormItem>
        <FormItem label="分类编号">
          <Input type="text" v-model="formCustom.classid" disabled/>
        </FormItem>
        <FormItem label="创建时间">
          <Input type="text" v-model="formCustom.createtime" disabled/>
        </FormItem>
        <FormItem label="引用次数">
          <Input type="text" v-model="formCustom.count" disabled/>
        </FormItem>
        <FormItem label="音乐封面">
          <Input type="text" v-model="formCustom.picture" disabled/>
        </FormItem>
        <FormItem label="音乐时长">
          <Input type="text" v-model="formCustom.length" disabled/>
        </FormItem>
        <!-- '审核状态 0 未审核 1 已审核' -->
        <FormItem label="审核状态">
          <Select v-model="formCustom.reviewStatus" disabled>
            <Option
              :value="item.value"
              v-for="item in reviewStatusOpt"
              :key="item.value"
            >{{item.content}}</Option>
          </Select>
        </FormItem>
        <!-- '删除标记 0 未删除  1 删除' -->
        <FormItem label="删除标记">
          <Select v-model="formCustom.isDelete" disabled>
            <Option
              :value="item.value"
              v-for="item in isDeleteOpt"
              :key="item.value"
            >{{item.content}}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <!-- 查看视频详情弹出框 -->
    <Modal
      v-model="modalMusicInfo"
      title="查看音乐详情"
      :closable="false"
      :mask-closable="false"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <aplayer ref="aplayers" autoplay v-if="isMusicPlayerShow" :music="musicPlayer"/>
    </Modal>
    <!-- 音乐上传 -->
    <Modal v-model="uploadMusicForm" title="音乐上传" :loading="addMusicLoading" @on-ok="submitAddMusic">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" label-position="right">
        <FormItem label="音乐名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="作者" prop="author">
            <Input v-model="formValidate.author" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="音乐类型" prop="classid">
            <Select v-model="formValidate.classid" placeholder="请选择" @on-change="classChange" :label-in-value="true">
                <Option v-for="item in newClassList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="上传音乐封面">
            <Upload :action="baseUrl.uploadUrl+'/tQiniuContent/upload'" :on-error="uploadError" :on-success="uploadSuccess"
            :format="['jpg','jpeg','png']"
            :on-format-error="handleFormatError"
            >
                <Button icon="ios-cloud-upload-outline">上传封面图（支持 jpg，jpeg，png 格式）</Button>
            </Upload>
        </FormItem>
        <FormItem label="封面地址">
            <Input v-model="formValidate.picture" disabled placeholder="支持 jpg，jpeg，png 格式" style="width:100%"></Input>
        </FormItem>
        <FormItem label="上传音乐文件" prop="musicFileUrl">
            <Upload :action="baseUrl.uploadUrl+'/tQiniuContent/upload'" :on-error="uploadMusicError" :on-success="uploadMusicSuccess"
            :format="['mp3','m4a']"
            :on-format-error="handleFormatError"
            >
                <Button icon="ios-cloud-upload-outline">上传音乐（支持 mp3，m4a 格式）</Button>
            </Upload>
        </FormItem>
        <FormItem label="音乐地址">
            <Input v-model="formValidate.musicFileUrl" disabled placeholder="支持 mp3，m4a 格式" style="width:100%"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submitAddMusic
        ">关闭</Button>
    </div>
    </Modal>
  </div>
</template>

<script>
import Aplayer from "vue-aplayer";
import {
  getMusicAll,
  updatebgMusicReview,
  updatebgMusicReviews,
  deleteMusic,
  deleteMusicPhysical,
  getMusicClass,
  addMusic
} from "@/api/music";
import { getDate2 } from "@/libs/tools.js";
import baseUrl from '@/api/configHttpUrl'

export default {
  name: "tables_page",
  components: {
    Aplayer
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password"));
      } else {
        if (this.formCustom.passwdCheck !== "") {
          // 对第二个密码框单独验证
          this.$refs.formCustom.validateField("passwdCheck");
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password again"));
      } else if (value !== this.formCustom.passwd) {
        callback(new Error("The two input passwords do not match!"));
      } else {
        callback();
      }
    };
    const validateAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("Age cannot be empty"));
      }
      // 模拟异步验证效果
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("Please enter a numeric value"));
        } else {
          if (value < 18) {
            callback(new Error("Must be over 18 years of age"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    return {
      isMusicPlayerShow: false,
      // switch1:false,
      //默认选中状态 ：
      isChecked: "",
      //是否显示页面内容：
      showSelection: false,
      showId: false,
      showuserid: false,
      showMusicid: false,
      showFileurl: false,
      // showScreenfileurl:'',
      columns: [
        { title: "音乐编号", key: "id", align: "center", fixed: "left" },
        {
          title: "音乐封面",
          key: "picture",
          align: "center",
          render: (h, params) => {
            return h("img", {
              style: {
                width: "50px",
                heigth: "50px",
                marginTop: "5px",
                cursor: "pointer",
                objectFit: 'contain',
              },
              attrs: {
                src: params.row.picture,
                onerror: "javascript:this.src='https://img.lgh81.com/timg20190605144929.jpg'"
              },
              on: {
                click: () => {
                  console.log(params.row);
                  this.isMusicPlayerShow = true;
                  // console.log(params.row.fileurl,'fileurl')
                  this.modalMusicInfo = true;
                  this.musicPlayer.pic = params.row.picture;
                  this.musicPlayer.src = params.row.musicFileUrl;
                  this.musicPlayer.title = params.row.name;
                  this.musicPlayer.artist = params.row.author;
                }
              }
            });
          }
        },
        { title: "音乐名称", key: "name", width: 100, align: "center" },
        { title: "音乐作者", key: "author", align: "center" },
        { title: "相关用户编号", key: "userid", align: "center" },
        { title: "是否原创", key: "isoriginal", align: "center" },
        // {title: '文件地址', key: 'fileurl',width: 100, align: 'center'},//0公开1私密
        { title: "分类编号", key: "classid", align: "center" },
        { title: "创建时间", key: "createtime", width: 150, align: "center" },
        { title: "引用次数", key: "count", align: "center" },
        { title: "音乐时长", key: "length", align: "center" }, //0未删除1删除
        { title: "审核状态", key: "reviewstatus", align: "center" }, //0未举报
        { title: "删除标记", key: "isDelete", align: "center" },
        {
          title: "操作",
          key: "action",
          width: 100,
          fixed: "right",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small"
                  },
                  style: {
                    marginTop: "10px",
                    marginBottom: "10px",
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.modalDetil = true;
                      this.formCustom.id = params.row.id;
                      this.formCustom.name = params.row.name;
                      this.formCustom.author = params.row.author;
                      this.formCustom.userid = params.row.userid;
                      this.formCustom.isoriginal = params.row.isoriginal;
                      this.formCustom.fileurl = params.row.fileurl;
                      this.formCustom.classid = params.row.classid;
                      this.formCustom.createtime = params.row.createtime;
                      this.formCustom.count = params.row.count;
                      this.formCustom.picture = params.row.picture;
                      this.formCustom.length = params.row.length;
                      this.formCustom.reviewStatus = params.row.reviewstatus;
                      this.formCustom.isDelete = params.row.isDelete;
                    }
                  }
                },
                "查看详情"
              ),
              //  h('Button', {
              // props: {
              // type: 'warning',
              // size: 'small'
              // },
              // style: {
              // marginRight: '5px',
              // marginBottom: '10px'
              // },
              // on: {
              // click: () => {
              //     this.isMusicPlayerShow=true
              //     console.log(params.row.fileurl,'fileurl')
              //     this.modalMusicInfo = true
              //     this.musicPlayer.pic=params.row.picture
              //     this.musicPlayer.src=params.row.fileurl
              //     this.musicPlayer.title=params.row.name
              //     this.musicPlayer.artist=params.row.author
              // },
              // }
              // }, '播放音乐'),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px",
                    marginBottom: "10px"
                  },
                  on: {
                    click: () => {
                      if (params.row.isDelete === "删除") {
                        return this.$Modal.error({ title: "该条数据已删除" });
                      }
                      this.$Modal.confirm({
                        title: "是否确认删除？",
                        onOk: () => {
                          deleteMusic({ ids: params.row.id }).then(res => {
                            console.log(res);
                            if (res.data.code === 0) {
                              this.$Message.info("删除成功");
                              this.isLoading = true;
                              this.initData();
                            }
                          });
                        }
                      });
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      tableData: [],
      authorityOpt: [
        {
          value: 0,
          content: "公开"
        },
        {
          value: 1,
          content: "私密"
        }
      ],
      isoriginalOpt: [
        {
          value: "原创",
          content: "原创"
        },
        {
          value: "非原创",
          content: "非原创"
        }
      ],
      reviewStatusOpt: [
        {
          value: "未审核",
          content: "未审核"
        },
        {
          value: "已审核",
          content: "已审核"
        },
        {
          value: "未通过",
          content: "未通过"
        }
      ],
      isDeleteOpt: [
        {
          value: "未删除",
          content: "未删除"
        },
        {
          value: "删除",
          content: "已删除"
        }
      ],
      queryList: {
        offset: 0, //0,11,21
        limit: 10,
        sort: "id",
        order: "asc"
      },
      dataCount: 0,
      pageSize: 10,
      now: 1,
      isLoading: true,
      modalDetil: false,
      width: "100%",
      height: 600,
      formCustom: {},
      widthForm: 900,
      ids: [],
      //查看音乐详情：
      musicPlayer: {
        title: "secret base~君がくれたもの~",
        artist: "Silent Siren",
        src: "https://img.lgh81.com/梅香如故 - 毛不易20190316175433.mp3",
        pic: "https://img.lgh81.com/E202F90B-DC00-4933-96B8-684D40B3C6E2.png"
      },
      modalMusicInfo: false,
      state: "",
      //查看封面：
      modalImg: false,
      imgsrc: "",
      //选中id存放：
      multipleSelectionId: [],
      multipleReviewStatus: "",
      uploadMusicForm: false,
      addMusicLoading: true,
      formValidate: {
        name: '',
        picture: '',
        author: '',
        userid: 0,
        isoriginal: 0,
        musicFileUrl: '',
        reviewstatus: 1,
        activityFlag: 0,
        classid: null,
        styleName: '',
        musicFileUrl: '',
        submitFlag: 1
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        picture: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
        musicFileUrl: [
          { required: true, message: '请上传音乐', trigger: 'change' }
        ],
        author: [
          { required: true, message: '请填写作者', trigger: 'blur' }
        ],
        classid: [
          { type: 'number',required: true, message: '请选择音乐类型', trigger: 'change' }
        ],
      },
      baseUrl:baseUrl,
      classList:[],
    };
  },
  methods: {
    // 打开添加音乐表单
    openUploadForm(){
      this.uploadMusicForm = true
    },
    // 关闭对话框
    submitAddMusic(){
      this.uploadMusicForm = false
    },
    // 提交表单
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                // this.$Message.success('Success!');
                console.log(this.formValidate)
                this.add()
            } else {
                this.$Message.error('请填写完整!');
            }
        })
    },
    // 重置表单
    handleReset (name) {
        this.$refs[name].resetFields();
    },
    // 图片上传成功
    uploadSuccess(res,file,fileLis){
        console.log(res)
        if(res.code === 0){
            this.formValidate.picture = res.data.serverUrl
        }
    },
    // 图片上传失败
    uploadError(err,file,fileLis){
        console.log(err)
        console.log(file)
        console.log(fileLis)
    },
     // 音乐上传成功
    uploadMusicSuccess(res){
        console.log(res)
        if(res.code === 0){
            this.formValidate.musicFileUrl = res.data.serverUrl
        }
    },
    // 音乐上传失败
    uploadMusicError(){

    },
    // 上传封面，文件类型错误时
    handleFormatError(){
        this.$Message.error('图片仅支持 png，jpg，jpeg!')
    },
    // 获取音乐分类
    musicClassList(){
        getMusicClass()
        .then(res=>{
            console.log(res)
            this.classList = res.data.data
        })
        .catch(err=>{
            console.log(err)
        })
    },
    classChange(val){
        this.formValidate.styleName = val.label
    },
    // 添加音乐
    add(){
        addMusic(this.formValidate)
        .then(res=>{
            console.log(res)
            if(res.data.code === 0){
                this.$Message.success('添加成功')
                this.uploadMusicForm = false
                this.initData()
            }
            
        })
        .catch(err=>[
            console.log(err)
        ])
    },
    //处理分页：
    handlePage(data) {
      this.queryList.offset = 0;
      this.isLoading = true;
      this.queryList.limit = data;
      // console.log(this.queryList)
    },
    //改变当前页：
    handleChange(page) {
      this.isLoading = true;
      this.queryList.offset = page;
      // console.log(this.queryList,'this.queryList2')
    },
    change(status) {
      this.$Message.info("开关状态：" + status);
    },
    handleDelete(params) {
      console.log(params); //{row: {…}, index: 2, column: {…}, tableData: Array(9)}
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      });
    },
    //重置表单数据：
    // handleReset (name) {
    //     this.$refs[name].resetFields();
    // }
    //触发多选框的选中状态：
    handleSelectionChange(selection) {
      console.log(selection); //[{…}, {…}, {…}]
      this.multipleSelectionId = [];
      selection.forEach(item1 => {
        this.multipleSelectionId.push(item1.id);
      });
    },
    //批量逻辑删除确认选择多选框？
    ModifyDelShortVideoMusic() {
      if (this.multipleSelectionId.length !== 0) {
        this.$Modal.confirm({
          title: "是否删除？",
          onOk: () => {
            deleteMusic({ ids: this.multipleSelectionId.toString() }).then(
              res => {
                // console.log(res);
                if (res.data.code === 0) {
                  this.$Message.info("删除成功");
                  this.isLoading = true;
                  this.initData();
                  this.multipleSelectionId.length = 0;
                }
              }
            );
          },
          onCancel: () => {}
        });
      } else {
        this.$Modal.error({ title: "请选择需要删除的用户" });
      }
    },
    //批量物理删除短视频音乐：
    ModifyDelUnrecShortVideoMusic() {
      if (this.multipleSelectionId.length !== 0) {
        this.$Modal.confirm({
          title: "此操作不可恢复，是否删除？",
          onOk: () => {
            deleteMusicPhysical({
              ids: this.multipleSelectionId.toString()
            }).then(res => {
              // console.log(res);
              if (res.data.code === 0) {
                this.$Message.info("删除成功");
                this.isLoading = true;
                this.initData();
                this.multipleSelectionId.length = 0;
              }
            });
          },
          onCancel: () => {}
        });
      } else {
        this.$Modal.error({ title: "请选择需要删除的用户" });
      }
    },
    ok() {
      setTimeout(() => {
        // this.musicPlayer.src=''
        this.isMusicPlayerShow = false;
      }, 500);
    },
    cancel() {
      this.ok();
    },
    initData() {
      getMusicAll(this.queryList).then(res => {
        this.isLoading = false;
        if (res.data.total !== 0) {
          this.tableData = res.data.rows;
          this.dataCount = res.data.total;
          this.$forceUpdate();
        } else {
          return;
        }
      });
    }
  },
  computed: {
    newcolumns() {
      let tempcolumns = [];
      if (this.showSelection) {
        tempcolumns.push({
          title: "Selection",
          key: "selection",
          type: "selection",
          width: 50,
          align: "center",
          fixed: "left"
        });
      }
      if (this.showFileurl) {
        tempcolumns.push({
          title: "文件地址",
          key: "fileurl",
          align: "center"
        });
      }
      return tempcolumns.concat(this.columns);
    },
    newTableData() {
      if (!this.tableData) return;
      this.tableData.forEach(item => {
        if (item.isoriginal === 1) {
          item.isoriginal = "原创";
        } else if (item.isoriginal === 0) {
          item.isoriginal = "非原创";
        }
        if (item.isDelete === 1) {
          item.isDelete = "删除";
        } else if (item.isDelete === 0) {
          item.isDelete = "未删除";
        }
        if (item.reviewstatus === 0) {
          item.reviewstatus = "未审核";
        } else if (item.reviewstatus === 1) {
          item.reviewstatus = "已审核";
        } else if (item.reviewstatus === 2) {
          item.reviewstatus = "未通过";
        }
        // 时间戳转换
        item.createtime = getDate2(item.createtime);
      });
      return this.tableData;
    },
    newClassList() {
        let temData = this.classList
        let newList = []
        temData.map(item=>{
            newList.push({
                value: item.id,
                label: item.name
            })
        })
        return newList
    }
  },
  watch: {
    queryList: {
      handler: function(newval, oldval) {
        this.initData();
        console.log(newval, "newval");
      },
      deep: true
    }
  },
  created() {
    this.initData();
    this.musicClassList()
  }
};
</script>



<style scoped>
#btn {
  margin-bottom: 10px;
}
#btn .ivu-btn-primary {
  margin-right: 8px;
}
#isShow {
  margin-bottom: 10px;
}
.demo-spin-container {
  display: inline-block;
  width: 200px;
  height: 100px;
  position: relative;
  border: 1px solid #eee;
}
.upload-music {
  margin-bottom: 10px;
}
</style>