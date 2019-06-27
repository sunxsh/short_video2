<template>
    <div>
        <div id='isShow'>
            显示多选框：<i-switch v-model="showSelection" style="margin-right: 5px;margin-bottom:10px;"></i-switch>
            <!-- 显示编号：<i-switch v-model="showId" style="margin-right: 5px;margin-bottom:10px;"></i-switch> -->
            <!-- 显示相关用户编号：<i-switch v-model="showuserid" style="margin-right: 5px;margin-bottom:10px;"></i-switch> -->
        </div>
        <!-- Table -->
         <div>
           <!-- style="table-layout: auto;word-break: keep-all;" -->
            <Card style="width:100%">
                <!-- 查询 -->
              <div class="search-con search-con-top">
                    <Button type="default" style="color:#333;cursor:default">举报状态</Button>
                    <Select v-model="searchKey" class="search-col">
                        <Option v-for="item in reviewList" :value="item.value" :key="`search-col-${item.value}`">{{ item.label }}</Option>
                    </Select>
                    <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;搜索</Button>
              </div>
              <Table
              stripe
              highlight-row
              ref="tables" 
              :data="newTableData" 
              :columns="newcolumns"
              :loading='isLoading'
              @on-selection-change="handleSelectionChange"             
              >
              </Table>
               <change-page :totalPage="dataCount" @getPages="handlePage" @changes="handleChange"></change-page>
            </Card>
         </div>
         <!-- 查看详情弹出框  @on-ok="asyncOK('formCustom')"-->
        <Modal
            title="处理举报"
            v-model="modalShortVideo"
            :mask-closable="false"
            :closable="false"          
            :width="widthForm"
            :scrollable='true'
            >
                <div class="container" style="width:800px">
                    <div class="player">
                        <video-player  class="video-player vjs-custom-skin anyWay"
                            v-if="isVideoPlayerShow"
                            ref="videoPlayer"
                            :playsinline="true"
                            :options="playerOptions"
                            @play="onPlayerPlay($event)"
                            @pause="onPlayerPause($event)"
                        >
                        </video-player>
                    </div>
                </div>
                <div>
                    <p style="marginTop:10px;marginBottom:10px;fontSize:18px;"><strong>举报内容：</strong></p>
                    <Input v-model="valueReportContent" type="textarea" :disabled="true" size="small" autosize/>
                </div>
          <div slot="footer">
                <Button style="margin-left: 8px" @click="cancelVideoDispose">取消</Button>
                <Button type="primary" @click="handleDispose">处理</Button>
          </div>
        </Modal>
        <!-- 查看大图 -->
        <Modal
        title="查看大图"
        v-model="isShowBigPic"
        :mask-closable="false"
        class="justOnlyCenter"
        >
        <viewer  style="z-index:999;" toolbar=false>
            <img :src="BigPic" class="userDefineImg">
        </viewer>
        <div slot="footer">
            <Button type="info" @click="isShowBigPic=false">确定</Button>
        </div>
        </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import {getVideoReportsByDispose, updateVideoReport} from '@/api/report'
import {getShortVideoById} from '@/api/shortVideo'
// import json from '@/components/tables/city_code.json'
export default {
  name: 'tables_page',
  components: {
    Tables,
    // videoPlayer
  },
  data () {
    return {
    //查看大图:
    isShowBigPic:false,
    BigPic:'',
     //查询：
    searchKey:'',
    reviewList:[
        {value:'0',label:'未处理'},
        {value:'1',label:'已处理'},
        {value:'',label:'所用举报'},
    ],
    fileBaseUrl:'https://v.fted.net/',
    //默认选中状态 ：
    isChecked:'',
    //是否显示页面内容：
    showSelection:false,
    showId:false,
    showuserid:false,
    showMusicid:false,
    // showFileurl:'',
    // showScreenfileurl:'',
      columns: [
        // {title: 'Selection', key: 'selection', type: 'selection',width: 30, align: 'center',fixed: 'left'},
        {title: '编号', key: 'id',width: 80, align: 'center'},
        {title: '短视频编号', key: 'shortvideoid', align: 'center'},
        {title: '短视频发布用户编号', key: 'issueUserid', align: 'center'},
        {title: '举报用户编号', key: 'userid', align: 'center'},
        {
            title: '举报图片', key: 'picture', align: 'center',
            render: (h,params) => {
                return h('img',{
                    style:{
                        width:'64px',
                        height:'auto',
                        marginTop:'5px',
                        cursor:'pointer'
                    },
                    attrs:{
                        src:params.row.picture
                    },
                    on: {
                        click: ()=>{
                            this.isShowBigPic = true
                            this.BigPic = params.row.picture
                        }
                    }
                })
            }
        },
        {title: '举报类型', key: 'type', align: 'center'},
        {title: '举报内容', key: 'content', align: 'center'},
        {title: '举报时间', key: 'createtime', align: 'center'},
        {title: '处理状态', key: 'isDispose', align: 'center'},//'0未处理1处理',
        {
            title: '操作',
            key: 'action',
            width: 100,
            fixed: 'right',
            align: 'center',
            render: (h, params) => {
            //h是定义的元素，params是该元素的所有性质(对象)，
            //嵌套的其他元素
            return h('div', [  
            h('Button', {
            props: {
            type: 'error',
            size: 'small',
            disabled:false
            }, 
            style: {
            marginRight: '5px',
            },
            //on就是用来绑定事件的
            on: {
            //获取当前行信息，并更新赋值
            click:() => {
                // console.log(params.row);
                // if(params.row.isDelete==="删除"){
                //     return this.$Modal.error({"title":"该条数据已删除"})
                // }
                // this.formItems1=params.row
                // this.formCustom.id=params.row.id
                this.formCustom.shortvideoid=params.row.shortvideoid
                // this.formCustom.issueUserid=params.row.issueUserid
                // this.formCustom.userid=params.row.userid
                // this.formCustom.type=params.row.type
                // this.formCustom.content=params.row.content
                // this.formCustom.createtime=params.row.createtime
                // this.formCustom.picture=params.row.picture
                this.formCustom.isDispose=params.row.isDispose
                this.getVideourl(params.row.shortvideoid)
                this.valueReportContent=params.row.content
                this.modalShortVideo = true
                // this.isVideoPlayerShow=true
            },
         
            }
            }, '处理举报'),
            ]);
            }
            }
      ],
      tableData: [],
      queryList:{
        offset:0,//0,11,21
        limit:10,
        sort:'id',
        order:'asc',
        isDispose:0
      },
      dataCount:0,
      pageSize:10,
      now:1,
      isLoading:true,
      modalDetil: false,
      width:'100%',
      height:600,
      formCustom: {
      },
      widthForm:830,
      ids:[],
      //查看短视频详情：
      modalShortVideo:false,
      isVideoPlayerShow:false,
      videoFileurl:'',
      playerOptions: {
            // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
            autoplay: true, // 如果true,浏览器准备好时开始回放。
            muted: false, // 默认情况下将会消除任何音频。
            loop: false, // 导致视频一结束就重新开始。
            preload: false, // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
            language: 'zh-CN',
            aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
            fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
            sources: [{
            type: 'video/mp4',
            // src: 'https://v.fted.net/'+this.tableData.map(item=>item.fileurl)// 你的m3u8地址（必填）
            src: ''// 你的m3u8地址（必填）
            }],
            poster: '', // 你的封面地址
            width: document.documentElement.clientWidth,
            // notSupportedMessage: '此视频暂无法播放，请稍后再试'// 允许覆盖Video.js无法播放媒体源时显示的默认信息。
            controlBar: {fullscreenToggle: false},
        },
      state:'',
        //查看封面：
        modalImg:false,
        imgsrc:'',
        //选中id存放：
        multipleSelectionId:[],
        loading:true,
        //显示举报评论：
        valueReportContent:''
    }
  },
  methods: {
    //处理分页：
    handlePage(data){
        this.queryList.offset = 0
        this.isLoading = true
        this.queryList.limit = data
        // console.log(this.queryList)
    },
    //改变当前页：
    handleChange(page){
        this.isLoading = true
        this.queryList.offset = page
        // console.log(this.queryList,'this.queryList2')
    },
    handleDispose(){
        // console.log(this.formCustom.isDispose);
        if(this.formCustom.isDispose==="已处理") return this.$Modal.error({"title":"该状态已处理！"})
        this.$Modal.confirm({
            "title":"是否确认处理举报？",
            onOk: () => {
                updateVideoReport({shortvideoid:this.formCustom.shortvideoid,isDispose:1}).then(res=>{
                    console.log(res);
                    if(res.data.code===0){
                        this.$Message.info(res.data.data)
                        this.isLoading=true
                        this.initData()
                        // this.modalDetil=false
                        this.cancelVideoDispose()
                    }else{
                        this.$Message.info(res.data.data)
                    }
                })

            },
            onCancel: () => {
                // this.$Message.info('Clicked cancel');
            }
        })                
    },
    cancleDispose(){
        this.modalDetil=false
    },
    change (status) {
            this.$Message.info('开关状态：' + status);
    },
    handleDelete (params) {
      console.log(params)//{row: {…}, index: 2, column: {…}, tableData: Array(9)}
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    //查询：
    handleSearch(){
        // console.log(this.searchKey);
        this.queryList.isDispose=this.searchKey
        this.initData()
    },
    //触发多选框的选中状态：
    handleSelectionChange(selection){
        console.log(selection);//[{…}, {…}, {…}]
        // console.log(selection[0].commentStatus);
        if(selection){
            this.multipleSelectionId = []
            selection.forEach(item => {
                this.multipleSelectionId.push(item.id)
            })
        }
    },
    //确认选择多选框？
    modifyEditStickersStatus(){
        if(this.multipleSelectionId.length!==0){
            this.$Modal.confirm({
                "title":"是否批量修改贴纸收费状态？",
                onOk: () => {
                    console.log(this.multipleSelectionId);
                    // updateAllItemPriceFlag({ids:this.multipleSelectionId.toString()}).then(res=>{
                    //     console.log(res);
                    //     if(res.data.code===1){
                    //         this.$Message.info("修改成功")
                    //         // this.$Alert.success("删除成功")
                    //         this.isLoading=true
                    //         this.initData()
                    //         this.multipleSelectionId.length=0
                    //     }
                    // })
    
                },
                onCancel: () => {
                    // this.$Message.info('Clicked cancel');
                }
            })
        }else{
            this.$Modal.error({"title":'请选择需要编辑的用户'})
        }
    },
    initData(){
        getVideoReportsByDispose({querylist:this.queryList}).then(res => {
            this.isLoading=false
            if(res.data.total != 0){
                this.tableData = res.data.rows
                this.dataCount = res.data.total               
            }else{
                this.$Message.error(res.data.data)
            }
        })
    },  
    //获取视频地址：
    getVideourl(id){
        getShortVideoById({videoid:id}).then(res=>{
            console.log(res);
            if(res.data.code===0){
                this.videoFileurl=res.data.data.fileurl
                // console.log(this.videoFileurl,111);
                this.playerOptions.sources[0].src= this.fileBaseUrl + this.videoFileurl
                this.playerOptions.poster=this.fileBaseUrl+res.data.data.screenfileurl
                this.isVideoPlayerShow=true
            }else{
                this.$Message.error(res.data.data)
            }
        })
    },
    onPlayerPlay (player) {
    },
    onPlayerPause (player) {
        //console.log('player pause!', player)
    },
    playerStateChanged (player) {
    },
    cancelVideoDispose(){
         setTimeout(()=>{
            this.isVideoPlayerShow=false
            this.playerOptions.sources[0].src=''
        },500)
        this.modalShortVideo=false
    }
  },
    computed: {
        newcolumns(){
            let tempcolumns = []
            if(this.showSelection){
                tempcolumns.push({title: 'Selection', key: 'selection', type: 'selection',width: 50, align: 'center',fixed:'left'})
            }
            return tempcolumns.concat(this.columns)
        },
        newTableData(){
            if(this.tableData){
                this.tableData.forEach(item=>{
                if(item.isDispose===0){
                    item.isDispose="未处理"
                }else if(item.isDispose===1){
                    item.isDispose="已处理"
                }    
                switch(item.type) {
                    case 0:
                    item.type="色情低俗";
                    break;
                    case 1:
                    item.type="政治敏感";
                    break;
                    case 2:
                    item.type="违法犯罪";
                    break;
                    case 3:
                    item.type="垃圾广告、售卖假货等";
                    break;
                    case 4:
                    item.type="造谣传播、涉嫌欺诈";
                    break;
                    case 5:
                    item.type="侮辱谩骂";
                    break;
                    case 6:
                    item.type="盗用TA人作品";
                    break;
                    case 7:
                    item.type="未成年人不当行为";
                    break;
                    case 8:
                    item.type="内容不适合未成年观看";
                    break;
                    case 9:
                    item.type="引人不适";
                    break;
                    case 10:
                    item.type="疑似自我伤害";
                    break;
                    case 11:
                    item.type="诱导点赞、分享、关注";
                    break;
                    case 12:
                    item.type="其他";
                    break;                   
                }
            })
        }           
            return this.tableData
        }
    },
    watch:{
        queryList: {
            handler:function(newval,oldval){
                this.initData()
                console.log(newval,'newval')
            },
            deep:true           
        }
    },
  created () {
      this.initData()
  },

}
</script>



<style scoped>
#btn{
    margin-bottom: 10px;
}
 #btn .ivu-btn-primary{
    margin-right: 8px;
 }
 #isShow{
     margin-bottom:10px;
 }
.demo-spin-container{
    display: inline-block;
    width: 200px;
    height: 100px;
    position: relative;
    border: 1px solid #eee;
}

</style>