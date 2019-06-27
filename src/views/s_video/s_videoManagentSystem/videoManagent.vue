<template>
  <div>
    <!-- <topic name='责任'>#责任</topic> -->
    <div id="btn">
      <Button type="primary" @click="addShortVideo">添加短视频</Button>
      <Button type="primary" @click="ModifyEditCommentStatus">批量修改评论状态</Button>
      <Button type="primary" @click="ModifyDelCommentStatus">删除</Button>
      <Button type="primary" @click="ModifyDelPycCommentStatus">删除(不可恢复)</Button>
      <Button type="primary">视频信任用户</Button>
      <!-- 
      显示封面图：<i-switch v-model="showScreenfileurl" style="margin-right: 5px"></i-switch>-->
      <!-- <i-Switch v-model="switch1" @on-change="change"/> -->
    </div>
    <div id="isShow">
      显示关联商品ID：
      <i-switch v-model="showGoodsid" style="margin-right: 5px;margin-bottom:5px;"></i-switch>显示关联音乐ID：
      <i-switch v-model="showMusicid" style="margin-right: 5px;margin-bottom:5px;"></i-switch>显示文件地址：
      <i-switch v-model="showFileurl" style="margin-right: 5px;margin-bottom:5px;"></i-switch>显示经度：
      <i-switch v-model="showLongitude" style="margin-right: 5px;margin-bottom:5px;"></i-switch>显示纬度：
      <i-switch v-model="showLatitude" style="margin-right: 5px;margin-bottom:5px;"></i-switch>显示宽：
      <i-switch v-model="showWidth" style="margin-right: 5px;margin-bottom:5px;"></i-switch>显示高：
      <i-switch v-model="showHeight" style="margin-right: 5px;margin-bottom:5px;"></i-switch>
    </div>
    <!-- Table -->
    <div>
      <!-- style="table-layout: auto;word-break: keep-all;" -->
      <Card style="width:100%">
        <!-- 查询 -->
        <!-- <div class="search-con search-con-top" style="display:flex;">
                    <Button type="default" style="color:#333;cursor:default;margin-right:10px">短视频编号</Button>                 
                    <Input search enter-button v-model.trim="queryList.newSearchKey" @on-search='handleSearch' style="width: auto" number />
        </div>-->
        <div class="search-con search-con-top" style="display:flex;">
          <Button type="default" style="color:#333;cursor:default;margin-right:10px">标题/用户ID</Button>
          <Input
            search
            enter-button
            v-model.trim="queryList.search"
            @on-search="handleSearch"
            style="width: auto"
            number
          />
        </div>
        <Table
          stripe
          highlight-row
          ref="tables"
          :data="tableData"
          :columns="newcolumns"
          :loading="isLoading"
          @on-selection-change="handleSelectionChange"
        ></Table>
        <change-page :totalPage="dataCount" @getPages="handlePage" @changes="handleChange"></change-page>
        <!-- <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button> -->
      </Card>
    </div>
    <!-- 查看详情弹出框 -->
    <Modal
      title="查看详情"
      v-model="modalDetil"
      :mask-closable="false"
      :width="widthForm"
      :styles="{top: '20px'}"
      :scrollable="true"
        >
      <Form ref="formCustom" :model="formCustom" :label-width="100" inline>
        <FormItem label="区域编号">
          <Input type="text" v-model="formCustom.areacode" number disabled/>
        </FormItem>
        <FormItem label="挑战id">
          <Input type="text" v-model="formCustom.challengeid" number disabled/>
        </FormItem>
        <FormItem label="挑战标题">
          <Input type="text" v-model="formCustom.challengetitle" disabled/>
        </FormItem>
        <FormItem label="城市编号">
          <Input type="text" v-model="formCustom.citycode" number disabled/>
        </FormItem>
        <FormItem label="分类id">
          <Input type="text" v-model="formCustom.classid" number disabled/>
        </FormItem>
        <FormItem label="评论数">
          <Input type="text" v-model="formCustom.commentCount" number disabled/>
        </FormItem>
        <FormItem label="创建时间">
          <Input type="text" v-model="formCustom.createtime" number disabled/>
        </FormItem>
        <FormItem label="粉丝数">
          <Input type="text" v-model="formCustom.fansCount" disabled/>
        </FormItem>
        <FormItem label="文件大小">
          <Input type="text" v-model="formCustom.filesize" disabled/>
        </FormItem>
        <FormItem label="文件地址">
          <Input type="text" v-model="formCustom.fileurl" disabled/>
        </FormItem>
        <FormItem label="关注数">
          <Input type="text" v-model="formCustom.focusCount" disabled/>
        </FormItem>
        <FormItem label="关联商品id">
          <Input type="text" v-model="formCustom.goodsid" disabled/>
        </FormItem>
        <FormItem label="产品类型">
          <Input type="text" v-model="formCustom.goodstype" disabled/>
        </FormItem>
        <FormItem label="高">
          <Input type="text" v-model="formCustom.height" disabled/>
        </FormItem>
        <FormItem label="编号">
          <Input type="text" v-model="formCustom.id" disabled/>
        </FormItem>
        <FormItem label="纬度">
          <Input type="text" v-model="formCustom.latitude" disabled/>
        </FormItem>
        <FormItem label="长度">
          <Input type="text" v-model="formCustom.length" disabled/>
        </FormItem>
        <FormItem label="经度">
          <Input type="text" v-model="formCustom.longitude" disabled/>
        </FormItem>
        <FormItem label="关联音乐id">
          <Input type="text" v-model="formCustom.musicid" disabled/>
        </FormItem>
        <FormItem label="播放次数">
          <Input type="text" v-model="formCustom.playCount" disabled/>
        </FormItem>
        <FormItem label="推广赞数">
          <Input type="text" v-model="formCustom.promoteCount" disabled/>
        </FormItem>
        <FormItem label="推广播放次数">
          <Input type="text" v-model="formCustom.promotePlayCount" disabled/>
        </FormItem>
        <FormItem label="推广分享数">
          <Input type="text" v-model="formCustom.promoteShareCount" disabled/>
        </FormItem>
        <FormItem label="封面图">
          <Input type="text" v-model="formCustom.screenfileurl" disabled/>
        </FormItem>
        <FormItem label="标题">
          <Input type="text" v-model="formCustom.title" disabled/>
        </FormItem>
        <FormItem label="上传客户端类型">
          <Input type="text" v-model="formCustom.uploadClientType" disabled/>
        </FormItem>
        <FormItem label="上传时间">
          <Input type="text" v-model="formCustom.uploadtime" disabled/>
        </FormItem>
        <FormItem label="用户编号">
          <Input type="text" v-model="formCustom.userid" disabled/>
        </FormItem>
        <FormItem label="宽">
          <Input type="text" v-model="formCustom.width" disabled/>
        </FormItem>
        <FormItem label="是否私密">
          <Select v-model="formCustom.authority" disabled>
            <Option
              :value="item.value"
              v-for="item in authorityOpt"
              :key="item.value"
            >{{item.content}}</Option>
            <!-- <Option value="1">私密</Option> -->
          </Select>
        </FormItem>
        <FormItem label="是否原创">
          <Select v-model="formCustom.isOriginal" disabled>
            <Option
              :value="item.value"
              v-for="item in isOriginalOpt"
              :key="item.value"
            >{{item.content}}</Option>
          </Select>
        </FormItem>
        <FormItem label="举报状态">
          <Select v-model="formCustom.reportedStatus" disabled>
            <Option
              :value="item.value"
              v-for="item in reportedStatusOpt"
              :key="item.value"
            >{{item.content}}</Option>
          </Select>
        </FormItem>
        <FormItem label="审核状态">
          <Select v-model="formCustom.reviewStatus" disabled>
            <Option
              :value="item.value"
              v-for="item in reviewStatusOpt"
              :key="item.value"
            >{{item.content}}</Option>
          </Select>
        </FormItem>

        <FormItem label="删除状态">
          <Select v-model="formCustom.deleteStatus" disabled>
            <Option
              :value="item.value"
              v-for="item in deleteStatusOpt"
              :key="item.value"
            >{{item.content}}</Option>
          </Select>
        </FormItem>
        <FormItem label="评论状态">
          <Select v-model="formCustom.comment_status" disabled>
            <Option
              :value="item.value"
              v-for="item in commentStatusOpt"
              :key="item.value"
            >{{item.content}}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <!-- 添加短视频 -->
    <Modal
      title="添加短视频"
      v-model="ModeladdShortVideo"
      :mask-closable="false"
      :width="widthForm"
      :styles="{top: '20px'}"
      :scrollable="true"
        >
      <Form ref="formValidate" :model="formValidate" :label-width="100" inline>
        <FormItem label="区域编号">
          <Input type="text" v-model="formValidate.areacode" number/>
        </FormItem>
        <FormItem label="挑战id">
          <Input type="text" v-model="formValidate.challengeid" number/>
        </FormItem>
        <FormItem label="挑战标题">
          <Input type="text" v-model="formValidate.challengetitle"/>
        </FormItem>
        <FormItem label="城市编号">
          <Input type="text" v-model="formValidate.citycode" number/>
        </FormItem>
        <FormItem label="分类id">
          <Input type="text" v-model="formValidate.classid" number/>
        </FormItem>
        <FormItem label="评论数">
          <Input type="text" v-model="formValidate.commentCount" number/>
        </FormItem>
        <FormItem label="创建时间">
          <Input type="text" v-model="formValidate.createtime" number/>
        </FormItem>
        <FormItem label="粉丝数">
          <Input type="text" v-model="formValidate.fansCount"/>
        </FormItem>
        <FormItem label="文件大小">
          <Input type="text" v-model="formValidate.filesize"/>
        </FormItem>
        <FormItem label="文件地址">
          <Input type="text" v-model="formValidate.fileurl"/>
        </FormItem>
        <FormItem label="关注数">
          <Input type="text" v-model="formValidate.focusCount"/>
        </FormItem>
        <FormItem label="关联商品id">
          <Input type="text" v-model="formValidate.goodsid"/>
        </FormItem>
        <FormItem label="产品类型">
          <Input type="text" v-model="formValidate.goodstype"/>
        </FormItem>
        <FormItem label="高">
          <Input type="text" v-model="formValidate.height"/>
        </FormItem>
        <FormItem label="编号">
          <Input type="text" v-model="formValidate.id"/>
        </FormItem>
        <FormItem label="纬度">
          <Input type="text" v-model="formValidate.latitude"/>
        </FormItem>
        <FormItem label="长度">
          <Input type="text" v-model="formValidate.length"/>
        </FormItem>
        <FormItem label="经度">
          <Input type="text" v-model="formValidate.longitude"/>
        </FormItem>
        <FormItem label="关联音乐id">
          <Input type="text" v-model="formValidate.musicid"/>
        </FormItem>
        <FormItem label="播放次数">
          <Input type="text" v-model="formValidate.playCount"/>
        </FormItem>
        <FormItem label="推广赞数">
          <Input type="text" v-model="formValidate.promoteCount"/>
        </FormItem>
        <FormItem label="推广播放次数">
          <Input type="text" v-model="formValidate.promotePlayCount"/>
        </FormItem>
        <FormItem label="推广分享数">
          <Input type="text" v-model="formValidate.promoteShareCount"/>
        </FormItem>
        <FormItem label="封面图">
          <Input type="text" v-model="formValidate.screenfileurl"/>
        </FormItem>
        <FormItem label="标题">
          <Input type="text" v-model="formValidate.title"/>
        </FormItem>
        <FormItem label="上传客户端类型">
          <Input type="text" v-model="formValidate.uploadClientType"/>
        </FormItem>
        <FormItem label="上传时间">
          <Input type="text" v-model="formValidate.uploadtime"/>
        </FormItem>
        <FormItem label="用户编号">
          <Input type="text" v-model="formValidate.userid"/>
        </FormItem>
        <FormItem label="宽">
          <Input type="text" v-model="formValidate.width"/>
        </FormItem>
        <FormItem label="是否私密">
          <Select v-model="formValidate.authority">
            <Option
              :value="item.value"
              v-for="item in authorityOpt"
              :key="item.value"
            >{{item.content}}</Option>
            <!-- <Option value="1">私密</Option> -->
          </Select>
        </FormItem>
        <FormItem label="是否原创">
          <Select v-model="formValidate.isOriginal">
            <Option
              :value="item.value"
              v-for="item in isOriginalOpt"
              :key="item.value"
            >{{item.content}}</Option>
          </Select>
        </FormItem>
        <FormItem label="举报状态">
          <Select v-model="formValidate.reportedStatus">
            <Option
              :value="item.value"
              v-for="item in reportedStatusOpt"
              :key="item.value"
            >{{item.content}}</Option>
          </Select>
        </FormItem>
        <FormItem label="审核状态">
          <Select v-model="formValidate.reviewStatus">
            <Option
              :value="item.value"
              v-for="item in reviewStatusOpt"
              :key="item.value"
            >{{item.content}}</Option>
          </Select>
        </FormItem>

        <FormItem label="删除状态">
          <Select v-model="formValidate.deleteStatus">
            <Option
              :value="item.value"
              v-for="item in deleteStatusOpt"
              :key="item.value"
            >{{item.content}}</Option>
          </Select>
        </FormItem>
        <FormItem label="评论状态">
          <Select v-model="formValidate.comment_status">
            <Option
              :value="item.value"
              v-for="item in commentStatusOpt"
              :key="item.value"
            >{{item.content}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancelShortVideo('formValidate')" style="margin-left: 8px">取消</Button>
        <Button type="primary" @click="handleAddShortVideo('formValidate')">添加</Button>
      </div>
    </Modal>
    <!-- 查看视频详情弹出框 -->
    <Modal
      v-model="modalShortVideo"
      title="查看视频详情"
      :closable="false"
      :mask-closable="false"
      class="userDefined top100"
      @on-ok="okVideo"
      @on-cancel="cancelVideo"
        >
      <div class="video-title">
        视频标题：
        <span v-html="videoTitle"></span>
      </div>
      <div class="player">
        <video-player
          class="video-player vjs-custom-skin"
          v-if="isVideoPlayerShow"
          ref="videoPlayer"
          style="height:620px"
          :playsinline="true"
          :options="playerOptions"
          @play="onPlayerPlay($event)"
          @pause="onPlayerPause($event)"
        ></video-player>
      </div>
    </Modal>
    <!-- 查看封面详情 -->
    <Modal v-model="modalImg" title="查看封面详情" @on-ok="ok">
      <div>
        <img :src="imgsrc" style="height:350px">
      </div>
    </Modal>
    <!-- 下架确认 -->
    <Modal v-model="sureShow" width="100px">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="ios-information-circle"></Icon>
            <span>下架视频</span>
        </p>
        <div style="text-align:center">
            <p>是否确认下架该视频？</p>
        </div>
        <div slot="footer">
            <Button type="error" size="large" long :loading="undercarriage_loading" @click="undercarriage">确认下架</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import {
  getShortVideoAll,
  editCommentStatus,
  getShortVideoById,
  deleteShortVideoLogic,
  deleteShortVideoPhysical,
  createShortVideo,
  undercarriageVideo
} from "@/api/shortVideo";
import json from "@/components/tables/city_code.json";
import { getDate2 } from "@/libs/tools.js";
export default {
  data() {
    return {
      videoTitle: "",
      ModeladdShortVideo: false,
      //判断是增加还是查看：true:查看，false：增加
      isAddorDetail: null,
      title: "",
      formItem: {
        userid: "",
        title: "",
        challengetitle: "",
        promote_count: "",
        promote_share_count: "",
        promote_play_count: "",
        is_original: "",
        is_review: "",
        textarea: ""
      },
      //查询：
      searchKey: "",
      searchColumns: [],
      searchValue: "",
      // switch1:false,
      fileBaseUrl: "https://v.fted.net/",
      screenBaseurl: 'https://img.lgh81.com/',
      //默认选中状态 ：
      isChecked: "",
      //是否显示页面内容：
      showSelection: false,
      showId: false,
      showGoodsid: false,
      showMusicid: false,
      showLongitude: false,
      showLatitude: false,
      showWidth: false,
      showHeight: false,
      showFileurl: false,
      columns: [
        {
          title: "Selection",
          key: "selection",
          type: "selection",
          width: 70,
          align: "center",
          fixed: "left"
        },
        {
          title: "短视频编号",
          key: "id",
          fixed: "left",
          width: 120,
          align: "center",
          fixed: "left"
        },
        {
          title: "视频标题",
          key: "title",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Tooltip",
                {
                  props: { placement: "bottom", transfer: true },
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    lineHeight: 30 + "px",
                    height: 30 + "px"
                  }
                },
                [
                  h("span", {
                    domProps: {
                      innerHTML: params.row.title
                    }
                  }),
                  h("span", {
                    slot: "content",
                    style: { whiteSpace: "normal", wordBreak: "break-all" },
                    domProps: {
                      innerHTML: params.row.title
                    }
                  })
                ]
              )
            ]);
          }
        },
        {
          title: "封面图",
          key: "screenfileurl",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h("img", {
              style: {
                width: "50px",
                height: "70px",
                marginTop: "5px",
                cursor: "pointer",
                objectFit: 'contain',
              },
              attrs: {
                src: params.row.screenfileurl,
                onerror:
                  "javascript:this.src='https://img.lgh81.com/timg20190605144929.jpg'"
              },
              on: {
                click: () => {
                  this.modalShortVideo = true;
                  this.isVideoPlayerShow = true;
                  this.playerOptions.sources[0].src =
                    this.fileBaseUrl + params.row.fileurl;
                  // this.playerOptions.poster = params.row.screenfileurl
                  this.videoTitle = params.row.title;
                },
                ok: () => {
                  console.log(666);
                }
              }
            });
          }
        },
        { title: "用户编号", key: "userid", width: 100, align: "center" },
        { title: "是否私密", key: "authority", width: 100, align: "center" }, //0公开1私密
        { title: "城市编号", key: "citycode", width: 100, align: "center" },
        { title: "区域编号", key: "areacode", width: 100, align: "center" },
        { title: "审核状态", key: "reviewStatus", width: 100, align: "center" },
        {
          title: "举报状态",
          key: "reportedStatus",
          width: 100,
          align: "center"
        },
        {
          title: "下架状态",
          key: "groundStatus",
          width: 100,
          align: "center"
        },
        { title: "分类id", key: "classid", width: 100, align: "center" },
        { title: "挑战id", key: "challengeid", width: 100, align: "center" },
        {
          title: "挑战标题",
          key: "challengetitle",
          width: 100,
          align: "center"
        },
        { title: "产品类型", key: "goodstype", width: 100, align: "center" },
        { title: "删除状态", key: "deleteStatus", width: 100, align: "center" }, //0未删除1删除
        {
          title: "评论状态",
          key: "commentStatus",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "i-Switch",
              {
                props: {
                  value: params.row.commentStatus.toString(),
                  "true-value": "0",
                  "false-value": "1"
                  // 'v-model':params.row.commentStatus
                },
                on: {
                  "on-change": val => {
                    // console.log(val,'val');
                    this.isLoading = true;
                    editCommentStatus({
                      ids: params.row.id.toString(),
                      status: val
                    }).then(res => {
                      // console.log(res);
                      if (res.data.code === 0) {
                        this.initData();
                        // console.log(params.row);
                        // console.log(params.row.commentStatus,'修改后的每行数据');
                      }
                    });
                  }
                }
              },
              [
                h("span", {
                  slot: "open",
                  domProps: {
                    innerHTML: "开"
                  }
                }),
                h("span", {
                  slot: "close",
                  domProps: {
                    innerHTML: "关"
                  }
                })
              ]
            );
          }
        }, //0：开
        { title: "红包id", key: "redenvelopeid", width: 100, align: "center" },
        { title: "播放次数", key: "playCount", width: 100, align: "center" },
        { title: "关注数", key: "focusCount", width: 100, align: "center" },
        { title: "粉丝数", key: "fansCount", width: 100, align: "center" },
        { title: "推广赞数", key: "promoteCount", width: 100, align: "center" },
        {
          title: "推广分享数",
          key: "promoteShareCount",
          width: 150,
          align: "center"
        },
        {
          title: "推广播放次数",
          key: "promotePlayCount",
          width: 150,
          align: "center"
        },
        { title: "是否原创", key: "isOriginal", width: 100, align: "center" }, //0原创
        { title: "评论数", key: "commentCount", width: 100, align: "center" },
        { title: "创建时间", key: "createtime", width: 130, align: "center" },
        {
          title: "上传客户端类型",
          key: "uploadClientType",
          width: 150,
          align: "center"
        },
        { title: "上传时间", key: "uploadtime", width: 130, align: "center" },
        { title: "文件大小", key: "filesize", width: 100, align: "center" },
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
                      this.formCustom.areacode = params.row.areacode;
                      this.formCustom.authority = params.row.authority;
                      this.formCustom.challengeid = params.row.challengeid;
                      this.formCustom.challengetitle =
                        params.row.challengetitle;
                      this.formCustom.citycode = params.row.citycode;
                      this.formCustom.classid = params.row.classid;
                      this.formCustom.commentCount = params.row.commentCount;
                      this.formCustom.comment_status = params.row.commentStatus;
                      this.formCustom.createtime = params.row.createtime;
                      this.formCustom.deleteStatus = params.row.deleteStatus;
                      this.formCustom.fansCount = params.row.fansCount;
                      this.formCustom.filesize = params.row.filesize;
                      this.formCustom.fileurl = params.row.fileurl;
                      this.formCustom.focusCount = params.row.focusCount;
                      this.formCustom.goodsid = params.row.goodsid;
                      this.formCustom.goodstype = params.row.goodstype;
                      this.formCustom.height = params.row.height;
                      this.formCustom.id = params.row.id;
                      this.formCustom.isOriginal = params.row.isOriginal;
                      this.formCustom.latitude = params.row.latitude;
                      this.formCustom.length = params.row.length;
                      this.formCustom.longitude = params.row.longitude;
                      this.formCustom.musicid = params.row.musicid;
                      this.formCustom.playCount = params.row.playCount;
                      this.formCustom.promoteCount = params.row.promoteCount;
                      this.formCustom.promotePlayCount =
                        params.row.promotePlayCount;
                      this.formCustom.promoteShareCount =
                        params.row.promoteShareCount;
                      this.formCustom.reportedStatus =
                        params.row.reportedStatus;
                      this.formCustom.reviewStatus = params.row.reviewStatus;
                      this.formCustom.screenfileurl = params.row.screenfileurl;
                      this.formCustom.title = params.row.title;
                      this.formCustom.uploadClientType =
                        params.row.uploadClientType;
                      this.formCustom.uploadtime = params.row.uploadtime;
                      this.formCustom.userid = params.row.userid;
                      this.formCustom.goodsid = params.row.goodsid;
                      this.formCustom.width = params.row.width;
                    }
                  }
                },
                "查看详情"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px",
                    marginBottom: "10px"
                  },
                  on: {
                    click: () => {
                      this.sureShow = true
                      this.undercarriageVideoId = params.row.id
                    }
                  }
                },
                "下架视频"
              )
              // h('Button', {
              // props: {
              // type: 'success',
              // size: 'small'
              // },
              // style: {
              // marginRight: '5px',
              // marginBottom: '10px'
              // },
              // on: {
              // click: () => {
              //     this.modalImg = true
              //     this.imgsrc = this.fileBaseUrl + params.row.screenfileurl
              // }
              // }
              // }, '查看封面'),
            ]);
          }
        }
      ],
      authorityOpt: [
        {
          value: "公开",
          content: "公开"
        },
        {
          value: "私密",
          content: "私密"
        }
      ],
      commentStatusOpt: [
        {
          value: 0,
          content: "可以评论"
        },
        {
          value: 1,
          content: "禁止评论"
        }
      ],
      isOriginalOpt: [
        {
          value: "原创",
          content: "原创"
        },
        {
          value: "非原创",
          content: "非原创"
        }
      ],
      deleteStatusOpt: [
        {
          value: "未删除",
          content: "未删除"
        },
        {
          value: "删除",
          content: "删除"
        }
      ],
      reportedStatusOpt: [
        {
          value: "未举报",
          content: "未举报"
        },
        {
          value: "举报",
          content: "举报"
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
      tableData: [],
      queryList: {
        offset: 0,
        limit: 10,
        sort: "id",
        order: "asc",
        newSearchKey: null,
        search: null
      },
      dataCount: 0,
      pageSize: 10,
      now: 1,
      isLoading: true,
      modalDetil: false,
      width: "auto",
      height: 600,
      formCustom: {},
      formValidate: {},
      widthForm: 900,
      ids: [],
      //查看短视频详情：
      modalShortVideo: false,
      isVideoPlayerShow: false,
      state: "",
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
            src: "" // 你的m3u8地址（必填）
          }
        ],
        poster: "", // 你的封面地址
        width: document.documentElement.clientWidth,
        controlBar: { fullscreenToggle: false }
        // notSupportedMessage: '此视频暂无法播放，请稍后再试'// 允许覆盖Video.js无法播放媒体源时显示的默认信息。
      },
      //查看封面：
      modalImg: false,
      imgsrc: "",
      //选中id存放：
      multipleSelectionId: [],
      multipleCommentStatus: "",
      modalEditcommentStatus: false,
      modalDelStatus: false,
      modalDelPycStatus: false,
      sureShow: false,
      undercarriage_loading: false,
      undercarriageVideoId: null, // 当前需要下架视频的ID
    };
  },

  methods: {
    // 下架
    async lowerShelf(){
        let data = {
            videoId: this.undercarriageVideoId,
            groundStatus: 1
        }
        return await undercarriageVideo(data)
    },
    // 点击确认下架
    async undercarriage(){
        try {
            this.undercarriage_loading = true
            let res = await this.lowerShelf()
            if(res.data.code === 0){
                this.undercarriage_loading = false;
                this.sureShow = false;
                this.$Message.success('下架成功');
                this.initData()
            }else{
                this.$Message.error('下架失败，请稍后再试');
            }
        } catch(err){
            console.log(err)
            this.$Message.error('下架失败，请稍后再试');
        }
        // this.undercarriage_loading = true;
        // setTimeout(() => {
        //     this.undercarriage_loading = false;
        //     this.sureShow = false;
        //     this.$Message.success('下架成功');
        // }, 2000);
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
    // 查询：
    handleSearch() {
      this.initData();
      // if(arg===''){
      //     return this.initData()
      // }
      // console.log(isNaN(arg))
      // if(isNaN(arg)||arg==0){
      //     this.isLoading = false
      //     return this.$Message.error('请输入正确的短视频编号！')
      // }
      // getShortVideoById({videoid:arg}).then(res=>{
      //     // console.log(res);
      //     this.isLoading=false
      //     if(res.data.code===0){
      //         let tempArr = []
      //         tempArr.push(res.data.data)
      //         console.log(tempArr);
      //         this.dataCount  = 1
      //         this.tableData = tempArr
      //     }else{
      //         this.tableData = []
      //         return this.$Message.error(res.data.data)
      //     }
      // })
    },
    //点击添加短视频显出弹出框：
    editShortVideoCommentStatus() {
      this.modal = true;
    },
    addShortVideo() {
      this.ModeladdShortVideo = true;
    },
    //点击确认，提交短视频：
    handleAddShortVideo() {
      console.log("点击添加短视频");
      console.log(this.formValidate);
      this.formValidate.createtime = new Date().getTime();
      this.formValidate.uploadtime = new Date().getTime();
      this.formValidate.deleteStatus === "未删除"
        ? (this.formValidate.deleteStatus = 0)
        : 1;
      this.formValidate.isOriginal === "非原创"
        ? (this.formValidate.isOriginal = 1)
        : 0;
      this.formValidate.reportedStatus === "未举报"
        ? (this.formValidate.reportedStatus = 0)
        : 1;
      // this.formValidate.reviewStatus === '已审核' ? this.formValidate.reviewStatus = 0 : 1
      // if(this.formValidate.reviewStatus)
      // createShortVideo(this.formValidate).then(res=>{
      //     console.log(res);
      // })
    },
    cancelShortVideo() {
      this.ModeladdShortVideo = false;
    },
    //清空视频时长：
    okVideo() {
      setTimeout(() => {
        this.isVideoPlayerShow = false;
        this.playerOptions.sources[0].src = "";
      }, 500);
    },
    cancelVideo() {
      this.okVideo();
    },
    onPlayerPlay(player) {},
    onPlayerPause(player) {},
    playerStateChanged(player) {},
    //触发多选框的选中状态：
    handleSelectionChange(selection) {
      console.log(selection); //[{…}, {…}, {…}]
      // console.log(selection[0].commentStatus);
      // if(selection[0]){
      //     this.multipleCommentStatus=selection[0].commentStatus.toString()||''
      //     console.log(this.multipleCommentStatus);
      //     this.multipleSelectionId = []
      //     selection.forEach(item1 => {
      //         if(item1.commentStatus!==selection[0].commentStatus){
      //                     // item2._checked=true
      //                     this.$Message.warning("请选择评论状态相同的用户")
      //                     // this.$refs.tables.clearCurrentRow()
      //         }
      //         this.multipleSelectionId.push(item1.id)
      //     })
      // }
      if (selection) {
        this.multipleSelectionId = [];
        selection.forEach(item => {
          this.multipleSelectionId.push(item.id);
        });
      }
    },
    //确认选择多选框？
    //发送修改评论请求：
    ModifyEditCommentStatus() {
      if (this.multipleSelectionId.length !== 0) {
        this.$Modal.confirm({
          title: "是否修改？",
          onOk: () => {
            editCommentStatus({
              ids: this.multipleSelectionId.toString(),
              status: this.multipleCommentStatus === "1" ? 0 : 1
            }).then(res => {
              // console.log(res,111);
              if (res.data.code === 0) {
                this.initData();
                this.$Message.success("修改成功");
                this.multipleSelectionId.length = 0;
              }
            });
          },
          onCancel: () => {}
        });
      } else {
        this.$Modal.error({ title: "请选择需要编辑的用户" });
      }
    },
    // <!-- 是否删除 -->
    ModifyDelCommentStatus() {
      if (this.multipleSelectionId.length !== 0) {
        this.$Modal.confirm({
          title: "是否删除？",
          onOk: () => {
            this.isLoading = true;
            deleteShortVideoLogic({
              ids: this.multipleSelectionId.toString()
            }).then(res => {
              if (res.data.code === 0) {
                this.initData();
                this.$Message.success("修改成功");
                this.multipleSelectionId.length = 0;
              }
            });
          },
          onCancel: () => {}
        });
      } else {
        this.$Modal.error({ title: "请选择需要编辑的用户" });
      }
    },
    ModifyDelPycCommentStatus() {
      if (this.multipleSelectionId.length !== 0) {
        this.$Modal.confirm({
          title: "是否彻底删除？",
          onOk: () => {
            this.isLoading = true;
            deleteShortVideoPhysical({
              ids: this.multipleSelectionId.toString()
            }).then(res => {
              if (res.data.code === 0) {
                this.initData();
                this.$Message.success("修改成功");
                this.multipleSelectionId.length = 0;
              }
            });
          },
          onCancel: () => {}
        });
      } else {
        this.$Modal.error({ title: "请选择需要编辑的用户" });
      }
    },
    ok() {},
    handleClear(e) {
      if (e.target.value === "") this.insideTableData = this.value;
    },
    initData() {
      getShortVideoAll(this.queryList).then(res => {
        this.tableData = res.data.rows;
        this.dataCount = res.data.total;
        this.isLoading = false;
        return this.tableData;
      });
    }
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    },
    newcolumns() {
      let tempcolumns = [];
      if (this.showGoodsid) {
        tempcolumns.push({
          title: "关联商品id",
          key: "goodsId",
          width: 80,
          align: "center"
        });
      }
      if (this.showMusicid) {
        tempcolumns.push({
          title: "关联音乐id",
          key: "musicid",
          width: 80,
          align: "center"
        });
      }
      if (this.showLongitude) {
        tempcolumns.push({
          title: "经度",
          key: "longitude",
          width: 100,
          align: "center"
        });
      }
      if (this.showLatitude) {
        tempcolumns.push({
          title: "纬度",
          key: "latitude",
          width: 100,
          align: "center"
        });
      }
      if (this.showWidth) {
        tempcolumns.push({
          title: "宽",
          key: "width",
          width: 80,
          align: "center"
        });
      }
      if (this.showHeight) {
        tempcolumns.push({
          title: "高",
          key: "height",
          width: 80,
          align: "center"
        });
      }
      if (this.showFileurl) {
        tempcolumns.push({
          title: "文件地址",
          key: "fileurl",
          width: 100,
          align: "center"
        });
      }
      if (!this.tableData) return;
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
        if (item.isOriginal === 0) {
          item.isOriginal = "原创";
        } else {
          item.isOriginal = "非原创";
        }
        if (item.deleteStatus === 0) {
          item.deleteStatus = "未删除";
        } else {
          item.deleteStatus = "删除";
        }
        if (item.reportedStatus === 0) {
          item.reportedStatus = "未举报";
        } else {
          item.reportedStatus = "举报";
        }
        switch (item.groundStatus){
            case 0:
                item.groundStatus = '未下架'
                break
            case 1:
                item.groundStatus = '已下架'
                break
            default:
                item.groundStatus = '未知'
        }
        // 时间戳转换
        item.createtime = getDate2(item.createtime);
        item.uploadtime = getDate2(item.uploadtime);
      });

      return tempcolumns.concat(this.columns);
    }
    // newSearchKey:{
    //     get:function(){
    //         // console.log('我被get了',);
    //     },
    //     set:function(newSearchKey){
    //         // console.log('我被set了',newSearchKey);
    //         this.isLoading=true
    //         this.handleSearch(newSearchKey)
    //     }
    // }
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
.video-title {
  font-size: 14px;
  margin: 0 0 10px;
}
</style>