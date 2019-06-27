<template>
    <div>
        <div id="btn">
            <Button type="primary" @click="modifyHandleCommentStatus">批量处理评论状态</Button>
        </div>
        <div id='isShow'>
            显示多选框：<i-switch v-model="showSelection" style="margin-right: 5px;margin-bottom:10px;"></i-switch>
        </div>
        <!-- Table -->
         <div>
            <Card style="width:100%">
                <!-- 查询 -->
              <div class="search-con search-con-top">
                    <Button type="default" style="color:#333;cursor:default;margin-right: 10px;">审核状态</Button>
                    <Select v-model="searchKey" class="search-col" @on-change="searchKeychange">
                        <Option v-for="item in reviewList" :value="item.value" :key="`search-col-${item.value}`">{{ item.label }}</Option>
                    </Select>
                    <Button @click="handleSearch" class="search-btn" type="primary" ><Icon type="search"/>&nbsp;&nbsp;搜索</Button>
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
            v-model="modalModifyCommentReview"
            :mask-closable="false"
            :closable="false"          
            :width="widthForm"
            :styles="{top: '20px'}"
            :scrollable='true'
            @on-ok="okComment"
            @on-cancel="cancelComment"
            >
            <Form :model="formCustom" :label-width="100" inline :rules="ruleValidate" ref="reviewForm" class="ModifyRemark">  
                    <FormItem label="审核状态" prop="reviewStatus" style="marginBottom:5px">
                        <RadioGroup v-model="formCustom.reviewStatus">
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
            v-model="modalComment"
            :mask-closable="false"
            :closable="false"          
            :width="widthForm"
            :styles="{top: '20px'}"
            :scrollable='true'
            >
            <div style="width:400px;">
                <Form :model="formCustom" :label-width="100" inline :rules="ruleValidate" ref="reviewForm">  
                    <FormItem label="编号" prop="id" style="marginBottom:5px">
                        <Input type="text" v-model="formCustom.id" number/>
                    </FormItem>
                    <FormItem label="短视频编号" prop="videoid" style="marginBottom:5px">
                        <Input type="text" v-model="formCustom.videoid" number/>
                    </FormItem>                   
                    <FormItem label="审核人" prop="reviewuserid" style="marginBottom:5px">
                        <Input type="text" v-model="formCustom.reviewuserid" number/>
                    </FormItem>
                    <FormItem label="引用评论编号" prop="quoteid" style="marginBottom:5px">
                        <Input type="text" v-model="formCustom.quoteid"/>
                    </FormItem>
                    <FormItem label="引用评论内容" prop="quotecontent" style="marginBottom:5px">
                        <Input type="text" v-model="formCustom.quotecontent"/>
                    </FormItem>
                    <FormItem label="评论内容" prop="content" style="marginBottom:5px">
                        <Input type="text" v-model="formCustom.content"/>
                    </FormItem>
                    <FormItem label="创建时间" prop="createtime" style="marginBottom:5px">
                    <Input type="text" v-model="formCustom.createtime" number disabled/>
                    </FormItem>
                    <FormItem label="修改时间" prop="modifiedtime" style="marginBottom:5px">
                    <Input type="text" v-model="formCustom.modifiedtime" number disabled/>
                    </FormItem>
                    <FormItem label="审核状态" prop="reviewStatus" style="marginBottom:5px">
                        <RadioGroup v-model="formCustom.reviewStatus" @on-change="hasreviewed"  style="width:200px">
                            <Radio label='未审核'></Radio>
                            <Radio label='已审核'></Radio>
                            <Radio label='未通过'></Radio>
                        </RadioGroup>
                    </FormItem>     
                    <FormItem label="备注" prop="memo" style="marginBottom:5px" v-if="isActiveAll">
                        <Select v-model="myRemarkModel" style="width:200px">
                            <Option v-for="item in memoList" :value="item.value" :key="item.value" v-if="unPass">{{ item.label }}</Option>
                            <Option v-for="item in memoList" :value="item.value" :key="item.value" v-if="isReviewed">{{ item.label }}</Option>
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
            width="900px"
            :scrollable='true'
            >
            <Table
                stripe
                highlight-row
                ref="tableTwo" 
                :data="newQueryReviewcords" 
                :columns="queryReviewcolumns"
                :loading='isLoading'
                >
              </Table>
        </Modal>
  </div>
</template>

<script>
import Aplayer from 'vue-aplayer'
import {getCommentReview, getCommentByReviewStatus,getCommentReviewById, updateCommentReviewById, updateCommentReviewsByIds} from '@/api/comment'
// import json from '@/components/tables/city_code.json'
import { getDate2 } from '@/libs/tools.js'
export default {
  name: 'music_review',
  components: {
    Aplayer
  },
  data () {
    return {
    isIptShow:false,
    myRemarkModel:'',
    //查询：
    searchKey:'',
    antherColumns:[],
    reviewList:[
        {value:0,label:'未审核'},
        {value:1,label:'已审核'},
        {value:2,label:'未通过'}
    ],
    //批量审核：
    modalModifyCommentReview:false,
    //设置审核详情：
    unPass:false,
    isActiveAll:false,
    isReviewed:false,
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
    // showFileurl:'',
    // showScreenfileurl:'',
    columns: [
        // {title: 'Selection', key: 'selection', type: 'selection',width: 30, align: 'center',fixed: 'left'},
        {title: '编号', key: 'id', align: 'center'},
        {title: '评论人编号', key: 'userid', align: 'center'},
        {title: '短视频编号', key: 'videoid', align: 'center'},
        {title: '审核状态', key: 'reviewStatus', align: 'center'},
        {title: '引用评论编号', key: 'quoteid', align: 'center'},
        {title: '引用评论内容', key: 'quotecontent', align: 'center'},
        {title: '评论内容', key: 'content', align: 'center'},
        {title: '创建时间', key: 'createtime', align: 'center'},
        {title: '修改时间', key: 'modifiedtime', align: 'center'},
        {
            title: '操作',
            key: 'action',
            width: 200,
            fixed: 'right',
            align: 'center',
            render: (h, params) => {
                let arr = []
                if(this.showShButton)arr.push(
                    h('Button', {
                        props: {
                            type: 'error',
                            size: 'small',
                            disabled:false
                        }, 
                        style: {
                            marginRight: '10px',
                            marginBottom: '10px',
                            marginTop:'10px'
                        },
                        on: {
                            click:() => {
                                this.isIptShow = false
                                this.formCustom.id=params.row.id
                                this.formCustom.videoid=params.row.videoid
                                this.formCustom.quoteid=params.row.quoteid
                                this.formCustom.reviewStatus=params.row.reviewStatus
                                this.formCustom.content=params.row.content
                                this.formCustom.quotecontent=params.row.quotecontent
                                this.formCustom.createtime=params.row.createtime
                                this.formCustom.modifiedtime=params.row.modifiedtime
                                this.modalComment = true
                            },         
                        }
                    }, '审核'),
                )
                arr.push(
                    h('Button', {
                        props: {
                        type: 'info',
                        size: 'small'
                        }, 
                        style: {
                        marginRight: '10px',
                        marginBottom: '10px',
                        marginTop: '10px',
                        },
                        //on就是用来绑定事件的
                        on: {
                            //获取当前行信息，并更新赋值
                            click: () => {
                                this.modalReviewcords=true
                                console.log(params.row.id);
                                getCommentReviewById({commentid:params.row.id}).then(res=>{
                                    // console.log(res);
                                    this.queryReviewcords=res.data.rows
                                })                              
                            }
                        }
                    }, '审核记录'),
                )
                return h('div',arr)
                // return h('div', [
                //     h('Button', {
                //         props: {
                //             type: 'error',
                //             size: 'small',
                //             disabled:false
                //         }, 
                //         style: {
                //             marginRight: '10px',
                //             marginBottom: '10px',
                //             marginTop:'10px'
                //         },
                //         on: {
                //             click:() => {
                //                 this.isIptShow = false
                //                 this.formCustom.id=params.row.id
                //                 this.formCustom.videoid=params.row.videoid
                //                 this.formCustom.quoteid=params.row.quoteid
                //                 this.formCustom.reviewStatus=params.row.reviewStatus
                //                 this.formCustom.content=params.row.content
                //                 this.formCustom.quotecontent=params.row.quotecontent
                //                 this.formCustom.createtime=params.row.createtime
                //                 this.formCustom.modifiedtime=params.row.modifiedtime
                //                 this.modalComment = true
                //             },         
                //         }
                //     }, '审核'),
                //     h('Button', {
                //         props: {
                //         type: 'info',
                //         size: 'small'
                //         }, 
                //         style: {
                //         marginRight: '10px',
                //         marginBottom: '10px',
                //         marginTop: '10px',
                //         },
                //         //on就是用来绑定事件的
                //         on: {
                //             //获取当前行信息，并更新赋值
                //             click: () => {
                //                 this.modalReviewcords=true
                //                 console.log(params.row.id);
                //                 getCommentReviewById({commentid:params.row.id}).then(res=>{
                //                     // console.log(res);
                //                     this.queryReviewcords=res.data.rows
                //                 })                              
                //             }
                //         }
                //     }, '审核记录'),
                // ]);
            }
        }
    ],
    queryReviewcolumns:[
        {title: '编号', key: 'id',width:100, align: 'center'},
        {title: '评论编号', key: 'commentid',width:100, align: 'center'},
        {title: '审核人', key: 'reviewuserid',width:100, align: 'center'},
        {title: '审核时间', key: 'reviewtime', align: 'center'},
        {title: '创建时间', key: 'createtime', align: 'center'},
        {title: '备注', key: 'memo', align: 'center'},
    ],
    tableData: [],
    queryList:{
        offset:0,//0,11,21
        limit:10,
        sort:'id',
        order:'asc',
        reviewStatus: 0
    },
    dataCount:0,
    pageSize:10,
     now:1,
    isLoading:true,
    modalComment: false,
    width:'100%',
    height:600,
    formCustom: {},
    widthForm:400,
    ids:[],
    //查看短视频详情：
    modalComment:false,
    isMusicPlayerShow:false,
    state:'',
    //查看封面：
    modalImg:false,
    imgsrc:'',
    //选中id存放：
    multipleSelectionId:[],
    multipleCommentStatus:'',
    loading:true,
    //显示举报评论：
    valueReportContent:'',
    visible: false,
    showShButton: true,
    }
  },
  methods: {
    searchKeychange(val) {
        console.log(val)
        this.queryList.reviewStatus = val
        if(val !== 0){
            this.showShButton = false
        }
    },
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
        // console.log(this.searchKey);
        this.queryList.reviewStatus=this.searchKey
        this.initData()
    },
    //审核：
    hasreviewed(val){
        // console.log(val);
        this.myRemark=''
        if(val==="已审核"){
            this.unPass=false
            this.isActiveAll=true
            this.isReviewed=true
            this.memoList=[
                {value:'审核通过',label:'审核通过'},
            ]
            this.myRemark=this.memoList[0].value
        }else if(val==="未通过"){
            this.unPass=true
            this.isActiveAll=true
            this.isReviewed=false
            this.memoList=[
                {value:'涉黄',label:'涉黄'},
                {value:'涉黑',label:'涉黑'},
                {value:'其他',label:'其他'}
            ]
            // this.formCustom.memo=this.memoList[0].value
        }else{
            this.unPass=false
            this.isActiveAll=false
            this.isReviewed=false
        }
    },
    //处理审核：
    handleReview(name){
        // console.log(this.formCustom)
        if(this.isIptShow){
            this.formCustom.memo = this.formCustom.remarkMore
            if(!this.myRemarkModel||!this.formCustom.remarkMore){
                return this.$Message.error('请输入未通过类型')
            }
        }else{
            this.formCustom.memo = this.myRemarkModel
            if(!this.myRemarkModel){
                return this.$Message.error('请输入未通过类型')
            }
        }
        this.$refs[name].validate((valid) => {
            if(valid){
                this.$Modal.confirm({
                    "title":"是否确认处理审核？",
                    onOk: () => { 
                        if(this.formCustom.reviewStatus==="未审核"){
                            this.formCustom.reviewStatus=0
                        }else if(this.formCustom.reviewStatus==="已审核"){
                            this.formCustom.reviewStatus=1
                        }else if(this.formCustom.reviewStatus==="未通过"){
                            this.formCustom.reviewStatus=2
                        }
                         console.log(this.formCustom.id,this.formCustom.reviewStatus,this.formCustom.memo);
                        updateCommentReviewById({commentid:this.formCustom.id,reviewstatus:this.formCustom.reviewStatus,memo:this.formCustom.memo}).then(res=>{
                            console.log(res);
                            if(res.data.code===0){
                                this.$Message.info(res.data.data)
                                this.isLoading=true
                                this.initData()
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
        this.modalComment=false
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
    //批量处理审核：
    modifyHandleCommentStatus(){
        if(this.multipleSelectionId.length!==0){
            this.modalModifyCommentReview=true
        }else{
            this.$Modal.warning({'title':'请选择需要审核的用户'})
        }
    },
    //触发多选框的选中状态：
    handleSelectionChange(selection){
        // console.log(selection);//[{…}, {…}, {…}]
        if(selection[0]){
            this.multipleCommentStatus=selection[0].reviewStatus.toString()||''
            this.formCustom.reviewStatus=this.multipleCommentStatus
            this.hasreviewed(this.formCustom.reviewStatus)
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
        this.isLoading=true
        console.log(this.formCustom.reviewStatus,2);
        updateCommentReviewsByIds({commentid:this.multipleSelectionId.toString(),reviewStatus:this.formCustom.reviewStatus==='已审核'?1:2}).then(res=>{
            console.log(res,111);
            if(res.data.code===0){
                this.initData()
                this.$Message.success('修改成功')
                this.multipleSelectionId.length=0
            }
        })
    },
    cancelComment(){},
    initData(){
        getCommentByReviewStatus(this.queryList).then(res=>{
            if(res.data.rows){
                this.tableData = res.data.rows
                this.dataCount = res.data.total
                this.isLoading=false
            }else{
                this.tableData = []
                // this.$Message.error('暂无数据');
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
            // return this.columns
        },
        newTableData(){
             if(this.tableData){
                this.tableData.forEach(item=>{
                    if(item.reviewStatus===0){
                        item.reviewStatus="未审核"
                    }else if(item.reviewStatus===1){
                        item.reviewStatus="已审核"
                    }else if(item.reviewStatus===2){
                        item.reviewStatus="未通过"
                    }
                    // 时间戳转换
                    item.createtime = getDate2(item.createtime)
                    item.modifiedtime = getDate2(item.modifiedtime)
                })
             }
            return this.tableData
        },
        newQueryReviewcords() {
            let temData = this.queryReviewcords
            temData.map(item=>{
                item.reviewtime = getDate2(item.reviewtime)
                item.createtime = getDate2(item.createtime)
            })
            return temData
        },
        myRemark:{
            get:function(){
                console.log('我被getter了');
                return this.myRemarkModel
            },
            set:function(myRemark){
                console.log(myRemark,'我被设置了');
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
            console.log(newValue,'我被监听了')
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
