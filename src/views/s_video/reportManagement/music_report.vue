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
            v-model="modalMusic"
            :mask-closable="false"
            :closable="false"          
            :width="widthForm"
            :styles="{top: '20px'}"
            :scrollable='true'
            >
                <aplayer 
                ref='aplayers'
                autoplay
                v-if='isMusicPlayerShow'
                :music="musicPlayer"
                />
                <div>
                    <p style="marginTop:10px;marginBottom:10px;fontSize:18px;"><strong>举报内容：</strong></p>
                    <Input v-model="valueReportContent" type="textarea" :disabled="true" size="small" autosize/>
                </div>
          <div slot="footer">
                <Button style="margin-left: 8px" @click="cancelMusicDispose">取消</Button>
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
import Aplayer from 'vue-aplayer'
import {getBgMusicReports, updateBgMusicReport} from '@/api/report' 
import {getMusicById} from '@/api/music'  

export default {
  name: 'music_report',
  components: {
    Aplayer
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
        {value:'1',label:'已处理'}
    ],
    //是否显示页面内容：
    showSelection:false,
    keepDispose:'',
    columns: [
        {title: '编号', key: 'id', width:80,align: 'center',fixed:'left'},
        {title: '音乐编号', key: 'musicId', align: 'center'},
        {title: '举报人编号', key: 'userid', align: 'center'},
        {title: '举报类型', key: 'type', align: 'center'},
        {title: '举报内容', key: 'content', align: 'center'},
        {title: '举报时间', key: 'createtime', align: 'center'},
        {
            title: '举报凭证', key: 'picture', align: 'center',
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
                            this.BigPic = params.row.picture
                        }
                    }
                })
            }
        },
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
                        on: {
                            click:() => {
                                this.keepDispose = params.row.isdispose
                                this.musicid = params.row.musicId
                                this.getMusicUrlByClassId(params.row.musicId)
                                this.valueReportContent=params.row.content               
                                this.modalMusic = true
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
      formCustom: {},
      widthForm:440,
      ids:[],
      //查看音乐详情：
      modalMusic:false,
      isMusicPlayerShow:false,
      musicFileurl:'',
      musicPlayer:{
        title: 'secret base~君がくれたもの~',
        artist: 'Silent Siren',
        src: '',
        pic: ''
      },
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
        //查询：
        handleSearch(){
            console.log(this.searchKey);
            this.queryList.isDispose=parseInt(this.searchKey)
            this.initData()
        },
        handleDispose(){
            //    console.log(this.formCustom.isDispose);
            if(this.keepDispose==="已处理") return this.$Modal.error({"title":"该状态已处理！"})
            this.$Modal.confirm({
                "title":"是否确认处理举报？",
                onOk: () => {
                    updateBgMusicReport({musicid:this.musicid,isDispose:1}).then(res=>{
                        // console.log(res);
                        if(res.data.code===0){
                            this.$Message.info(res.data.data)
                            this.isLoading=true
                            this.initData()
                            this.cancelMusicDispose()
                        }else{
                            this.$Message.info(res.data.data)
                        }
                    })

                },
                onCancel: () => {}
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
        //分页：
        changePage (index) {
            // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
            this.isLoading=true
            this.queryList.offset=(index-1)*this.pageSize+1
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
            getBgMusicReports(this.queryList).then(res => {
                // console.log(res,'res');
                // if(res.data.code===1){
                    this.tableData = res.data.rows
                    this.dataCount = res.data.total
                    this.isLoading=false
                    // console.log(this.tableData,1)
                // }      
            })
        },  
        //获取音乐地址：
        getMusicUrlByClassId(id){
            getMusicById({musicid:id}).then(res=>{
                console.log(res);
                if(res.data.code===0){
                    this.musicPlayer.src = res.data.data.fileurl
                    // console.log(this.musicPlayer.src,'src');
                    this.musicPlayer.pic= res.data.data.picture
                    this.musicPlayer.title=res.data.data.name
                    this.musicPlayer.artist=res.data.data.author
                    this.isMusicPlayerShow=true
                    console.log(this.musicPlayer);
                }else{
                    this.$Message.error(res.data.data)
                }
            })
        },
        cancelMusicDispose(){
            setTimeout(()=>{
                this.isMusicPlayerShow=false
                this.musicPlayer.src=''
            },500)
            this.modalMusic=false
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
                if(!this.tableData){
                    return
                }
                this.tableData.forEach(item=>{
                if(item.isdispose===0){
                    item.isdispose="未处理"
                }else if(item.isdispose===1){
                    item.isdispose="已处理"
                }    
                switch(item.type){
                    case 0:
                    item.type='盗版侵权';
                    break;
                    case 1:
                    item.type='色情低俗';
                    break;
                    case 2:
                    item.type='涉政';
                    break;
                    case 3:
                    item.type='广告';
                    break;
                    case 4:
                    item.type='其他';
                    break;
                }
            })
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