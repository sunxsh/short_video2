<template>
    <div>
        <div id="btn">
            <Button type="primary" @click="addStickersInfo">添加滤镜分类</Button>
        </div>
        <div id='isShow'>
            显示多选框：<i-switch v-model="showSelection" style="margin-right: 5px;margin-bottom:10px;"></i-switch>
            <!-- 显示编号：<i-switch v-model="showId" style="margin-right: 5px;margin-bottom:10px;"></i-switch> -->
            <!-- 显示相关用户编号：<i-switch v-model="showuserid" style="margin-right: 5px;margin-bottom:10px;"></i-switch> -->
        </div>
        <!-- Table -->
         <div>
           <!-- style="table-layout: auto;word-break: keep-all;" -->
            <Card style="width:100%">
              <Table 
              stripe
              highlight-row
              ref="tables" 
              :data="newTableData" 
              :columns="newcolumns"
              :loading='isLoading'
              @on-selection-change="handleSelectionChange"             
              ></Table>
             <change-page :totalPage="dataCount" @getPages="handlePage" @changes="handleChange"></change-page>
            </Card>
         </div>
<!-- 添加短视频分类弹出框 -->
        <Modal
            :title="titleMd"
            v-model="modalAddStickersInfo"
            :styles="{top: '20px',width:'620px'}"
            :mask-closable="false"
            >
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" inline>
                <FormItem label="编号" prop="id">
                    <Input v-model="formValidate.id" placeholder="Enter your id"></Input>
                </FormItem>
                <FormItem label="滤镜分类名称" prop="filterName">
                    <!-- isflag:true 编辑 -->
                    <Input v-model="formValidate.filterName" placeholder="Enter your filterName"></Input>
                </FormItem>
                <FormItem label="滤镜图片" prop="filterImg">
                    <Input v-model="formValidate.filterImg" placeholder="Enter your filterImg"></Input>
                </FormItem>
                <FormItem label="滤镜排序" prop="filterOrder">
                    <Input v-model="formValidate.filterOrder" placeholder="Enter your filterOrder"></Input>
                </FormItem>
                <FormItem label="是否显示" prop="showflag">
                    <RadioGroup v-model="formValidate.showflag">
                        <Radio label="0">显示</Radio>
                        <Radio label="1">不显示</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="是否删除" prop="delflag">
                    <RadioGroup v-model="formValidate.delflag">
                        <Radio label="0">删除</Radio>
                        <Radio label="1">不删除</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
                <div slot="footer">
                    <Button @click="cancelShortVideoClass('formValidate')" style="margin-left: 8px">取消</Button>
                    <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
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
            <img :src="BigPic" class="userDefineImg" :onerror="onerror">
        </viewer>
        <div slot="footer">
            <Button type="info" @click="isShowBigPic=false">确定</Button>
        </div>
        </Modal>
  </div>
</template>

<script>
import {findFilterclass,updateFilterClass,updateShowFilterClass,delFilterclass,addFilterClass} from '@/api/filter'
import { getDate2 } from '@/libs/tools.js'
export default {
  name: 'tables_page',
  data () {
    return {
    //查看大图：
    isShowBigPic:false,
    BigPic:'',
    onerror: "javascript:this.src='https://img.lgh81.com/timg20190605144929.jpg'",
    //区分编辑和添加：
    isflag:false,
    titleMd:'',
    //是否显示页面内容：
    showSelection:false,
    showId:false,
    showuserid:false,
    showMusicid:false,
    columns: [
        {title: '编号', key: 'id', align: 'center',fixed:'left'},
        {title: '滤镜分类名称', key: 'filterName', align: 'center'},
        {
            title: '滤镜图片', key: 'filterImg', align: 'center',
            render: (h,params) => {
                return h('img',{
                    style:{
                        width:'50px',
                        height:'50px',
                        marginTop:'5px',
                        cursor:'pointer',
                        objectFit: 'contain',
                    },
                    attrs:{
                        src:params.row.filterImg,
                        onerror: this.onerror
                    },
                    on: {
                        click: ()=>{
                            this.isShowBigPic = true
                            this.BigPic = params.row.filterImg
                        }
                    }
                })
            }
        },
        {title: '滤镜排序', key: 'filterOrder', align: 'center'},
        {title: '创建时间', key: 'createtime', align: 'center'},
        {title: '是否删除', key: 'delflag', align: 'center'},
        {
            title: '是否显示', key: 'showflag', align: 'center',
               render: (h, params) => {
                return h("i-Switch", { 
                    props: {
                        value: params.row.showflag.toString(),
                        'true-value':'0',//显示
                        'false-value':'1'//禁用
                    },
                    on: {
                        'on-change': (val) => {
                            console.log(val);
                            updateShowFilterClass({id:params.row.id.toString()}).then(res=>{
                              console.log(res);
                                if(res.data.code===0){
                                    this.isLoading=true
                                    this.initData()
                                    this.$Message.success("修改成功！")
                                }
                            })                          
                        }
                    }, 
                },[
                    h('span', {
                        slot:'open',
                        domProps:{innerHTML:'开'}                         
                    }),
                    h('span', {
                        slot:'close',
                        domProps:{innerHTML:'禁'}                          
                    })
                ])
            }
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
            marginBottom: '5px',
            marginRight: '5px',
            },
            on: {
            click: () => {
                // console.log(params.row);
                this.titleMd='编辑滤镜分类信息'
                this.modalAddStickersInfo  = true
                //点击编辑，flag为true
                this.isflag = true
                if(this.isflag){
                    this.formValidate.id=params.row.id.toString()
                    this.formValidate.filterName=params.row.filterName
                    this.formValidate.delflag=params.row.delflag=="删除"?'0':'1'
                    this.formValidate.filterImg=params.row.filterImg
                    this.formValidate.filterOrder=params.row.filterOrder.toString()
                    this.formValidate.showflag=params.row.showflag.toString()
                }                
            },
            }
            }, '编辑'),
            h('Button', {
            props: {
            type: 'error',
            size: 'small'
            }, 
            style: {
            marginRight: '5px',
            marginBottom: '10px',
            marginTop:'10px'
            },
            on: {
            click: () => {
                this.$Modal.confirm({"title":"是否确认删除？",
                    onOk: () => {
                        delFilterclass({id:params.row.id}).then(res=>{
                            if(res.data.code===0){
                                this.$Message.info("删除成功")
                                this.isLoading=true
                                this.initData()
                            }
                        })    
                    },
                    onCancel: () => {}
                })               
            }
            }
            }, '删除')
            ]);
            }
            }
      ],
      tableData: [],
      queryList:{
          offset:0,//0,11,21
          limit:10,
          sort:'id',
          order:'asc'
      },
      dataCount:0,
      pageSize:10,
      now:1,
      isLoading:true,
      modalDetil: false,
      width:'100%',
      height:600,
      formCustom: {},
      widthForm:600,
      ids:[],
      //查看短视频详情：
      modalShortVideo:false,
      state:'',
        //查看封面：
        modalImg:false,
        imgsrc:'',
        //选中id存放：
        multipleSelectionId:[],
        //添加短视频分类弹出框：
        modalAddStickersInfo:false,
        formValidate: {
        },
        ruleValidate: {
            filterName: [
                { required: true, message: '滤镜分类名称不能为空', trigger: 'blur' }
            ],
            id: [
                { required: true, message: '滤镜编号不能为空', trigger: 'blur' },
            ],
            filterImg: [
                { required: true, message: '滤镜图片不能为空', trigger: 'blur' },
            ],
            filterOrder: [
                { required: true, message: '滤镜排序不能为空', trigger: 'blur' },
            ],
            delflag: [
                { required: true, message: '请选择是否删除', trigger: 'change' }
            ],
            showflag: [
                { required: true, message: '请选择是否显示', trigger: 'change' }
            ]
        },
        loading:true,
        list:[]
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
   //  添加短视频分类：
    addStickersInfo(){
        //点击添加，flag为 false
        this.titleMd = '添加滤镜分类信息'
        this.modalAddStickersInfo  = true
        this.flag=false
    },
    //清空表格：
    handleReset (name) {
        this.$refs[name].resetFields();
    },   
    //触发多选框的选中状态：
    handleSelectionChange(selection){
        // console.log(selection);//[{…}, {…}, {…}]
        if(selection){
            this.multipleSelectionId = []
            selection.forEach(item => {
                this.multipleSelectionId.push(item.id)
            })
        }
    },
    //确认提交：
    handleSubmit (name) {
        if(this.isflag){//flag为true为编辑：
            this.$refs[name].validate((valid) => {
                if (valid) {
                    // this.formValidate.createtime = "2018-12-18T02:07:50.959Z"
                    updateFilterClass({id:this.formValidate.id},this.formValidate).then(res=>{
                        if(res.data.code===0){
                            this.$Message.success(res.data.data)
                            this.isLoading=true
                            this.initData()
                            this.modalAddStickersInfo = false
                            this.isflag = false
                        }else{
                            this.$Message.error(res.data.data)
                        }
                    })
                } else {
                    this.$Message.error('请正确填写信息')
                }
            })
        }else{//添加：
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let d = new Date().getTime()
                    this.formValidate.createtime = d
                    this.formValidate.delflag = parseInt(this.formValidate.delflag)
                    this.formValidate.filterOrder = parseInt(this.formValidate.filterOrder)
                    this.formValidate.id = parseInt(this.formValidate.id)
                    this.formValidate.showflag = parseInt(this.formValidate.showflag)
                    // console.log(this.formValidate);
                    addFilterClass(this.formValidate).then(res=>{
                     if(res.data.code===0){
                            this.$Message.success(res.data.data)
                            this.isLoading=true
                            this.initData()
                            this.modalAddStickersInfo = false
                        }else{
                            this.$Message.error(res.data.data)
                        }
                    })
                } else {
                    this.$Message.error('请正确填写信息')
                }
            })
            }
    },
    cancelShortVideoClass(name){
        this.handleReset(name)
        this.modalAddStickersInfo  = false
        this.isflag = false
    },
    initData(){
        findFilterclass(this.queryList).then(res => {
            // console.log(res);
                this.tableData = res.data.rows
                this.dataCount = res.data.total
                this.isLoading=false
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
                    if(item.delflag===0){
                        item.delflag="删除"
                    }else if(item.delflag===1){
                        item.delflag="不删除"
                    }
                    // 时间戳转换
                    item.createtime = getDate2(item.createtime)
                })
             }
            return this.tableData
        },
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