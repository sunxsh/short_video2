<template>
    <div>
        <div id="btn">
            <Button type="primary" @click="addStickersInfo">添加贴纸</Button>
            <Button type="primary" @click="modifyDelStickers">批量删除贴纸</Button>
            <Button type="primary" @click="modifyEditStickersStatus">修改贴纸显示状态</Button>
            <Button type="primary" @click="modifyEditStickersPriceStatus">修改贴纸收费状态</Button>
            <!-- <Button type="primary">启用贴纸</Button> -->
            <!-- <Button type="primary">禁用贴纸</Button> -->
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
                <FormItem label="贴纸编号" prop="id">
                    <Input v-model="formValidate.id" placeholder="Enter your id"></Input>
                </FormItem>
                <FormItem label="贴纸分类编号" prop="classid">
                    <Select v-model="formValidate.classid">
                        <Option :value="item" v-for="(item,i) in classIdList" :key='i'>{{item}}</Option>                       
                    </Select>
                </FormItem>
                <FormItem label="贴纸标题" prop="title">
                    <Input v-model="formValidate.title" placeholder="Enter your title"></Input>
                </FormItem>
                <FormItem label="贴纸提示" prop="tip">
                    <Input v-model="formValidate.tip" placeholder="Enter your tip"></Input>
                </FormItem>               
                <FormItem label="贴纸文件地址" prop="itemurl">
                    <Input v-model="formValidate.itemurl" placeholder="Enter your itemurl"></Input>
                </FormItem>
                <FormItem label="显示排序" prop="orderindex">
                    <Input v-model="formValidate.orderindex" placeholder="Enter your orderindex"></Input>
                </FormItem>
                <!-- <FormItem label="创建时间" prop="createtime">
                    <Input v-model="formValidate.createtime" placeholder="Enter your createtime"></Input>
                </FormItem> -->
                <FormItem label="贴纸价格" prop="filterprice">
                     <Input v-model="formValidate.filterprice" placeholder="Enter your filterprice"></Input>
                </FormItem>
                <FormItem label="使用时间" prop="usetime">
                    <Select v-model="formValidate.usetime">
                        <Option :value="item.value" v-for="item in usetimeOpt" :key='item.value'>{{item.label}}</Option>                       
                    </Select>
                </FormItem>
                <FormItem label="贴纸类型" prop="derviceType">
                    <RadioGroup v-model="formValidate.derviceType">
                        <Radio label="0">android</Radio>
                        <Radio label="1">ios</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="是否显示" prop="delflag">
                    <RadioGroup v-model="formValidate.delflag">
                        <Radio label="0">显示</Radio>
                        <Radio label="1">不显示</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="是否收费" prop="priceflag">
                     <RadioGroup v-model="formValidate.priceflag" @on-change="priceflagChange">
                        <Radio label="0">免费</Radio>
                        <Radio label="1">收费</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="是否可用" prop="useflag">
                    <!-- <RadioGroup v-model="formValidate.useflag">
                        <Radio label="0" disabled>不可用</Radio>
                        <Radio label="1" disabled>可用</Radio>
                    </RadioGroup> -->
                     <!-- <Input v-model="formValidate.useflag" placeholder="Enter your useflag"></Input> -->
                    <Select v-model="updateUseflag" disabled>
                        <Option :value="item.value" v-for="item in useflagOpt" :key='item.value'>{{item.label}}</Option>                       
                    </Select>
                </FormItem>
                
                <FormItem label="贴纸图片地址" prop="iconurl">
                    <Input v-model="formValidate.iconurl" placeholder="Enter your iconurl"></Input>
                    <!-- <Upload 
                    ref="upload"
                    action="111"
                    >
                        <Button icon="ios-cloud-upload-outline">贴纸图片地址</Button>
                    </Upload> -->
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
            <img :src="BigPic" class="userDefineImg">
        </viewer>
        <div slot="footer">
            <Button type="info" @click="isShowBigPic=false">确定</Button>
        </div>
        </Modal>
  </div>
</template>

<script>
import {queryItemDetail, updateAllItemPriceFlag, updateItemDetail, delAllItemDetail, updateAllItemDetailShowStatus,queryItemClass,addItemDetail} from '@/api/sticker'
import { getDate2 } from '@/libs/tools.js'
export default {
  name: 'tables_page',
  data () {
    return {
    //查看大图:
    isShowBigPic:false,
    BigPic:'',
    //区分编辑和添加：
    isflag:false,
    titleMd:'',
    //是否显示页面内容：
    showSelection:false,
    showId:false,
    showuserid:false,
    showMusicid:false,
    columns: [
        {title: '贴纸编号', key: 'id',width: 100, align: 'center',fixed:'left'},
        {title: '贴纸分类编号', key: 'classid',width: 150, align: 'center'},
        {title: '贴纸标题', key: 'title',width: 200, align: 'center'},
        {title: '贴纸提示', key: 'tip',width: 150, align: 'center'},
        {title: '贴纸文件地址', key: 'itemurl',width: 200, align: 'center'},
        {
            title: '贴纸图片地址', key: 'iconurl',width: 200, align: 'center',
            render: (h,params) => {
                return h('img',{
                    style:{
                        width:'100%',
                        height:'100%',
                        marginTop:'5px',
                        cursor:'pointer'
                    },
                    attrs:{
                        src:params.row.iconurl
                    },
                    on: {
                        click: ()=>{
                            this.isShowBigPic = true
                            this.BigPic = params.row.iconurl
                            console.log(this.BigPic);
                        }
                    }
                })
            }
        },
        {title: '显示排序', key: 'orderindex', width: 100,align: 'center'},
        {title: '创建时间', key: 'createtime',width: 200, align: 'center'},
        {title: '贴纸价格', key: 'filterprice', width: 100,align: 'center'},
        {title: '使用时间', key: 'usetime', width: 200,align: 'center'},
        {title: '贴纸类型', key: 'derviceType', width: 100,align: 'center'},
        {title: '是否可用', key: 'useflag', width: 100,align: 'center'},
        {
            title: '是否收费', key: 'priceflag', width: 100,align: 'center',
            render: (h, params) => {
                return h("i-Switch", {
                    props: {
                        value: params.row.priceflag.toString(),
                        'true-value':'0',//免费
                        'false-value':'1'//收费
                    },
                    attrs:{
                        size: 'large'
                    },
                    on: {
                        'on-change': (val) => {
                            console.log(val);                           
                            updateAllItemPriceFlag({ids:params.row.id.toString()}).then(res=>{
                                if(res.data.code===0){
                                    val==1? params.row.useflag='不可用' : params.row.useflag='可用'                                
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
                        domProps:{innerHTML:'免费'}                         
                    }),
                    h('span', {
                        slot:'close',
                        domProps:{innerHTML:'收费'}                          
                    })
                ])
            }
        },
        {
            title: '是否显示', key: 'delflag',width: 100, align: 'center',
               render: (h, params) => {
                return h("i-Switch", { 
                    props: {
                        value: params.row.delflag.toString(),
                        'true-value':'0',//显示
                        'false-value':'1'//禁用
                    },
                    on: {
                        'on-change': (val) => {
                            console.log(val);
                            updateAllItemDetailShowStatus({ids:params.row.id.toString()}).then(res=>{
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
            fixed: 'right',
            width: 100,
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
                this.titleMd = '编辑贴纸管理信息'
                this.modalAddStickersInfo  = true
                //点击编辑，flag为true
                this.isflag = true
                this.getClassIdList()
                this.formValidate.id=params.row.id.toString()
                this.formValidate.classid=params.row.classid.toString()
                this.formValidate.delflag=params.row.delflag.toString()
                this.formValidate.title=params.row.title
                this.formValidate.tip=params.row.tip
                this.formValidate.itemurl=params.row.itemurl
                this.paramsuseflag=params.row.useflag=="不可用"?'0':'1'
                this.formValidate.iconurl=params.row.iconurl
                this.formValidate.filterprice=params.row.filterprice.toString()
                this.formValidate.priceflag=params.row.priceflag.toString()
                this.formValidate.usetime=params.row.usetime
                this.formValidate.orderindex=params.row.orderindex.toString()
                this.formValidate.createtime=params.row.createtime
                this.formValidate.derviceType=params.row.derviceType=="ios"?'1':'0'
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
                        delAllItemDetail({ids:params.row.id}).then(res=>{
                            console.log(res);
                            if(res.data.code===0){
                                this.$Message.info("删除成功")
                                this.isLoading=true
                                this.initData()
                            }
                        })
     
                    },
                    onCancel: () => {
                        this.$Message.info('Clicked cancel');
                    }
                })               
            }
            }
            }, '删除')
            ]);
            }
            }
      ],
      useflagOpt:[
        {
            value:'0',
            label:'不可用'
        },
        {
            value:'1',
            label:'可用'
        }
      ],
      priceflagOpt:[
        {
            value:0,
            content:'免费'
        },
        {
            value:1,
            content:'收费'
        }
      ],
      derviceTypeOpt:[
        {
            value:'android',
            content:'android'
        },
        {
            value:'ios',
            content:'ios'
        }
      ],
      usetimeOpt:[
        {
            value:'一个月',
            label:'一个月'
        },
        {
            value:'半年',
            label:'半年'
        },
        {
            value:'一年',
            label:'一年'
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
        formValidate: {},
        ruleValidate: {
            title: [
                { required: true, message: '贴纸标题不能为空', trigger: 'blur' }
            ],
            id: [
                { required: true, message: '贴纸编号不能为空', trigger: 'blur' },
            ],
            classid: [
                { required: true, message: '贴纸分类编号不能为空', trigger: 'blur' },
            ],
            itemurl: [
                { required: true, message: '贴纸文件地址不能为空', trigger: 'blur' },
            ],
            iconurl: [
                { required: true, message: '分类排序贴纸图片地址不能为空', trigger: 'blur' },
            ],
            orderindex: [
                { required: true, message: '显示排序不能为空', trigger: 'blur' },
            ],
            filterprice: [
                { required: true, message: '请选择贴纸价格', trigger: 'change' }
            ],
            delflag: [
                { required: true, message: '请选择是否显示', trigger: 'change' }
            ],
            useflag: [
                { required: false, message: '请选择是否可用', trigger: 'change' }
            ],
            priceflag: [
                { required: true, message: '请选择是否收费', trigger: 'change' }
            ],
            derviceType: [
                { required: true, message: '请选择贴纸类型', trigger: 'change' }
            ],
            usetime:[
                { required: true, message: '请选择使用时间', trigger: 'change' }
            ],
            tip:[
                { required: true, message: '请选择贴纸提示', trigger: 'change' }
            ]
        },
        loading:true,
        priceflagChangeValue:'',
        paramsuseflag:'',
        classIdList:[],
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
   //添加短视频分类：
    addStickersInfo(){
        //点击添加，flag为 false
        this.titleMd = '添加贴纸管理信息'
        this.modalAddStickersInfo  = true
        this.isflag=false
        this.getClassIdList()
        this.paramsuseflag=''
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
                "title":"是否删除？",
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
        if(val==1){
            // this.updateUseflag='0'
            this.paramsuseflag='0'
        }else{
            // this.updateUseflag='1'
            this.paramsuseflag='1'
        }
    },
    //确认提交：
    handleSubmit (name) {
        if(this.isflag){//flag为true为编辑：
        console.log(this.formValidate);
            this.$refs[name].validate((valid) => {
                if (valid) {
                    // this.formValidate.createtime = "2018-12-18T02:07:50.959Z"
                    updateItemDetail({id:this.formValidate.id},this.formValidate).then(res=>{
                        console.log(res)
                        if(res.data.code===0){
                            this.$Message.success(res.data.data)
                            this.isLoading=true
                            this.initData()
                            this.modalAddStickersInfo  = false
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
                    this.formValidate.classid = parseInt(this.formValidate.classid)
                    console.log(this.formValidate.classid);
                    this.formValidate.delflag = parseInt(this.formValidate.delflag)
                    this.formValidate.derviceType = parseInt(this.formValidate.derviceType)
                    this.formValidate.filterprice = parseInt(this.formValidate.filterprice)
                    this.formValidate.id = parseInt(this.formValidate.id)
                    this.formValidate.orderindex = parseInt(this.formValidate.orderindex)
                    this.formValidate.priceflag = parseInt(this.formValidate.priceflag)
                    this.formValidate.useflag = parseInt(this.formValidate.useflag)
                    console.log(this.formValidate);   
                    addItemDetail(this.formValidate).then(res=>{
                        if(res.data.code===0){
                            this.$Message.success(res.data.data)
                            this.isLoading=true
                            this.initData()
                            this.modalAddStickersInfo  = false
                            this.handleReset(name)
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
        // this.handleClearFiles()
    },
    //清除图片：
    handleClearFiles(){
        this.$refs.upload.clearFiles()
    },
    //查询贴纸分类：
    getClassIdList(){
        let temp = []
        queryItemClass().then(res=>{
            res.data.forEach(item=>{
                if(item.delflag=='1'){
                    temp.push(item.id.toString())
                }
            })
            this.classIdList = temp
        })
    },
    // uploadUrl(){
    //     return '111'
    // },
    initData(){
        queryItemDetail(this.queryList).then(res => {
            // console.log(res,'res');
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
                if(item.useflag===0){
                    item.useflag="不可用"
                }else if(item.useflag===1){
                    item.useflag="可用"
                }
                if(item.derviceType===0){
                    item.derviceType="android"
                }else if(item.derviceType===1){
                    item.derviceType="ios"
                }
                if(item.usetime==='0'){
                    item.usetime="一个月"
                }else if(item.usetime==='1'){
                    item.usetime="半年"
                }else if(item.usetime==='2'){
                    item.usetime="一年"
                }
                // 时间戳转换
                item.createtime = getDate2(item.createtime)
            })
             }
            return this.tableData
        },
        updateUseflag:{           
            get:function(){  
                console.log('getter');
                this.formValidate.useflag=this.paramsuseflag
                // console.log(this.formValidate.useflag,'this.formValidate.useflag');
                return this.formValidate.useflag
            },      
            set:function(newval){   
                console.log('我被设置了',newval); 
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