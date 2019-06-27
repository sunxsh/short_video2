<template>
    <div>
        <div id="btn">
            <Button type="primary" @click="addStickersClass">添加贴纸分类</Button>
        </div>
        <div id='isShow'>
            显示多选框：<i-switch v-model="showSelection" style="margin-right: 5px;margin-bottom:10px;"></i-switch>
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
            v-model="modalAddStickersClass"
            :styles="{top: '20px',width:'620px'}"
            :mask-closable="false"
            >
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" inline>
                <FormItem label="贴纸编号" prop="id">
                    <Input v-model="formValidate.id" placeholder="Enter your id"></Input>
                </FormItem>
                <FormItem label="分类名称" prop="name">
                    <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
                </FormItem>
                <FormItem label="分类图片" prop="iconurl">
                    <Input v-model="formValidate.iconurl" placeholder="Enter your iconurl"></Input>
                </FormItem>
                <FormItem label="显示排序" prop="orderindex">
                    <Input v-model="formValidate.orderindex" placeholder="Enter your orderindex"></Input>
                </FormItem>
                <FormItem label="是否显示" prop="isShow">
                    <RadioGroup v-model="formValidate.isShow">
                        <Radio label="0">显示</Radio>
                        <Radio label="1">不显示</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="是否删除" prop="delflag">
                    <RadioGroup v-model="formValidate.delflag">
                        <Radio label="0">删除</Radio>
                        <Radio label="1">未删除</Radio>
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
import {queryItemClass,updateItemClass,updateShowItemClassShowStatus,delItemClass,findItemClass,addItemClass } from '@/api/sticker'
import { getDate2 } from '@/libs/tools.js'
export default {
  name: 'tables_page',
  data () {
    return {
    //查看大图:
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
        {title: '贴纸编号', key: 'id', width:100,align: 'center',fixed:'left'},
        {title: '贴纸分类名称', key: 'name', align: 'center'},
        {
            title: '贴纸图片', key: 'iconurl', align: 'center',
            render: (h,params) => {
                return h('img',{
                    style:{
                        width:'50px',
                        height:'50px',
                        marginTop:'5px',
                        cursor:'pointer'
                    },
                    attrs:{
                        src:params.row.iconurl,
                        onerror: this.onerror,
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
        {title: '显示排序', key: 'orderindex', align: 'center'},
        {title: '创建时间', key: 'createtime', align: 'center'},
        {
            title: '是否显示', key: 'isShow', align: 'center',
               render: (h, params) => {
                return h("i-Switch", { 
                    props: {
                        value: params.row.isShow.toString(),
                        'true-value':'0',//显示
                        'false-value':'1'//禁用
                    },
                    on: {
                        'on-change': (val) => {
                            console.log(val);
                            updateShowItemClassShowStatus({id:params.row.id.toString()}).then(res=>{
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
        {title: '是否删除', key: 'delflag', align: 'center'},
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
            marginBottom: '10px',
            marginRight: '5px',
            },
            on: {
            click: () => {
                this.titleMd = '编辑贴纸分类信息'
                this.modalAddStickersClass  = true
                //点击编辑，flag为true
                this.isflag = true
                if(this.isflag){
                    this.formValidate.id=params.row.id.toString()
                    this.formValidate.name=params.row.name
                    this.formValidate.delflag=params.row.delflag=="未删除"?'1':'0'
                    this.formValidate.isShow=params.row.isShow.toString()
                    this.formValidate.iconurl=params.row.iconurl
                    this.formValidate.orderindex=params.row.orderindex.toString()
                    this.formValidate.createtime=params.row.createtime
                }                
            }
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
            marginTop:'5px'
            },
            on: {
            click: () => {
                this.$Modal.confirm({"title":"是否确认删除？",
                    onOk: () => {
                        delItemClass({id:params.row.id}).then(res=>{
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
     //选中id存放：
     multipleSelectionId:[],
     //添加短视频分类弹出框：
     modalAddStickersClass:false,
     formValidate: {
     },
     ruleValidate: {
        name: [
            { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ],
        id: [
            { required: true, message: '贴纸编号不能为空', trigger: 'blur' },
        ],
        iconurl: [
            { required: true, message: '分类图片不能为空', trigger: 'blur' },
        ],
        orderindex: [
            { required: true, message: '显示排序不能为空', trigger: 'blur' },
        ],
        isShow: [
            { required: true, message: '请选择显示类型', trigger: 'change' }
        ],
        delflag: [
            { required: true, message: '请选择是否删除', trigger: 'change' }
        ],
     },
     loading:true,
     nameList:[]
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
    addStickersClass(){
        //点击添加，flag为 false
        this.titleMd = '添加贴纸分类信息'
        this.modalAddStickersClass  = true
        this.flag=false
    },
    //清空表格：
    handleReset (name) {
        this.$refs[name].resetFields();
    },   
    //触发多选框的选中状态：
    handleSelectionChange(selection){
        console.log(selection);//[{…}, {…}, {…}]
        if(selection){
            this.multipleSelectionId = []
            selection.forEach(item => {
                this.multipleSelectionId.push(item.id)
            })
        }
    },
    //批量修改贴纸是否显示：
    modifyEditStickersStatus(){
        if(this.multipleSelectionId.length!==0){
            this.$Modal.confirm({
                "title":"是否批量修改贴纸显示状态？",
                onOk: () => {
                    updateAllItemDetailShowStatus({ids:this.multipleSelectionId.toString()}).then(res=>{
                        if(res.data.code===0){
                            this.$Message.info("修改成功")
                            this.isLoading=true
                            this.initData()
                            this.multipleSelectionId.length=0
                        }
                    })   
                },
                onCancel: () => {}
            })
        }else{
            this.$Modal.error({"title":'请选择需要编辑的用户'})
        }
    },
    //批量修改贴纸收费状态：
    modifyEditStickersPriceStatus(){
        if(this.multipleSelectionId.length!==0){
            this.$Modal.confirm({
                "title":"是否批量修改贴纸收费状态？",
                onOk: () => {
                    updateAllItemPriceFlag({ids:this.multipleSelectionId.toString()}).then(res=>{
                        if(res.data.code===0){
                            this.$Message.info("修改成功")
                            this.isLoading=true
                            this.initData()
                            this.multipleSelectionId.length=0
                        }
                    })   
                },
                onCancel: () => {}
            })
        }else{
            this.$Modal.error({"title":'请选择需要编辑的用户'})
        }
    },
    //批量删除贴纸：
    modifyDelStickers(){
         if(this.multipleSelectionId.length!==0){
            this.$Modal.confirm({
                "title":"是否批量修改贴纸收费状态？",
                onOk: () => {
                    delAllItemDetail({ids:this.multipleSelectionId.toString()}).then(res=>{
                        if(res.data.code===0){
                            this.$Message.info("删除成功")
                            this.isLoading=true
                            this.initData()
                            this.multipleSelectionId.length=0
                        }
                    })   
                },
                onCancel: () => {}
            })
        }else{
            this.$Modal.error({"title":'请选择需要编辑的用户'})
        }
    },
    //编辑时监听是否收费状态：0免费;1收费 0不可用，1可用
    priceflagChange(val){
        // console.log(val,'val');
        val==1?this.updateUseflag='0':'1'
    },
    //确认提交：
    handleSubmit (name) {
        if(this.isflag){//flag为true为编辑：
        // console.log(this.formValidate);
            this.$refs[name].validate((valid) => {
                if (valid) {
                    // this.formValidate.createtime = "2018-12-18T02:07:50.959Z"
                    // console.log(this.formValidate,'编辑');
                    updateItemClass({id:this.formValidate.id},this.formValidate).then(res=>{
                        if(res.data.code===0){
                            this.$Message.success(res.data.data)
                            this.isLoading=true
                            this.initData()
                            this.modalAddStickersClass  = false
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
                    addItemClass(this.formValidate).then(res=>{
                        console.log(res);
                        if(res.data.code===0){
                            this.$Message.success(res.data.data)
                            this.isLoading=true
                            this.initData()
                            this.modalAddStickersClass  = false
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
        this.modalAddStickersClass  = false
    },
    initData(){
        findItemClass(this.queryList).then(res => {
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
                        item.delflag="未删除"
                    }
                    // 时间戳转换
                    item.createtime = getDate2(item.createtime)     
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
      queryItemClass().then(res=>{
            let list = []
            if(res.data.code===0){
                res.data.forEach(item=>{
                    if(item.delflag){
                        list.push(item.name)
                    }
                })
            }else{
                return this.$Message.error(res.data.data)
            }
            
            this.nameList = list.filter((ele,i,self)=>{
                return self.indexOf(ele)===i
            })
        })
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