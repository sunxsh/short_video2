<template>
    <div>
        <div id="btn">
            <Button type="primary" @click="addStickersInfo">添加滤镜</Button>
            <Button type="primary" @click="modifyDelStickers">批量删除滤镜</Button>
            <Button type="primary" @click="modifyEditStickersStatus">修改滤镜显示状态</Button>
            <Button type="primary" @click="modifyEditStickersPriceStatus">批量修改滤镜收费状态</Button>
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
                <FormItem label="编号" prop="id">
                    <Input v-model="formValidate.id" placeholder="Enter your id"></Input>
                </FormItem>
                <FormItem label="分类编号" prop="classId">
                    <!-- <Input v-model="formValidate.classId" placeholder="Enter your classid" v-if="isflag"></Input> -->
                    <Select v-model="formValidate.classId">
                        <Option :value="item" v-for="(item,i) in classIdList" :key='i'>{{item}}</Option>                       
                    </Select>
                </FormItem>
                <FormItem label="滤镜标题" prop="title">
                    <Input v-model="formValidate.title" placeholder="Enter your title"></Input>
                </FormItem>
                <FormItem label="滤镜提示" prop="tip">
                    <Input v-model="formValidate.tip" placeholder="Enter your tip"></Input>
                </FormItem>
                <FormItem label="滤镜颜色" prop="color">
                     <Input v-model="formValidate.color" placeholder="Enter your filterprice"></Input>
                </FormItem>
                <FormItem label="滤镜图片地址" prop="iconurl">
                    <Input v-model="formValidate.iconurl" placeholder="Enter your iconurl"></Input>
                </FormItem>
                <FormItem label="滤镜文件地址" prop="itemurl">
                    <Input v-model="formValidate.itemurl" placeholder="Enter your itemurl"></Input>
                </FormItem>
                <FormItem label="显示排序" prop="orderindex">
                    <Input v-model="formValidate.orderindex" placeholder="Enter your orderindex"></Input>
                </FormItem>
                <FormItem label="滤镜价格" prop="filterprice">
                     <Input v-model="formValidate.filterprice" placeholder="Enter your filterprice"></Input>
                </FormItem>
                <FormItem label="使用时间" prop="usetime">
                    <Select v-model="formValidate.usetime">
                        <Option :value="item.value" v-for="item in usetimeOpt" :key='item.value'>{{item.label}}</Option>                       
                    </Select>
                </FormItem>
                <FormItem label="是否可用" prop="freeflag">
                    <Select v-model="updateUseflag" disabled>
                        <Option :value="item.value" v-for="item in freeOpt" :key='item.value'>{{item.label}}</Option>                       
                    </Select>
                </FormItem>
                <FormItem label="备注" prop="remark">
                     <Input v-model="formValidate.remark" placeholder="Enter your filterprice"></Input>
                </FormItem>
                <FormItem label="滤镜类型" prop="driverType">
                    <RadioGroup v-model="formValidate.driverType">
                        <Radio label="0">android</Radio>
                        <Radio label="1">ios</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="显示类型" prop="showtype">
                     <RadioGroup v-model="formValidate.showtype"  style="width:200px">
                        <Radio label="0">录像时显示</Radio>
                        <Radio label="1">编辑时显示</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="是否收费" prop="priceflag">
                     <RadioGroup v-model="formValidate.priceflag" @on-change="priceflagChange">
                        <Radio label="0">免费</Radio>
                        <Radio label="1">收费</Radio>
                    </RadioGroup>
                </FormItem>
                
                <FormItem label="是否显示" prop="delflag">
                    <RadioGroup v-model="formValidate.delflag">
                        <Radio label="0">显示</Radio>
                        <Radio label="1">不显示</Radio>
                    </RadioGroup>
                </FormItem>
                
            </Form>
                <div slot="footer">
                    <Button @click="cancelShortVideoClass('formValidate')" style="margin-left: 8px">取消</Button>
                    <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                </div>
        </Modal>
        <!-- 查看大图弹框 -->
        <Modal
        title="查看大图"
        v-model="isShowBigPic"
        :mask-closable="false"
        class="justOnlyCenter"
        >
        <viewer style="z-index:999;" toolbar=false>
            <img :src="BigPic" class="userDefineImg">
        </viewer>
        <div slot="footer">
            <Button type="info" @click="isShowBigPic=false">确定</Button>
        </div>
        </Modal>
  </div>
</template>

<script>
import {queryFilterDetail,updateFilterPriceFlag,updateAllFilterDetailShowStatus,addFilterDetail,updateFilterDetail,delTrueAllFilterDetail,findAddFilterClass} from '@/api/filter'
import { getDate2 } from '@/libs/tools.js'
export default {
  name: 'tables_page',
  data () {
    return {
    //查看大图：
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
        {title: '编号', key: 'id', width: 80, align: 'center',fixed:'left'},
        {title: '分类编号', key: 'classId',width: 100,  align: 'center'},
        {title: '滤镜标题', key: 'title', width: 150,align: 'center'},
        {title: '滤镜提示', key: 'tip', width: 200,align: 'center'},
        {title: '显示类型', key: 'showtype',width: 100,  align: 'center'},
        {title: '滤镜文件地址', key: 'itemurl',width:200, align: 'center'},
        {
            title: '滤镜图片地址', key: 'iconurl',width:200, align: 'center',
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
                        }
                    }
                })
            }
        },
        {
            title: '滤镜颜色', key: 'color',width:100, align: 'center',
            render: (h,params) => {
                return h('ColorPicker',{
                    props:{
                        size:'large',
                        value:params.row.color,
                        disabled:true
                    }
                })
            }
        },
        {title: '显示排序', key: 'orderindex', width: 100, align: 'center'},
        {title: '创建时间', key: 'createtime', width: 150, align: 'center'},
        {title: '滤镜价格', key: 'filterprice', width: 100, align: 'center'},
        {title: '使用时间', key: 'usetime', width: 100, align: 'center'},
        {title: '滤镜类型', key: 'driverType', width: 100,align: 'center'},
        {title: '备注', key: 'remark', width: 150,align: 'center'},
        {title: '是否可用', key: 'freeflag',  width: 100,align: 'center'},
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
                        size: "large",
                    },
                    on: {
                        'on-change': (val) => {
                            console.log(val);                           
                            updateFilterPriceFlag({ids:params.row.id.toString()}).then(res=>{
                                if(res.data.code===0){
                                    val==1? params.row.freeflag='不可用' : params.row.freeflag='可用'                                
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
                            updateAllFilterDetailShowStatus({ids:params.row.id.toString()}).then(res=>{
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
            width:100,
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
                console.log(params.row);
                this.titleMd = '编辑滤镜管理信息'
                this.modalAddStickersInfo  = true
                //点击编辑，flag为true
                this.isflag = true
                //点击编辑和更新时实时更新：
                this.getNameList()
                this.formValidate.id=params.row.id.toString()
                this.formValidate.classId=params.row.classId.toString()
                this.formValidate.delflag=params.row.delflag.toString()
                this.formValidate.title=params.row.title
                this.formValidate.tip=params.row.tip
                this.formValidate.itemurl=params.row.itemurl
                this.paramsFreeflag=params.row.freeflag=="不可用"?'0':'1'
                this.formValidate.iconurl=params.row.iconurl
                this.formValidate.filterprice=params.row.filterprice.toString()
                this.formValidate.priceflag=params.row.priceflag.toString()
                this.formValidate.usetime=params.row.usetime
                this.formValidate.orderindex=params.row.orderindex.toString()
                // this.formValidate.createtime=params.row.createtime
                this.formValidate.driverType=params.row.driverType=="ios"?'1':'0'
                this.formValidate.color=params.row.color
                this.formValidate.showtype=params.row.showtype=="录像时显示"?'0':'1'
                this.formValidate.remark=params.row.remark
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
                        delTrueAllFilterDetail({ids:params.row.id}).then(res=>{
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
            }, '删除'),
            ]);
            }
            }
      ],
      freeOpt:[
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
                { required: true, message: '滤镜标题不能为空', trigger: 'blur' }
            ],
            id: [
                { required: true, message: '滤镜编号不能为空', trigger: 'blur' },
            ],
            classId: [
                { required: true, message: '滤镜分类编号不能为空', trigger: 'blur' },
            ],
            itemurl: [
                { required: true, message: '滤镜文件地址不能为空', trigger: 'blur' },
            ],
            iconurl: [
                { required: true, message: '滤镜图片地址不能为空', trigger: 'blur' },
            ],
            orderindex: [
                { required: true, message: '显示排序不能为空', trigger: 'blur' },
            ],
            color: [
                { required: true, message: '请选择颜色', trigger: 'change' }
            ],
            delflag: [
                { required: true, message: '请选择是否显示', trigger: 'change' }
            ],
            remark: [
                { required: true, message: '备注不能为空', trigger: 'change' }
            ],
            priceflag: [
                { required: true, message: '请选择是否收费', trigger: 'change' }
            ],
            filterprice: [
                { required: true, message: '滤镜价格不能为空', trigger: 'change' }
            ],
            showtype: [
                { required: true, message: '请选择滤镜显示类型', trigger: 'change' }
            ],
            driverType: [
                { required: true, message: '请选择滤镜类型', trigger: 'change' }
            ],
            tip: [
                { required: true, message: '滤镜提示不能为空', trigger: 'change' }
            ],
            usetime: [
                { required: true, message: '请选择滤镜使用时间', trigger: 'change' }
            ]
        },
        loading:true,
        freeflagStatus:'',
        classIdList:[],
        paramsFreeflag:''
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
        this.titleMd = '添加滤镜管理信息'
        this.modalAddStickersInfo  = true
        this.flag=false
        this.getNameList()
        this.paramsFreeflag=''
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
    //批量修改滤镜是否显示：
    modifyEditStickersStatus(){
        if(this.multipleSelectionId.length!==0){
            this.$Modal.confirm({
                "title":"是否批量修改滤镜显示状态？",
                onOk: () => {
                    updateAllFilterDetailShowStatus({ids:this.multipleSelectionId.toString()}).then(res=>{
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
    //批量修改滤镜收费状态：
    modifyEditStickersPriceStatus(){
        if(this.multipleSelectionId.length!==0){
            this.$Modal.confirm({
                "title":"是否批量修改滤镜收费状态？",
                onOk: () => {
                    updateFilterPriceFlag({ids:this.multipleSelectionId.toString()}).then(res=>{
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
    //批量删除滤镜：
    modifyDelStickers(){
         if(this.multipleSelectionId.length!==0){
            this.$Modal.confirm({
                "title":"是否删除滤镜？",
                onOk: () => {
                    delTrueAllFilterDetail({ids:this.multipleSelectionId.toString()}).then(res=>{
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
        console.log(val,'val');
        if(val==0){
            this.paramsFreeflag='1'
        }else{
            this.paramsFreeflag='0'
        }
    },
    //确认提交：
    handleSubmit (name) {
        if(this.isflag){//flag为true为编辑：
        // console.log(this.formValidate);
            this.$refs[name].validate((valid) => {
                if (valid) {
                    // this.formValidate.createtime = "2018-12-18T02:07:50.959Z"
                    updateFilterDetail({id:this.formValidate.id},this.formValidate).then(res=>{
                        if(res.data.code===0){
                            this.$Message.success(res.data.data)
                            this.isLoading=true
                            this.initData()
                            this.modalAddStickersInfo = false
                            this.isflag=false
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
                    // this.formValidate.createtime = "2018-12-18T02:07:50.959Z"
                    let d = new Date().getTime()
                    this.formValidate.createtime = d
                    addFilterDetail(this.formValidate).then(res=>{
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
    },
    //查询滤镜分类：
    getNameList(){
        let temp = []
        findAddFilterClass().then(res=>{
            res.data.forEach(item=>{
                if(item.delflag=='1'){
                    temp.push(item.id.toString())
                }
            })
            this.classIdList = temp
        })
    },
    initData(){
        queryFilterDetail(this.queryList).then(res => {
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
                    if(item.freeflag===0){
                        item.freeflag="不可用"
                    }else if(item.freeflag===1){
                        item.freeflag="可用"
                    }
                    if(item.showtype===0){
                        item.showtype="录像时显示"
                    }else if(item.showtype===1){
                        item.showtype="编辑时显示"
                    }
                    if(item.driverType===0){
                        item.driverType="android"
                    }else if(item.driverType===1){
                        item.driverType="ios"
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
                this.formValidate.freeflag=this.paramsFreeflag
                return this.formValidate.freeflag
            },      
            set:function(newval){   
                console.log('我被设置了'); 
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