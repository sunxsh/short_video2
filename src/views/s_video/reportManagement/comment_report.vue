<template>
    <div>
        <div id='isShow'>
            显示多选框：<i-switch v-model="showSelection" style="margin-right: 5px;margin-bottom:10px;"></i-switch>
            <!-- 显示举报凭证：<i-switch v-model="showId" style="margin-right: 5px;margin-bottom:10px;"></i-switch> -->
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
            v-model="modalReview"
            :mask-closable="false"
            :closable="false"          
            :width="widthForm"
            :scrollable='true'
            >
                <div>
                    <p style="marginTop:10px;marginBottom:10px;fontSize:18px;"><strong>举报内容：</strong></p>
                    <Input v-model="valueReportContent" type="text" :disabled="true" size="small" autosize/>
                </div>
          <div slot="footer">
                <Button style="margin-left: 8px" @click="cancelCommentDispose">取消</Button>
                <Button type="primary" @click="handleCommentDispose">处理</Button>
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
import {getCommentReports, updateCommentReport} from '@/api/report'
export default {
  name: 'comment_report',
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
    ],
    //是否显示页面内容：
    showSelection:false,
    keepDispose:'',
    commentid:'',
    columns: [
        // {title: 'Selection', key: 'selection', type: 'selection',width: 30, align: 'center',fixed: 'left'},
        {title: '编号', key: 'id',width: 80, align: 'center'},
        {title: '评论编号', key: 'commentid', align: 'center'},
        {title: '举报人编号', key: 'userid', align: 'center'},
        {title: '举报类型', key: 'type', align: 'center'},
        {title: '举报内容', key: 'content', align: 'center'},
        {title: '举报时间', key: 'createtime', align: 'center'},
        {
            title: '举报图片', key: 'picture', align: 'center',
            render: (h,params) => {
                return h('img',{
                    style:{
                        width:'100%',
                        height:'100%',
                        marginTop:'5px',
                        cursor:'pointer'
                    },
                    attrs:{
                        src:params.row.picture
                    },
                    on: {
                        click: ()=>{
                            this.isShowBigPic = true
                            this.BigPic = params.row.iconurl
                        }
                    }
                })
            }
        },
        {title: '处理时间', key: 'reviewtime', align: 'center'},
        {title: '处理状态', key: 'isdispose', align: 'center'},//'0未处理1处理',
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
                        },
                        //on就是用来绑定事件的
                        on: {
                            //获取当前行信息，并更新赋值
                            click:() => {
                                this.keepDispose = params.row.isdispose
                                // console.log(this.keepDispose);
                                // console.log(params.row);
                                // this.getMusicUrlByClassId(params.row.musicId)
                                this.commentid = params.row.commentid
                                this.valueReportContent=params.row.content               
                                this.modalReview = true
                                // this.isMusicPlayerShow=true            
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
      modalReview:false,
      width:'100%',
      height:600,
    //   formCustom: {},
      widthForm:300,
      ids:[],
      state:'',
        //查看封面：
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
      //处理举报状态：
    handleCommentDispose(){
        // console.log(this.keepDispose);
        if(this.keepDispose==="已处理") return this.$Modal.error({"title":"该状态已处理！"})
        this.$Modal.confirm({
            "title":"是否确认处理举报？",
            onOk: () => {
                updateCommentReport({commentid:this.commentid,isDispose:1}).then(res=>{
                    // console.log(res);
                    if(res.data.code===0){
                        this.$Message.info(res.data.data)
                        this.isLoading=true
                        this.initData()
                       this.modalReview=false
                    }else{
                        this.$Message.info(res.data.data)
                    }
                })

            },
            onCancel: () => {}
        })                
    },
    cancelCommentDispose(){
        this.modalReview=false
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
                },
                onCancel: () => {
                    // this.$Message.info('Clicked cancel');
                }
            })
        }else{
            this.$Modal.error({"title":'请选择需要编辑的用户'})
        }
    },
    //查询：
    handleSearch(){
        this.queryList.isDispose=this.searchKey
        this.initData()
    },
    initData(){
        getCommentReports(this.queryList).then(res => {
            if(res.data.code===0){
                this.tableData = res.data.rows
                this.dataCount = res.data.total
                this.isLoading=false
            } else {
                this.$Message.error(res.data.data);
                this.isLoading=false
            }   
        })
    },  
    cancelCommentDispose(){
        this.modalReview=false
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
                    if(item.isdispose===0){
                        item.isdispose="未处理"
                    }else if(item.isdispose===1){
                        item.isdispose="已处理"
                    }    
                })
            }else{
                return
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