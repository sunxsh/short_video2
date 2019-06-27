<template>
    <div>
        <div id="btn">
            <Button type="primary" @click="modifyHandleMusicStatus">批量处理音乐审核</Button>
        </div>
        <div id='isShow'>
            显示多选框：<i-switch v-model="showSelection" style="margin-right: 5px;margin-bottom:10px;"></i-switch>
        </div>
        <!-- Table -->
         <div>
            <Card style="width:100%">
                <!-- 查询 -->
              <div class="search-con search-con-top">
                    <Button type="default" style="color:#333;cursor:default">审核状态</Button>
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
         <!-- 批量审核 -->
         <Modal
            title="批量审核"
            v-model="modalModifyMusicReview"
            :mask-closable="false"
            :closable="false"          
            width="500px"
            class-name="vertical-center-modal"
            :scrollable='true'
            @on-ok="okComment"
            @on-cancel="cancelComment"
            >
            <Form :model="formCustom" :label-width="100" inline :rules="ruleValidate" ref="reviewForm" class="ModifyRemark">  
                    <FormItem label="审核状态" prop="reviewstatus" style="marginBottom:5px">
                        <RadioGroup v-model="formCustom.reviewstatus" @on-change="hasreviewed">
                            <Radio label='未审核'></Radio>
                            <Radio label='已审核'></Radio>
                            <Radio label='未通过'></Radio>
                        </RadioGroup>
                    </FormItem>        
                </Form>
         </Modal>
         <!-- 查看详情弹出框  @on-ok="asyncOK('formCustom')"-->
        <Modal
            title="审核详情"
            v-model="modalShortVideo"
            :mask-closable="false"
            :closable="false"          
            :width="widthForm"
            :scrollable='true'
            >
                <div class="container" style="width:720px;">   
                    <aplayer 
                        ref='aplayers'
                        autoplay
                        v-if='isMusicPlayerShow'
                        :music="musicPlayer"
                        style="width:350px;"
                        />
                </div>
            <div style="marginTop:20px">
                <Form :model="formCustom" :label-width="100" :rules="ruleValidate" ref="reviewForm">  
                    <!-- <FormItem label="音乐编号" prop="id" style="marginBottom:5px">
                        <Input type="text" v-model="formCustom.id" number/>
                    </FormItem>
                    <FormItem label="音乐名称" prop="name" style="marginBottom:5px">
                        <Input type="text" v-model="formCustom.name" number/>
                    </FormItem>                   
                    <FormItem label="审核人" prop="reviewuserid" style="marginBottom:5px">
                        <Input type="text" v-model="formCustom.reviewuserid" number/>
                    </FormItem> -->
                    <!-- <FormItem label="审核时间" prop="reviewtime" style="marginBottom:5px">
                    <Input type="text" v-model="formCustom.reviewtime" number disabled/>
                    </FormItem> -->
                    <!-- <FormItem label="创建时间" prop="createtime" style="marginBottom:5px">
                    <Input type="text" v-model="formCustom.createtime" number disabled/>
                    </FormItem> -->
                    <FormItem label="审核状态" prop="reviewstatus" style="marginBottom:5px">
                        <RadioGroup v-model="formCustom.reviewstatus" @on-change="hasreviewed" style="width:200px">
                            <Radio label='未审核'></Radio>
                            <Radio label='已审核'></Radio>
                            <Radio label='未通过'></Radio>
                        </RadioGroup>
                    </FormItem>     
                     <FormItem label="备注" prop="remark" style="marginBottom:5px" v-if="isActiveAll">
                        <Select v-model="myRemarkModel" style="width:200px" @on-change="handleChange">
                            <Option v-for="item in remarkList" :value="item.value" :key="item.value" v-if="unPass">{{ item.label }}</Option>
                            <Option v-for="item in remarkList" :value="item.value" :key="item.value" v-if="isReviewed">{{ item.label }}</Option>
                        </Select>
                    </FormItem>  
                    <FormItem class="userDefinedReasonMusic" prop="remarkMore" v-if="isIptShow"><Input v-model="formCustom.remarkMore" type="text" placeholder="请输入审核未通过原因" style="height:30px;vertical-align:top" autofocus/></FormItem>     
                </Form>
            </div>
          <div slot="footer">
                <Button style="margin-left: 8px" @click="cancelMusicReview">取消</Button>
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
            :scrollable='true'
            >
            <Table
                stripe
                highlight-row
                ref="tableTwo" 
                :data="queryReviewcords" 
                :columns="queryReviewcolumns"
                :loading='isLoading'
                @on-selection-change="handleSelectionChange"             
                >
              </Table>
        </Modal>
  </div>
</template>

<script>
import Aplayer from 'vue-aplayer'
import {getMusicByReviewStatus,getMusicById,updatebgMusicReview,getMusicReview,updatebgMusicReviewsByIds} from '@/api/music'
export default {
  name: 'music_review',
  components: {
    Aplayer
  },
  data () {
    return {
    isIptShow:false,
    myRemarkModel:'',
    modal12: false,
    //查询：
    searchKey:'',
    antherColumns:[],
    reviewList:[
        {value:'0',label:'未审核'},
        {value:'1',label:'已审核'},
        {value:'2',label:'未通过'}
    ],
    //批量审核：
    modalModifyMusicReview:false,
    //选中id存放：
    multipleSelectionId:[],
    multipleCommentStatus:'',
    //设置审核详情：
    unPass:false,
    isActiveAll:false,
    isReviewed:false,
    remarkList:[],
    ruleValidate: {},
    //查询审核记录：
    modalReviewcords:false,
    queryReviewcords:[],
    fileBaseUrl:'https://v.fted.net/',
    //是否显示页面内容：
    showSelection:false,
    showId:false,
    showuserid:false,
    showMusicid:false,
    columns: [
        {title: '音乐编号', key: 'id', align: 'center'},
        {title: '相关用户编号', key: 'userid', align: 'center'},
        {title: '音乐名称', key: 'name', align: 'center'},
        {title: '音乐作者', key: 'author', align: 'center'},
        {title: '审核状态', key: 'reviewstatus', align: 'center'},
        {title: '是否原创', key: 'isoriginal', align: 'center'},
        {title: '创建时间', key: 'createtime', align: 'center'},
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
                            type: 'error',
                            size: 'small',
                            disabled:false
                        }, 
                        style: {
                            marginRight: '5px',
                            marginBottom: '10px',
                            marginTop:'10px'
                        },
                        on: {
                            click:() => {
                                this.isIptShow = false
                                // console.log(params.row);
                                this.formCustom.id=params.row.id
                                this.formCustom.name=params.row.name
                                this.formCustom.reviewstatus=params.row.reviewstatus
                                this.formCustom.remark=params.row.remark
                                this.formCustom.createtime=params.row.createtime
                                this.formCustom.reviewtime=params.row.reviewtime
                                this.getMusicUrlByClassId(params.row.id)
                                this.modalShortVideo = true
                            },         
                        }
                    }, '审核'),
                    h('Button', {
                        props: {
                        type: 'info',
                        size: 'small'
                        }, 
                        style: {
                        marginRight: '5px',
                        marginBottom: '10px'
                        },
                        on: {
                            click: () => {
                                this.modalReviewcords=true
                                getMusicReview({musicid:params.row.id}).then(res=>{
                                    this.queryReviewcords=res.data.rows
                                })                              
                            }
                        }
                    }, '审核记录'),
                ]);
            }
        }
    ],
    queryReviewcolumns:[
        {title: '音乐编号', key: 'musicId',width:100, align: 'center'},
        {title: '审核人', key: 'reviewUserid',width:100, align: 'center'},
        {title: '审核时间', key: 'reviewtime', align: 'center'},
        {title: '备注', key: 'remark', align: 'center'},
    ],
    tableData: [],
    queryList:{
        offset:0,//0,11,21
        limit:10,
        sort:'id',
        order:'asc',
        reviewStatus:'0'//此处接口大写！烦死了
    },
    dataCount:0,
    pageSize:10,
     now:1,
    isLoading:true,
    modalShortVideo: false,
    width:'100%',
    height:600,
    formCustom: {},
    widthForm:440,
    ids:[],
    //查看短视频详情：
    modalShortVideo:false,
    isMusicPlayerShow:false,
    musicPlayer:{
        title: 'secret base~君がくれたもの~',
        artist: 'Silent Siren',
        src: '',
        pic: ''
    },
    state:'',
    //查看封面：
    modalImg:false,
    imgsrc:'',
    loading:true,
    //显示举报评论：
    valueReportContent:'',
    visible: false
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
    handleOpen () {
        this.visible = true;
    },
    handleClose () {
        this.visible = false;
    },
    //查询：
    handleSearch(){
        this.queryList.reviewStatus=this.searchKey
        this.initData()
    },
    //处理批量审核：
    modifyHandleMusicStatus(){
        if(this.multipleSelectionId.length!==0){
            this.modalModifyMusicReview=true
        }else{
            this.$Modal.warning({'title':'请选择需要审核的用户'})
        }
    },
    //触发多选框的选中状态：
    handleSelectionChange(selection){
        // console.log(selection);//[{…}, {…}, {…}]
        if(selection[0]){
            this.multipleCommentStatus=selection[0].reviewstatus
            this.formCustom.reviewstatus=this.multipleCommentStatus
            this.hasreviewed(this.formCustom.reviewstatus)
            this.multipleSelectionId = []
            selection.forEach(item1 => {
                this.multipleSelectionId.push(item1.id)
            })
        }else{
            this.multipleSelectionId.length=0
        }   
    },
    //批量审核：
    okComment(){
        this.$store.commit('updateIsReload', false)
        this.isLoading=true
        // console.log(this.formCustom.reviewstatus,2);
        updatebgMusicReviewsByIds({musicids:this.multipleSelectionId.toString(),status:this.formCustom.reviewstatus==='已审核'?1:2}).then(res=>{
            if(res.data.code===0){
                this.initData()
                this.$Message.success('修改成功')
                this.multipleSelectionId.length=0
                this.$store.commit('updateIsReload', true)
            }
        })
    },
    cancelComment(){},
    //单选框的change事件：
    hasreviewed(val){
        console.log(val);
        this.myRemark=''
        if(val==="已审核"){
            this.unPass=false
            this.isActiveAll=true
            this.isReviewed=true
            this.remarkList=[
                {value:'审核通过',label:'审核通过'},
            ]
           this.myRemark=this.remarkList[0].value
        }else if(val==="未通过"){
            this.unPass=true
            this.isActiveAll=true
            this.isReviewed=false
            this.remarkList=[
                {value:'涉黄',label:'涉黄'},
                {value:'涉黑',label:'涉黑'},
                {value:'其他',label:'其他'}
            ]
            // this.myRemark=this.remarkList[0].value
        }else{
            this.unPass=false
            this.isActiveAll=false
            this.isReviewed=false
        }
    },
    //select框的change事件：
    handleChange(value){
        // console.log(value);
        // if(value==='其他'){
        //     this.isIptShow = true
        // }else{
        //     this.isIptShow = false
        // }
        //在这个change方法中，就无法监听，单选框发生变化后isIptShow隐藏
    },
    //处理审核：
    handleReview(name){
        // if(!(this.myRemarkModel || this.formCustom.remarkMore)){
        //     console.log(!this.myRemarkModel);
        //     return this.$Message.error('请输入未通过类型')
        // }
        if(this.isIptShow){
            this.formCustom.remark = this.formCustom.remarkMore
            if(!this.myRemarkModel||!this.formCustom.remarkMore){
                return this.$Message.error('请输入未通过类型')
            }
        }else{
            this.formCustom.remark = this.myRemarkModel
            if(!this.myRemarkModel){
                return this.$Message.error('请输入未通过类型')
            }
        }
        this.$refs[name].validate((valid) => {
            if(valid){
                this.$Modal.confirm({
                    "title":"是否确认处理审核？",
                    onOk: () => {
                        console.log(this.formCustom.id,this.formCustom.reviewstatus,this.formCustom.remark);
                        this.$store.commit('updateIsReload', false)
                        if(this.formCustom.reviewstatus==="未审核"){
                            this.formCustom.reviewstatus=0
                        }else if(this.formCustom.reviewstatus==="已审核"){
                            this.formCustom.reviewstatus=1
                        }else if(this.formCustom.reviewstatus==="未通过"){
                            this.formCustom.reviewstatus=2
                        }
                        updatebgMusicReview({musicid:this.formCustom.id,status:this.formCustom.reviewstatus,remark:this.formCustom.remark}).then(res=>{
                            console.log(res);
                            if(res.data.code===0){
                                this.$Message.info(res.data.data)
                                this.isLoading=true
                                this.initData()
                                this.$store.commit('updateIsReload', true)
                                this.cancelMusicReview()
                            }else{
                                this.$Message.info(res.data.data)
                            }
                        })
                    },
                    onCancel: () => {
                    }
                })                
            }
        })     
    },
    cancelMusicReview(){
         setTimeout(()=>{
            this.isMusicPlayerShow=false
        },500)
        this.modalShortVideo=false
        this.isActiveAll=false
        this.formCustom.remarkMore = ''
    },
    change (status) {
        this.$Message.info('开关状态：' + status)
    },
    handleDelete (params) {
      console.log(params)//{row: {…}, index: 2, column: {…}, tableData: Array(9)}
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    //获取音乐地址：
    getMusicUrlByClassId(id){
        getMusicById({musicid:id}).then(res=>{
            if(res.data.code===0){
                this.musicPlayer.src = res.data.data.fileurl
                // console.log(this.musicPlayer.src,'src');
                this.musicPlayer.pic= res.data.data.picture
                this.musicPlayer.title=res.data.data.name
                this.musicPlayer.artist=res.data.data.author
                this.isMusicPlayerShow=true
                // console.log(this.musicPlayer);
            }else{
                this.$Message.error(res.data.data)
            }
        })
    },
    initData(){
        getMusicByReviewStatus(this.queryList).then(res=>{
            if(res.data.code == 0){
                this.tableData = res.data.rows
                this.dataCount = res.data.total
                this.isLoading=false
            }else {
                this.$Message.error(res.data.data);
                this.isLoading=false
            }
           
        })
    },  
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
                if(item.reviewstatus===0){
                    item.reviewstatus="未审核"
                }else if(item.reviewstatus===1){
                    item.reviewstatus="已审核"
                }else if(item.reviewstatus===2){
                    item.reviewstatus="未通过"
                }        
                if(item.isoriginal===1){
                    item.isoriginal="原创"
                }else if(item.isoriginal===0){
                    item.isoriginal="非原创"
                }      
            })
             }
            return this.tableData
        },
        myRemark:{
            get:function(){
                console.log('我被getter了');
                return this.myRemarkModel
            },
            set:function(myRemark){
                console.log(myRemark,'我是myRemark我被设置了');
                this.myRemarkModel = myRemark
            }
        }
    },
    watch:{
        queryList: {
            handler:function(newval,oldval){
                this.initData()
                console.log(newval,'newval')
            },
            deep:true           
        },
        myRemarkModel(newValue){
            console.log(newValue,'我被监听了');
            if(newValue==='其他'){
                this.isIptShow = true
            }else{
                this.isIptShow = false
            }
        }
    },
  created () {
      this.initData()
  },

}
</script>

<style lang="less" scoped>
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
.vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal{
        top: 0;
    }
}
</style>