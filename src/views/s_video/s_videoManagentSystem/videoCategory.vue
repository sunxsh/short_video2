<template>
    <div>
        <div id="btn">
            <Button type="primary" @click="addShortVideoClass">添加视频分类</Button>
            <Button type="primary" @click="ModifyDelSelection">批量删除短视频分类</Button>
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
              />
              <change-page :totalPage="dataCount" @getPages="handlePage" @changes="handleChange"></change-page>
            </Card>
         </div>
         <!-- 查看详情弹出框  @on-ok="asyncOK('formCustom')"-->
        <Modal
            title="查看详情"
            v-model="modalDetil"
            :mask-closable="true"         
            :width="widthForm"
            :styles="{top: '20px'}"
            :scrollable='true'
            >
           <Form :model="formCustom" :label-width="100" inline>
                <FormItem label="分类表主键">
                    <Input type="text" v-model="formCustom.id" disabled/>
                </FormItem>
                <FormItem label="分类名称">
                    <Input type="text" v-model="formCustom.name" disabled/>
                 </FormItem>
                <FormItem label="分类图片">
                    <Input type="text" v-model="formCustom.iconurl" disabled/>
                 </FormItem>
                <FormItem label="分类排序">
                    <Input type="text" v-model="formCustom.orderindex" disabled/>
                </FormItem>
                <FormItem label="创建时间">
                  <Input type="text" v-model="formCustom.createtime" disabled/>
                </FormItem>
                <FormItem label="是否显示">
                    <Select v-model="formCustom.isshow" disabled>
                        <Option :value="item.value" v-for="item in isshowOpt" :key='item.value'>{{item.content}}</Option>                       
                    </Select>
                </FormItem>
                 <!-- '删除标记 0 未删除  1 删除' -->
                <FormItem label="是否删除">
                    <Select v-model="formCustom.isDelete" disabled>
                        <Option :value="item.value" v-for="item in isDeleteOpt" :key='item.value'>{{item.content}}</Option>                       
                    </Select>
                </FormItem>
                <FormItem label="分类请求类型">
                    <Select v-model="formCustom.type" disabled>
                        <Option :value="item.value" v-for="item in typeOpt" :key='item.value'>{{item.content}}</Option>                       
                    </Select>
                </FormItem>
                <FormItem label="所属分类">
                  <Input type="text" v-model="formCustom.parentid" disabled/>
                </FormItem>
          </Form>
        </Modal>
<!-- 添加短视频分类弹出框 -->
        <Modal
            title="添加短视频分类"
            v-model="modalAddShortVideoClass"
            :styles="{top: '20px'}"
            :mask-closable="false"
            >
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">              
                <FormItem label="分类名称" prop="name">
                    <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
                </FormItem>
                <FormItem label="分类图片" prop="iconurl">
                    <Input v-model="formValidate.iconurl" placeholder="Enter your iconurl"></Input>
                </FormItem>
                <FormItem label="所属分类" prop="parentid">
                    <!-- <Input v-model="formValidate.parentid" placeholder="Enter your parentid"></Input> -->
                    <Select v-model="formValidate.parentid">
                        <Option :value="item" v-for="(item,i) in classIdList" :key='i'>{{item}}</Option>                       
                    </Select>
                </FormItem>
                <FormItem label="是否显示" prop="isshow">
                    <RadioGroup v-model="formValidate.isshow">
                        <Radio label="0">显示</Radio>
                        <Radio label="1">不显示</Radio>
                    </RadioGroup>
                </FormItem>
                <!-- <FormItem label="是否删除" prop="isDelete">
                    <RadioGroup v-model="formValidate.isDelete">
                        <Radio label="0">未删除</Radio>
                        <Radio label="1">删除</Radio>
                    </RadioGroup>
                </FormItem> -->
                <FormItem label="分类请求类型" prop="type">
                    <RadioGroup v-model="formValidate.type">
                        <Radio label="0">普通请求</Radio>
                        <Radio label="1">地址信息请求</Radio>
                    </RadioGroup>
                </FormItem>                            
            </Form>
               <div slot="footer">
                    <Button @click="cancelShortVideoClass('formValidate')" style="margin-left: 8px">取消</Button>
                    <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                </div>
        </Modal>
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
import {getshortVideoClass, addShortVideoClass, delVideoClass, showVideoClass } from '@/api/shortVideo'
import json from '@/components/tables/city_code.json'
import Cpages from '@/components/changePages/changePages'
import { getDate2 } from '@/libs/tools.js'
export default {
  name: 'tables_page',
  data () {
    return {
    queryList:{
        offset:0,
        limit:10,
    },
    //查看大图:
    isShowBigPic:false,
    BigPic:'',
    onerror: "javascript:this.src='https://img.lgh81.com/timg20190605144929.jpg'",
    classIdList:[],
    fileBaseUrl:'https://v.fted.net/',
    //默认选中状态 ：
    isChecked:'',
    //是否显示页面内容：
    showSelection:false,
    showId:false,
    showuserid:false,
    showMusicid:false,
    columns: [
        {title: '分类表主键', key: 'id', align: 'center'},
        {title: '分类名称', key: 'name', align: 'center'},
        {
            title: '分类图片', key: 'iconurl', align: 'center',
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
                        src:params.row.iconurl,
                        onerror: this.onerror
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
        {title: '分类排序', key: 'orderindex', align: 'center'},
        {title: '创建时间', key: 'createtime',width:130, align: 'center'},
        {
            title: '是否显示', key: 'isshow', align: 'center',
               render: (h, params) => {
                return h("i-Switch", {
                    props: {
                        value: params.row.isshow.toString(),
                        'true-value':'0',//显示
                        'false-value':'1'//不显示
                    },
                    on: {
                        'on-change': (val) => {
                            console.log(val);
                            console.log(params.row);
                            showVideoClass({id:params.row.id,status:params.row.isshow===1?0:1}).then(res => {
                                console.log(res);
                                if(res.data.code===0){
                                    this.$Message.success(res.data.data)
                                    this.isLoading = true
                                    this.initData()
                                }
                            })
                        }
                    }, 
                },[
                    h('span', {
                        slot:'open',
                    }),
                    h('span', {
                        slot:'close',
                    })
                ])
            }
        },
        {title: '是否删除', key: 'isDelete', align: 'center'},
        {title: '分类请求类型', key: 'type', width:150, align: 'center'},
        {title: '所属分类', key: 'parentid', align: 'center'},
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
                this.modalDetil=true
                this.formCustom.id=params.row.id
                this.formCustom.name=params.row.name
                this.formCustom.iconurl=params.row.iconurl
                this.formCustom.orderindex=params.row.orderindex
                this.formCustom.isoriginal=params.row.isoriginal
                this.formCustom.createtime=params.row.createtime
                this.formCustom.isshow=params.row.isshow
                this.formCustom.isDelete=params.row.isDelete
                this.formCustom.type=params.row.type
                this.formCustom.parentid=params.row.parentid
            }
            }
            }, '查看详情'),
            h('Button', {
            props: {
            type: 'error',
            size: 'small'
            }, 
            style: {
            marginRight: '5px',
            marginBottom: '10px'
            },
            //on就是用来绑定事件的
            on: {
            //获取当前行信息，并更新赋值
            click: () => {
                console.log(params.row);
                if(params.row.isDelete==="删除"){
                    return this.$Modal.error({"title":"该条数据已删除"})
                }
                this.$Modal.confirm({"title":"是否确认删除？",
                    onOk: () => {
                        delVideoClass({ids:params.row.id}).then(res=>{
                            console.log(res);
                            if(res.data.code===0){
                                this.$Message.info("删除成功")
                                this.isLoading=true
                                this.initData()
                            }
                        })
                    },
                    onCancel: () => {
                        this.$Message.info('Clicked cancel')
                    }
                })               
            }
            }
            }, '删除'),
            ]);
            }
            }
      ],
      isDeleteOpt:[
        {
            value:'未删除',
            content:'未删除'
        },
        {
            value:'删除',
            content:'已删除'
        }
      ],
      isshowOpt:[
        {
            value:0,
            content:'显示'
        },
        {
            value:1,
            content:'不显示'
        }
      ],
      typeOpt:[
        {
            value:'普通请求',
            content:'普通请求'
        },
        {
            value:'地址信息请求',
            content:'地址信息请求'
        }
      ],
      tableData: [],
      dataCount:0,
      pageSize:10,
      now:1,
      isLoading:true,
      modalDetil: false,
      width:'100%',
      height:600,
      formCustom: {
      },
      widthForm:600,
      ids:[],
      modalShortVideo:false,
      state:'',
        //查看封面：
        modalImg:false,
        imgsrc:'',
        //选中id存放：
        multipleSelectionId:[],
        //添加短视频分类弹出框：
        modalAddShortVideoClass:false,
        formValidate: {
        },
        ruleValidate: {
            name: [
                { required: true, message: '分类名称不能为空', trigger: 'blur' }
            ],
            id: [
                { required: false, message: '分类表主键不能为空', trigger: 'blur' },
            ],
            iconurl: [
                { required: false, message: '分类图片不能为空', trigger: 'blur' },
            ],
            orderindex: [
                { required: true, message: '分类排序不能为空', trigger: 'blur' },
            ],
            parentid: [
                { required: false, message: '所属分类不能为空', trigger: 'blur' },
            ],
            isshow: [
                { required: true, message: '请选择显示类型', trigger: 'change' }
            ],
            isDelete: [
                { required: true, message: '请选择是否删除', trigger: 'change' }
            ],
            type: [
                { required: true, message: '请选择分类请求类型', trigger: 'change' }
            ],
        },
        loading:true
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
    addShortVideoClass(){
        this.modalAddShortVideoClass  = true
        this.getParentIdList()
    },
    //清空表格：
    handleReset (name) {
        this.$refs[name].resetFields();
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
    ModifyDelSelection(){
        if(this.multipleSelectionId.length!==0){
            this.$Modal.confirm({
                "title":"是否删除？",
                onOk: () => {
                    delVideoClass({ids:this.multipleSelectionId.toString()}).then(res=>{
                        console.log(res);
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
            this.$Modal.warning({'title':'请选择需要删除的用户'})
        }
    },
    //确认提交：
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                let d = new Date().getTime()//当前时间戳
                this.formValidate.createtime = d
                this.formValidate.isDelete = 0
                // this.formValidate.id = parseInt(this.formValidate.id)
                this.formValidate.isshow = parseInt(this.formValidate.isshow)
                // this.formValidate.orderindex = parseInt(this.formValidate.orderindex)
                // this.formValidate.parentid = parseInt(this.formValidate.parentid)
                this.formValidate.type = parseInt(this.formValidate.type)
                console.log(this.formValidate);
                // console.log(this.formValidate.parentid,111);
                // console.log(this.formValidate.isDelete,222);
                addShortVideoClass(this.formValidate).then(res=>{
                    // console.log(res);
                    //接口问题：isshow始终为0
                    if(res.data.code===0){
                        this.$Message.success(res.data.data)
                        this.isLoading=true
                        this.initData()
                        this.modalAddShortVideoClass  = false
                        this.handleReset(name)
                    }else{
                        this.$Message.error(res.data.data)
                    }
                })
            } else {
                this.$Message.error('请正确填写信息')
            }
        })
    },
    cancelShortVideoClass(name){
        this.handleReset(name)
        this.modalAddShortVideoClass  = false
    },
    //查询视频分类： 
    getParentIdList(){
        let temp = []
        getshortVideoClass().then(res=>{
            res.data.rows.forEach(item=>{
                if(item.isDelete==0){                   
                    if(item.parentid==null){
                        return
                    }                    
                        temp.push(item.parentid.toString())
                
                }
            })
            let arr = temp.filter((value,i,self)=>{
                return self.indexOf(value)==i
            })
            this.classIdList = arr
            // console.log(this.classIdList);
        })
    },
    initData(){
        getshortVideoClass(this.queryList).then(res => {
        // if(res.code===200){
            this.tableData = res.data.rows
            this.dataCount = res.data.total
            this.isLoading=false
            // console.log(this.tableData,1)
        // }      
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
                    if(item.type===1){
                        item.type="地址信息请求"
                    }else if(item.type===0){
                        item.type="普通请求"
                    }
                    if(item.isDelete===0){
                        item.isDelete="未删除"
                    }else if(item.isDelete===1){
                        item.isDelete="删除"
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