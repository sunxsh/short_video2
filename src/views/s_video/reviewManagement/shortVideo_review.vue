<template>
  <div>
    <div id="btn">
      <Button type="primary" @click="modifyHandleShortVideoStatus">批量处理审核</Button>
    </div>
    <div id="isShow">
      显示多选框：
      <i-switch v-model="showSelection" style="margin-right: 5px;margin-bottom:10px;"></i-switch>
    </div>
    <!-- Table -->
    <div>
      <Card style="width:100%">
        <!-- 查询 -->
        <div class="search-con search-con-top">
          <Button type="default" style="color:#333;cursor:default">审核状态</Button>
          <Select v-model="searchKey" class="search-col">
            <Option
              v-for="item in reviewList"
              :value="item.value"
              :key="`search-col-${item.value}`"
            >{{ item.label }}</Option>
          </Select>
          <Button @click="handleSearch" class="search-btn" type="primary">
            <Icon type="search"/>&nbsp;&nbsp;搜索
          </Button>
        </div>
        <!-- <Table
          stripe
          highlight-row
          ref="tables"
          :data="newTableData"
          :columns="newcolumns"
          :loading="isLoading"
          @on-selection-change="handleSelectionChange"
        ></Table>-->
        <div class="video-box">
          <Row :gutter="20" v-for="(itemRow,i) in newTestArr" :key="i">
            <Col v-for="(itemCol,k) in itemRow" :key="k" class="list-item" >
              <div class="video-card">
                <Button
                  shape="circle"
                  icon="md-close"
                  class="close-video"
                  @click="closeVideo(itemCol)"
                  v-show="!itemCol.isVideoPlayerShow?false:true"
                ></Button>
                <!-- <Checkbox v-model="itemCol.check"></Checkbox> -->
                <video-player
                  class="video-player vjs-custom-skin anyWay"
                  v-if="itemCol.isVideoPlayerShow"
                  ref="videoPlayer"
                  :playsinline="true"
                  :options="itemCol.playerOptions"
                  @play="onPlayerPlay($event)"
                  @pause="onPlayerPause($event)"
                ></video-player>
                <div v-else>
                  <div class="cover-img-box" @click="coverImgClick(itemCol)">
                    <img src="../../../image/cover.jpg" alt>
                  </div>
                  <ul class="cover-info">
                    <li>
                      <p class="left">编号</p>
                      <p class="right">{{itemCol.id}}</p>
                    </li>
                    <li>
                      <p class="left">审核状态</p>
                      <p class="right">{{itemCol.reviewStatus}}</p>
                    </li>
                    <li>
                      <p class="left">视频标题</p>
                      <p class="right">{{itemCol.title}}</p>
                    </li>
                    <li>
                      <p class="left">视频作者ID</p>
                      <p class="right">{{itemCol.userid}}</p>
                    </li>
                    <li>
                      <p class="left">是否私密</p>
                      <p class="right">{{itemCol.authority}}</p>
                    </li>
                    <li>
                      <p class="left">上传时间</p>
                      <p class="right">{{itemCol.createtime}}</p>
                    </li>
                  </ul>
                  <div class="btn-box">
                    <div class="left">
                      <Button type="error" @click="auditClick(itemCol)">审核</Button>
                    </div>
                    <div class="right">
                      <Button type="primary" @click="auditRecordClick(itemCol)">审核记录</Button>
                    </div>
                  </div>
                  <div class="checkbox-box">
                    <el-checkbox v-model="itemCol.checked" @change="changeChecked(itemCol)" v-show="showSelection"></el-checkbox>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <h3 v-show="showMsg" style="text-align: center;line-height: 100px;">暂无数据</h3>
        <change-page :totalPage="dataCount" @getPages="handlePage" @changes="handleChange"></change-page>
      </Card>
    </div>
    <!-- 批量审核 -->
    <Modal
      title="批量审核"
      v-model="modalModifyShortVideoReview"
      class-name="vertical-center-modal"
      :mask-closable="false"
      :closable="false"
      width="500px"
      :scrollable="true"
      @on-ok="okComment"
      @on-cancel="cancelComment"
    >
      <Form
        :model="formCustom"
        :label-width="100"
        inline
        :rules="ruleValidate"
        ref="reviewForm"
        class="ModifyRemark"
      >
        <FormItem label="审核状态" prop="reviewStatus" style="marginBottom:5px">
          <RadioGroup v-model="formCustom.reviewStatus">
            <Radio label="未审核"></Radio>
            <Radio label="已审核"></Radio>
            <Radio label="未通过"></Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>
    <!-- 查看详情弹出框  @on-ok="asyncOK('formCustom')"-->
    <Modal
      :title="titleMd"
      v-model="modalShortVideo"
      :mask-closable="false"
      :closable="false"
      :width="widthForm"
      :scrollable="true"
      class="userDefined2"
    >
      <div class="container" style="width:720px;">
        <div class="player">
          <video-player
            class="video-player vjs-custom-skin anyWay"
            v-if="isVideoPlayerShow"
            ref="videoPlayer"
            :playsinline="true"
            :options="playerOptions"
            @play="onPlayerPlay($event)"
            @pause="onPlayerPause($event)"
          ></video-player>
        </div>
      </div>
      <div>
        <Form
          :model="formCustom"
          :label-width="100"
          :rules="ruleValidate"
          ref="reviewForm"
          style="marginTop:20px"
          v-show="isReview"
        >
          <!-- <FormItem label="编号" prop="id" style="marginBottom:5px">
                        <Input type="text" v-model="formCustom.id" number/>
                    </FormItem>                  
                    <FormItem label="审核人" prop="reviewuserid" style="marginBottom:5px">
                        <Input type="text" v-model="formCustom.reviewuserid" number/>
          </FormItem>-->
          <FormItem label="视频标题" prop="title" style="marginBottom:5px">
            <Input type="text" v-model="formCustom.title" number/>
          </FormItem>
          <FormItem label="审核状态" prop="reviewStatus" style="marginBottom:5px">
            <RadioGroup
              v-model="formCustom.reviewStatus"
              @on-change="hasreviewed"
              style="width:200px;"
            >
              <Radio v-show="UnauditedShow" label="未审核"></Radio>
              <Radio label="已审核"></Radio>
              <Radio label="未通过"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="备注" prop="remark" style="marginBottom:5px" v-if="isActiveAll">
            <Select v-model="myRemarkModel" style="width:200px;" @on-change="handleSelectChange">
              <Option
                v-for="item in remarkList"
                :value="item.value"
                :key="item.value"
                v-if="unPass"
              >{{ item.label }}</Option>
              <Option
                v-for="item in remarkList"
                :value="item.value"
                :key="item.value"
                v-if="isReviewed"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem class="userDefinedReason" prop="remarkMore" v-if="isIptShow">
            <Input
              v-model="formCustom.remarkMore"
              type="text"
              placeholder="请输入审核未通过原因"
              style="height:30px;vertical-align:top"
              autofocus
            />
          </FormItem>
        </Form>
      </div>
      <div slot="footer" v-if="isReview">
        <Button style="margin-left: 8px" @click="cancelVideoReview">取消</Button>
        <Button type="primary" @click="handleReview('reviewForm')">审核</Button>
      </div>
    </Modal>
    <!-- 查看审核记录 -->
    <Modal
      title="审核记录"
      v-model="modalReviewcords"
      :mask-closable="false"
      :closable="false"
      width="600px"
      :styles="{top: '20px'}"
      :scrollable="true"
    >
      <Table
        stripe
        highlight-row
        ref="tableTwo"
        :data="queryReviewcords"
        :columns="queryReviewcolumns"
        :loading="isLoading"
        @on-selection-change="handleSelectionChange"
      ></Table>
    </Modal>
  </div>
</template>

<script>
import {
  getVideoReview,
  getShortVideoById,
  updateVideoReview,
  getShortVideoByReviewStatus,
  getVideoReviewById,
  updateVideoReviewsByIds,
  getShortVideoAll
} from "@/api/shortVideo";
import { listNum, getDate2 } from "@/libs/tools.js";
// import json from '@/components/tables/city_code.json'
var self = this
export default {
  name: "shortVideo_review",
  data() {
    return {
      checked: false,
      UnauditedShow: true,
      showMsg: false,
      testArr: ["A", "B", "C", "D", "E", "F"],
      myRemarkModel: "",
      titleMd: "",
      isReview: false,
      fileBaseUrl: "https://v.fted.net/",
      //批量审核：
      modalModifyShortVideoReview: false,
      //选中id存放：
      multipleSelectionId: [],
      multipleCommentStatus: "",
      //查询：
      searchKey: "",
      reviewList: [
        { value: "0", label: "未审核" },
        { value: "1", label: "已审核" },
        { value: "2", label: "未通过" }
      ],
      //设置审核详情：
      unPass: false,
      isActiveAll: false,
      isReviewed: false,
      remarkList: [],
      ruleValidate: {
        // remark: [
        //     { required: true, message: '理由不能为空', trigger: 'blur' }
        // ],
        // remarkMore: [
        //     { required: true, message: '理由不能为空', trigger: 'blur' }
        // ]
      },
      //查询审核记录：
      modalReviewcords: false,
      queryReviewcords: [],
      queryReviewcolumns: [
        {
          title: "短视频编号",
          key: "shortvideoid",
          width: 120,
          align: "center"
        },
        { title: "审核人", key: "reviewuserid", width: 120, align: "center" },
        { title: "审核时间", key: "reviewtime", align: "center" },
        { title: "备注", key: "remark", align: "center" }
      ],
      //是否显示页面内容：
      showSelection: false,
      showId: false,
      showuserid: false,
      showMusicid: false,
      columns: [
        { title: "短视频编号", key: "id", align: "center" },
        { title: "审核状态", key: "reviewStatus", align: "center" },
        {
          title: "封面图",
          key: "screenfileurl",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h("img", {
              style: {
                width: "100%",
                height: "100%",
                marginTop: "5px",
                cursor: "pointer"
              },
              attrs: {
                src: this.fileBaseUrl + params.row.screenfileurl
              },
              on: {
                click: () => {
                  this.isReview = false;
                  this.titleMd = "查看视频详情";
                  this.getVideourl(params.row.id);
                  this.modalShortVideo = true;
                  this.isIptShow = false;
                }
              }
            });
          }
        },
        { title: "视频标题", key: "title", width: 150, align: "center" },
        { title: "视频作者id", key: "userid", align: "center" },
        // {title: '挑战标题', key: 'challengetitle', align: 'center'},
        { title: "是否私密", key: "authority", align: "center" },
        // {title: '创建时间', key: 'createtime', align: 'center'},
        { title: "上传时间", key: "uploadtime", width: 200 },
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
                    type: "error",
                    size: "small",
                    disabled: false
                  },
                  style: {
                    marginRight: "5px",
                    marginBottom: "10px",
                    marginTop: "10px"
                  },
                  on: {
                    click: () => {
                      this.isIptShow = false;
                      this.isReview = true;
                      this.titleMd = "审核详情";
                      this.formCustom.title = params.row.title;
                      this.formCustom.id = params.row.id;
                      // this.formCustom.challengetitle=params.row.challengetitle
                      // this.formCustom.reviewuserid=params.row.reviewuserid
                      // this.formCustom.shortvideoid=params.row.shortvideoid
                      this.formCustom.reviewStatus = params.row.reviewStatus;
                      // this.formCustom.remark=params.row.remark
                      // this.formCustom.createtime=params.row.createtime
                      // this.formCustom.reviewtime=params.row.reviewtime
                      this.getVideourl(params.row.id);
                      this.modalShortVideo = true;
                    }
                  }
                },
                "审核"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px",
                    marginBottom: "10px"
                  },
                  //on就是用来绑定事件的
                  on: {
                    //获取当前行信息，并更新赋值
                    click: () => {
                      this.modalReviewcords = true;
                      getVideoReviewById({ shortvideoid: params.row.id }).then(
                        res => {
                          this.queryReviewcords = res.data.rows;
                        }
                      );
                    }
                  }
                },
                "审核记录"
              )
            ]);
          }
        }
      ],
      tableData: [],
      queryList: {
        offset: 0, //0,11,21
        limit: 10,
        sort: "id",
        order: "asc",
        reviewStatus: "0",
        userid: 1,
      },
      dataCount: 0,
      pageSize: 10,
      now: 1,
      isLoading: true,
      modalShortVideo: false,
      width: "100%",
      height: 600,
      formCustom: {},
      widthForm: 720,
      ids: [],
      //查看短视频详情：
      modalShortVideo: false,
      isVideoPlayerShow: false,
      videoFileurl: "",
      playerOptions: {
        // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: true, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: false, // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4",
            // src: 'https://v.fted.net/'+this.tableData.map(item=>item.fileurl)// 你的m3u8地址（必填）
            src: "https://v.fted.net/FjQtDQV-1iG_DO4d4kXAQh0YwjWu" // 你的m3u8地址（必填）
          }
        ],
        poster: "../../../image/cover.jpg", // 你的封面地址
        width: 260,
        // notSupportedMessage: '此视频暂无法播放，请稍后再试'// 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: { fullscreenToggle: false }
      },
      state: "",
      //查看封面：
      modalImg: false,
      imgsrc: "",
      loading: true,
      //显示举报评论：
      valueReportContent: "",
      visible: false,
      isIptShow: false,
      // 临时储存获取到的视频地址
      urlObj: null
    };
  },
  methods: {
    // 多虚框change事件
    changeChecked(col){
      console.log(col.id)
      let i = this.multipleSelectionId.indexOf(col.id)
      if(col.checked){
        if(i == -1){
          this.multipleSelectionId.push(col.id)
        }
      }else{
        if(i !== -1){
          this.multipleSelectionId.splice(i,1)
        }
      }
      console.log(this.multipleSelectionId)
      // this.multipleSelectionId.push(col.id)
      // console.log(this.tableData)
      // let xzarr = this.tableData.map((item)=>{
      //   let arr = []
      //   if(item.checked){
      //     arr.push(item.id)
      //   }
      //   return arr
      // })
      // console.log(xzarr)
      this.$forceUpdate();
    },
    //判断当前状态是否显示'未审核'的单选框
    ifUnauditedShow(){
      if(this.queryList.reviewStatus === '0'){
        this.UnauditedShow = true
      }else{
        this.UnauditedShow = false
      }
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
    handleOpen() {
      this.visible = true;
    },
    handleClose() {
      this.visible = false;
    },
    //查询：
    handleSearch() {
      console.log(this.searchKey);
      this.queryList.reviewStatus = this.searchKey;
      this.initData();
    },
    //处理批量审核：
    modifyHandleShortVideoStatus() {
      if (this.multipleSelectionId.length !== 0) {
        this.modalModifyShortVideoReview = true;
      } else {
        this.$Modal.warning({ title: "请选择需要审核的用户" });
      }
    },
    //单选框的change事件：监听此事件是为了，那两个不同的下拉框
    hasreviewed(val) {
      // console.log(val)
      // this.formCustom.remark=''
      this.myRemark = "";
      if (val === "已审核") {
        this.unPass = false;
        this.isActiveAll = true;
        this.isReviewed = true;
        this.remarkList = [{ value: "审核通过", label: "审核通过" }];
        this.myRemark = this.remarkList[0].value;
      } else if (val === "未通过") {
        this.unPass = true;
        this.isActiveAll = true;
        this.isReviewed = false;
        this.remarkList = [
          { value: "涉黄", label: "涉黄" },
          { value: "涉黑", label: "涉黑" },
          { value: "其他", label: "其他" }
        ];
        // this.formCustom.remark=this.remarkList[0].value
      } else {
        this.unPass = false;
        this.isActiveAll = false;
        this.isReviewed = false;
      }
      // console.log(this.formCustom.remark);
    },
    //下拉框的change事件：
    handleSelectChange() {
      // this.formCustom.remark == '其他' ? this.isIptShow = true : this.isIptShow = false
      // this.myRemark == '其他' ? this.isIptShow = true : this.isIptShow = false
      // console.log(this.isIptShow);
      // if(this.formCustom.remark == '其他')
    },
    //点击审核：
    handleReview(name) {
      // console.log(this.formCustom)
      // if(!this.myRemarkModel || !this.formCustom.remarkMore){
      //     this.$Message.error('请输入未通过类型')
      //     return
      // }
      if (this.isIptShow) {
        this.formCustom.remark = this.formCustom.remarkMore;
        if (!this.myRemarkModel || !this.formCustom.remarkMore) {
          return this.$Message.error("请输入未通过类型");
        }
      } else {
        this.formCustom.remark = this.myRemark;
        if (!this.myRemarkModel) {
          return this.$Message.error("请输入未通过类型");
        }
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Modal.confirm({
            title: "是否确认处理审核？",
            onOk: () => {
              // console.log(this.formCustom.id,this.formCustom.reviewStatus,this.formCustom.remark);
              console.log(
                this.formCustom.id,
                this.formCustom.reviewStatus,
                this.formCustom.remark
              );
              this.$store.commit("updateIsReload", false);
              if (this.formCustom.reviewStatus === "未审核") {
                this.formCustom.reviewStatus = 0;
              } else if (this.formCustom.reviewStatus === "已审核") {
                this.formCustom.reviewStatus = 1;
              } else if (this.formCustom.reviewStatus === "未通过") {
                this.formCustom.reviewStatus = 2;
              }
              updateVideoReview({
                shortvideoid: this.formCustom.id,
                reviewStatus: this.formCustom.reviewStatus,
                remark: this.formCustom.remark
              }).then(res => {
                console.log(res);
                if (res.data.code === 0) {
                  this.$Message.info(res.data.data);
                  this.isLoading = true;
                  this.initData();
                  this.$store.commit("updateIsReload", true);
                  this.cancelVideoReview();
                  if (this.isIptShow) {
                    // this.$nextTick(()=>{
                    //     this.$refs.IptRef.value=''
                    // })
                    // this.formCustom.remarkMore = ''
                    console.log(111);
                  }
                } else {
                  this.$Message.info(res.data.data);
                }
              });
            },
            onCancel: () => {}
          });
        }
      });
    },
    cancelVideoReview() {
      setTimeout(() => {
        this.isVideoPlayerShow = false;
        this.playerOptions.sources[0].src = "";
      }, 500);
      this.modalShortVideo = false;
      this.isActiveAll = false;
      this.formCustom.remarkMore = "";
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
    //触发多选框的选中状态：
    handleSelectionChange(selection) {
      // console.log(selection);//[{…}, {…}, {…}]
      if (selection[0]) {
        this.multipleCommentStatus = selection[0].reviewStatus;
        this.formCustom.reviewStatus = this.multipleCommentStatus;
        this.hasreviewed(this.formCustom.reviewStatus);
        this.multipleSelectionId = [];
        selection.forEach(item1 => {
          this.multipleSelectionId.push(item1.id);
        });
      } else {
        this.multipleSelectionId.length = 0;
      }
    },
    //批量审核;不用传remark
    okComment() {
      this.$store.commit("updateIsReload", false);
      this.isLoading = true;
      // console.log(this.formCustom.reviewstatus,2);
      updateVideoReviewsByIds({
        shortvideoids: this.multipleSelectionId.toString(),
        reviewstatus: this.formCustom.reviewStatus === "已审核" ? 1 : 2
      }).then(res => {
        if (res.data.code === 0) {
          this.initData();
          this.$Message.success("修改成功");
          this.multipleSelectionId.length = 0;
          // console.log(this.$store.state.isReload)//undefined???
          this.$store.commit("updateIsReload", true);
        }
      });
    },
    cancelComment() {},
    initData() {
      getShortVideoByReviewStatus(this.queryList).then(res => {
        console.log(res)
        // this.tableData = res.data.rows;
        this.ifUnauditedShow()
        this.multipleSelectionId = []
        if(!res.data.rows){
          this.tableData = []
          this.showMsg = true
        }else{
          this.tableData = res.data.rows.map(item => {
            let arr = [];
            arr.isVideoPlayerShow = false;
            arr.playerOptions = {
              autoplay: false, // 如果true,浏览器准备好时开始回放。
              muted: false, // 默认情况下将会消除任何音频。
              loop: false, // 导致视频一结束就重新开始。
              preload: false, // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
              language: "zh-CN",
              aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
              fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
              sources: [
                {
                  type: "video/mp4",
                  // src: 'https://v.fted.net/'+this.tableData.map(item=>item.fileurl)// 你的m3u8地址（必填）
                  src: ''// 你的m3u8地址（必填）
                  // src: "https://v.fted.net/FjQtDQV-1iG_DO4d4kXAQh0YwjWu" // 你的m3u8地址（必填）
                  // src: "https://img.lgh81.com/684ca5d74ffb86592853395e1eb50c5520190419101902.mp4" // 你的m3u8地址（必填）
                }
              ],
              poster: "../../../image/cover.jpg", // 你的封面地址
              notSupportedMessage: '此视频暂无法播放，请稍后再试',// 允许覆盖Video.js无法播放媒体源时显示的默认信息。
              controlBar: {
                timeDivider: false,
                durationDisplay: false,
                remainingTimeDisplay: false,
                fullscreenToggle: true,
              }
            };
            // arr.closeVideoBtnShow = !arr.isVideoPlayerShow
            arr.id = item.shortvideoId;
            arr.reviewStatus = item.reviewStatus;
            arr.title = item.title;
            arr.userid = item.userid;
            arr.authority = item.authority;
            arr.createtime = item.createtime;
            arr.checked = false;
            return arr;
          });
          this.showMsg = false
        }
        
        // this.tableData = listNum(this.tableData, 5);
        // console.log(this.tableData);

        this.dataCount = res.data.total;
        this.isLoading = false;
      });
    },
    //获取视频地址：
    getVideourl(id) {
      getShortVideoById({ videoid: id }).then(res => {
        if (res.data.code === 0) {
          this.videoFileurl = res.data.data.fileurl;
          // console.log(this.videoFileurl,111);
          this.playerOptions.sources[0].src =
            this.fileBaseUrl + this.videoFileurl;
          this.playerOptions.poster =
            this.fileBaseUrl + res.data.data.screenfileurl;
          this.isVideoPlayerShow = true;
        } else {
          this.$Message.error(res.data.data);
        }
      });
    },
    // 获取视频地址(新)zeng
    newGetVideoUrl(id,col){
      getShortVideoById({ videoid: id }).then(res => {
        
        if(res.data.data.fileurl.indexOf('https://') === -1){
          col.playerOptions.sources[0].src = this.fileBaseUrl+res.data.data.fileurl
        }else{
          col.playerOptions.sources[0].src = res.data.data.fileurl
        }
        if(res.data.data.screenfileurl.indexOf('https://') === -1){
          col.playerOptions.poster = this.fileBaseUrl+res.data.data.screenfileurl
        }else{
          col.playerOptions.poster = res.data.data.screenfileurl
        }
        col.isVideoPlayerShow = true;
        this.$forceUpdate();
      });
    },
    onPlayerPlay(player) {},
    onPlayerPause(player) {
      //console.log('player pause!', player)
    },
    playerStateChanged(player) {},
    // 点击封面图
    coverImgClick(col) {
      this.newGetVideoUrl(col.id,col)
      // let myData = JSON.parse(JSON.stringify(this.urlObj))
      // console.log(this.urlObj)
      
      
      
      // console.log(this.tableData)
      // this.isReview = false;
      // this.titleMd = "查看视频详情";
      // this.getVideourl(id);
      // this.modalShortVideo = true;
      // this.isIptShow = false;
    },
    // 点击关闭视频
    closeVideo(col) {
      col.isVideoPlayerShow = false;
      this.$forceUpdate();
    },
    // 点击审核
    auditClick(item) {
      this.isIptShow = false;
      this.isReview = true;
      this.titleMd = "审核详情";
      this.formCustom.title = item.title;
      this.formCustom.id = item.id;
      this.formCustom.reviewStatus = item.reviewStatus;
      // this.getVideourl(item.id);
      this.modalShortVideo = true;
    },
    // 点击审核记录
    auditRecordClick(item) {
      this.modalReviewcords = true;
      getVideoReviewById({ shortvideoid: item.id }).then(res => {
        // console.log(res)
        this.queryReviewcords = res.data.rows;
        console.log(this.queryReviewcords)
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
      return tempcolumns.concat(this.columns);
    },
    newTableData() {
      if (this.tableData) {
        this.tableData.forEach(item => {
          if (item.reviewStatus === 0) {
            item.reviewStatus = "未审核";
          } else if (item.reviewStatus === 1) {
            item.reviewStatus = "已审核";
          } else if (item.reviewStatus === 2) {
            item.reviewStatus = "未通过";
          }
          if (item.authority === 0) {
            item.authority = "公开";
          } else {
            item.authority = "私密";
          }
        });
      }
      // console.log(this.tableData);
      return this.tableData;
    },
    newTestArr() {
        let myTableData = this.tableData
        myTableData.map((item)=>{
          if (item.reviewStatus === 0) {
            item.reviewStatus = "未审核";
          } else if (item.reviewStatus === 1) {
            item.reviewStatus = "已审核";
          } else if (item.reviewStatus === 2) {
            item.reviewStatus = "未通过";
          }
          if (item.authority === 0) {
            item.authority = "公开";
          } else {
            item.authority = "私密";
          }
          item.createtime = getDate2(item.createtime)
        })
        console.log(myTableData)
        return listNum(myTableData,5)
    },
    myRemark: {
      //不可以直接把myRemark写在v-model中，因为就是无法触发双向绑定，而是必须通过一个中间变量：myRemarkModel进行双向绑定，在set方法中，让这个中间变量=new新值，实现实时更新；然后就可以在watch中监听这个中间变量，一旦中间变量==‘其他’，就让input显示，此时this.formCustorm.remark=input的value（这里也有个双向绑定，清空直接令v-modal=‘’，如果通过ref取得 value置为空就报错）
      get: function() {
        console.log("我被getter了");
        // return this.formCustom.remark
        return this.myRemarkModel;
      },
      set: function(myRemark) {
        console.log("我被setter了");
        // console.log(this.formCustom.remark);
        console.log(myRemark, "myRemark");
        this.myRemarkModel = myRemark;
        // console.log(this.myRemarkModel,'myRemarkModel');
      }
    },
    myQueryReviewcords() {
      
    }
  },
  watch: {
    queryList: {
      handler: function(newval, oldval) {
        this.initData();
        // console.log(newval,'newval')
      },
      deep: true
    },
    myRemarkModel(newR, oldR) {
      console.log(newR, "newR");
      if (newR == "其他") {
        this.isIptShow = true;
        // this.$nextTick(()=>{
        //     console.log(this.$refs.IptRef.value)
        //     // this.myRemark = this.$refs.IptRef.value
        // })
      } else {
        this.isIptShow = false;
      }
    }
  },
  created() {
    this.initData();
  }
};
</script>

<style lang="less" scoped>
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
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal {
    top: 0;
  }
}
.anyWay .video-js.vjs-fluid,
.video-js.vjs-16-9,
.video-js.vjs-4-3 {
  position: absolute;
}
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}
.anyWay {
  width: 100%;
  height: 100%;
  display: block;
}
.close-video {
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 999;
}
.ivu-modal-body{
  padding: 10px;
}
.video-box {
  .ivu-row {
    .list-item {
      float: left;
      width: 20%;
      .video-card {
        margin-top: 20px;
        height: 550px;
        border-radius: 10px;
        overflow: hidden;
        background: #fff;
        // padding-bottom: 20px;
        position: relative;
        -moz-box-shadow: 0px 0px 5px #bbb;
        -webkit-box-shadow: 0px 0px 10px #bbb;
        box-shadow: 0px 0px 10px #bbb;
        .cover-img-box {
          width: 100%;
          cursor:pointer;
          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
        .cover-info {
          li {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            padding: 10px 10px;
            border-bottom: 1px solid #ececec;
            &:nth-last-child(1) {
              border: none;
            }
            .left {
              font-weight: bold;
            }
            .right {
              font-weight: lighter;
            }
          }
        }
        .btn-box {
          padding: 10px 10px;
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
}
.el-checkbox{
  position: absolute;
  bottom: 10px;
}
.checkbox-box{
  display: flex;
  justify-content:center;
}
</style>