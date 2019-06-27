<template>
    <div>
        <div id="btn">
            <Button type="primary" @click="ModifyDelUnrecMusicClass">批量删除音乐分类(不可恢复)</Button>
        </div>
        <div id='isShow'>
            显示多选框：<i-switch v-model="showSelection" style="margin-right: 5px;margin-bottom:10px;"></i-switch>
        </div>
        <!-- Table -->
         <div>
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
            </Card>
         </div>
         <!-- 查看详情弹出框  @on-ok="asyncOK('formCustom')"-->
        <Modal
            title="查看详情"
            v-model="modalDetil"
            :mask-closable="false"          
            :width="widthForm"
            :scrollable='true'
            >
           <Form :model="formCustom" :label-width="100" inline>
                <FormItem label="主键编号" prop="id">
                    <Input type="text" v-model="formCustom.id" disabled/>
                </FormItem>
                <FormItem label="分类名称" prop="name">
                    <Input type="text" v-model="formCustom.name" disabled/>
                 </FormItem>
                <FormItem label="分类图片" prop="iconurl">
                    <Input type="text" v-model="formCustom.iconurl" disabled/>
                 </FormItem>
                <FormItem label="分类排序" prop="orderindex">
                    <Input type="text" v-model="formCustom.orderindex" disabled/>
                </FormItem>
                <FormItem label="创建时间" prop="createtime">
                  <Input type="text" v-model="formCustom.createtime" disabled/>
                </FormItem>
                <FormItem label="是否显示" prop="isshow">
                    <Select v-model="formCustom.isshow" disabled>
                        <Option :value="item.value" v-for="item in isshowOpt" :key='item.value'>{{item.content}}</Option>                       
                    </Select>
                </FormItem>
          </Form>
        </Modal>
<!-- 添加短视频分类弹出框 -->
        <Modal
            title="添加短视频分类"
            v-model="modalAddShortVideoClass"
            :styles="{top: '0px'}"
            :mask-closable="false"
            >
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                <FormItem label="分类表主键" prop="id">
                    <Input v-model="formValidate.id" placeholder="Enter your id"></Input>
                </FormItem>
                <FormItem label="分类名称" prop="name">
                    <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
                </FormItem>
                <FormItem label="分类图片" prop="iconurl">
                    <Input v-model="formValidate.iconurl" placeholder="Enter your iconurl"></Input>
                </FormItem>
                <FormItem label="分类排序" prop="orderindex">
                    <Input v-model="formValidate.orderindex" placeholder="Enter your orderindex"></Input>
                </FormItem>
                <FormItem label="所属分类" prop="parentid">
                    <Input v-model="formValidate.parentid" placeholder="Enter your parentid"></Input>
                </FormItem>
                <FormItem label="是否显示" prop="isshow">
                    <RadioGroup v-model="formValidate.isshow">
                        <Radio label="0">显示</Radio>
                        <Radio label="1">不显示</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="是否删除" prop="isDelete">
                    <RadioGroup v-model="formValidate.isDelete">
                        <Radio label="0">未删除</Radio>
                        <Radio label="1">删除</Radio>
                    </RadioGroup>
                </FormItem>
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
import {getMusicClass, deleteMusicClassPhysical,changeMusicClassbyStatus } from '@/api/music'
import { getDate2 } from '@/libs/tools.js'
export default {
  name: 'tables_page',
  data () {
    return {
     //查看大图:
    isShowBigPic:false,
    BigPic:'',
    // switch1:false,
    fileBaseUrl:'https://v.fted.net/',
    //默认选中状态 ：
    isChecked:'',
    //是否显示页面内容：
    showSelection:false,
    showId:false,
    showuserid:false,
    showMusicid:false,
      columns: [
        {title: '主键编号', key: 'id', align: 'center'},
        {title: '分类名称', key: 'name', align: 'center'},
        {
            title: '分类图片', key: 'iconurl', align: 'center',
            render:(h,params)=>{
                return h('img',{   
                        style:{
                            width:'50px',
                            heigth:'50px',
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
        {title: '分类排序', key: 'orderindex', align: 'center'},
        {title: '创建时间', key: 'createtime', align: 'center'},
        {title: '是否显示', key: 'isshow', align: 'center',
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
                            console.log(params.row.isshow);
                            changeMusicClassbyStatus({ids:params.row.id,status:params.row.isshow==1?0:1}).then(res => {
                                // console.log(res);
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
                this.formCustom.createtime=params.row.createtime
                this.formCustom.isshow=params.row.isshow
            }
            }
            }, '查看详情'),
            ]);
            }
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
                { required: true, message: '分类表主键不能为空', trigger: 'blur' },
                // { type: 'number', message: '分类表主键为数值类型', trigger: 'blur' }
            ],
            iconurl: [
                { required: true, message: '分类图片不能为空', trigger: 'blur' },
            ],
            orderindex: [
                { required: true, message: '分类排序不能为空', trigger: 'blur' },
            ],
            parentid: [
                { required: true, message: '所属分类不能为空', trigger: 'blur' },
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
    ModifyDelUnrecMusicClass(){
        if(this.multipleSelectionId.length!==0){
            this.$Modal.confirm({
                "title":"此操作不可恢复，是否删除？",
                onOk: () => {
                    deleteMusicClassPhysical({ids:this.multipleSelectionId.toString()}).then(res=>{
                        console.log(res);
                        if(res.data.code===0){
                            this.$Message.info("删除成功")
                            // this.$Alert.success("删除成功")
                            this.isLoading=true
                            this.initData()
                            this.multipleSelectionId.length=0
                        }
                    })
    
                },
                onCancel: () => {
                }
            })
        }else{
            this.$Modal.error({"title":'请选择需要删除的用户'})
        }
    },
    initData(){
        getMusicClass().then(res => {
            this.isLoading=false
            if(res.data.code===0){
                this.tableData = res.data.data
                this.dataCount = res.data.total
                console.log(this.tableData,1)
            }else{
                this.$Message.error(res.data.data)
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
            let temData = this.tableData
            temData.map(item=>{
                // 时间戳转换
                item.createtime = getDate2(item.createtime)
            })
            return temData
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