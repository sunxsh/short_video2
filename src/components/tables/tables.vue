<template>
  <div>
    <!-- <div v-if="searchable && searchPlace === 'top'" class="search-con search-con-top">
      <Select v-model="searchKey" class="search-col">
        <Option v-for="item in columns" v-if="item.key !== 'handle'&& item.key !=='selection'&& item.key !=='avatar' && item.key!== 'id'" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
      </Select>
      <Input @on-change="handleClear" clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
      <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;搜索</Button>
    </div> -->
    <Table
      style="table-layout: auto;"
      ref="tablesMain"
      :data="insideTableData | fmtTime"
      :columns="insideColumns"
      :stripe="stripe"
      :border="border"
      :show-header="showHeader"
      :width="width"
      :height="height"
      :loading="loading"
      :disabled-hover="disabledHover"
      :highlight-row="highlightRow"
      :row-class-name="rowClassName"
      :size="size"
      :no-data-text="noDataText"
      :no-filtered-data-text="noFilteredDataText"
      @on-current-change="onCurrentChange"
      @on-select="onSelect"
      @on-select-cancel="onSelectCancel"
      @on-select-all="onSelectAll"
      @on-selection-change="onSelectionChange"
      @on-sort-change="onSortChange"
      @on-filter-change="onFilterChange"
      @on-row-click="onRowClick"
      @on-row-dblclick="onRowDblclick"
      @on-expand="onExpand"
    >
      <slot name="header" slot="header"></slot>
      <slot name="footer" slot="footer"></slot>
      <slot name="loading" slot="loading"></slot>
    </Table>
    <!-- <div v-if="searchable && searchPlace === 'bottom'" class="search-con search-con-top">
      <Select v-model="searchKey" class="search-col">
        <Option v-for="item in columns" v-if="item.key !== 'handle' && item.key !=='selection' && item.key !=='avatar'" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
      </Select>
      <Input placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
      <Button class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;搜索</Button>
    </div> -->
    <a id="hrefToExportTable" style="display: none;width: 0px;height: 0px;"></a>
  </div>
</template>

<script>
import TablesEdit from './edit.vue'
import handleBtns from './handle-btns'
import './index.less'
import json from './city_code.json'
export default {
  name: 'Tables',
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    },
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    size: String,
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightRow: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default () {
        return ''
      }
    },
    context: {
      type: Object
    },
    noDataText: {
      type: String
    },
    noFilteredDataText: {
      type: String
    },
    disabledHover: {
      type: Boolean
    },
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * @description 全局设置是否可编辑
     */
    editable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否可搜索
     */
    searchable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 搜索控件所在位置，'top' / 'bottom'
     */
    searchPlace: {
      type: String,
      default: 'top'
    }
  },
  /**
   * Events
   * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
   * @on-cancel-edit 返回值 {Object} 同上
   * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
   */
  data () {
    return {
      insideColumns: [],
      insideTableData: [],
      edittingCellId: '',
      edittingText: '',
      searchValue: '',
      searchKey: ''
    }
  },
  filters:{
      city_name(arg){
        if(arg.length!==0){
          json.RECORDS.forEach((item)=>{
          arg.forEach(data=> {
            console.log(2);
            if(data.citycode===item.city_code){
              console.log(3)
              data.citycode  = item.name
            }
          })      
        })
      }    
      return arg 
    },
    fmtTime(time){
         time.forEach(value=>{
          let d = new Date(value.createtime)
          let ud = new Date(value.uploadtime)
          let rd = new Date(value.reviewtime)
          // value.createtime = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
          let time22 = d.getFullYear() + "-" + (d.getMonth() + 1).toString().padStart(2,'0') + "-" + d.getDate().toString().padStart(2,'0') +"    "+ d.getHours().toString().padStart(2,'0') + ":" + d.getMinutes().toString().padStart(2,'0') + ":" + d.getSeconds().toString().padStart(2,'0') 
          let time23 = ud.getFullYear() + "-" + (ud.getMonth() + 1).toString().padStart(2,'0') + "-" + ud.getDate().toString().padStart(2,'0') +"    "+ ud.getHours().toString().padStart(2,'0') + ":" + ud.getMinutes().toString().padStart(2,'0') + ":" + ud.getSeconds().toString().padStart(2,'0') 
          let time24 = rd.getFullYear() + "-" + (rd.getMonth() + 1).toString().padStart(2,'0') + "-" + rd.getDate().toString().padStart(2,'0') +"    "+ rd.getHours().toString().padStart(2,'0') + ":" + rd.getMinutes().toString().padStart(2,'0') + ":" + rd.getSeconds().toString().padStart(2,'0') 
          if(value.createtime){
            value.createtime = time22
          }
          if(value.uploadtime){
             value.uploadtime = time23
          }
          if(value.reviewtime){
            value.reviewtime = time24
          }    
      })
      // }
     return time     
    },
  },
  computed:{

  },
  methods: {
    suportEdit (item, index) {
      item.render = (h, params) => {
        return h(TablesEdit, {
          props: {
            params: params,
            value: this.insideTableData[params.index][params.column.key],
            edittingCellId: this.edittingCellId,
            editable: this.editable
          },
          on: {
            'input': val => {
              this.edittingText = val
            },
            'on-start-edit': (params) => {
              this.edittingCellId = `editting-${params.index}-${params.column.key}`
              this.$emit('on-start-edit', params)
            },
            'on-cancel-edit': (params) => {
              this.edittingCellId = ''
              this.$emit('on-cancel-edit', params)
            },
            'on-save-edit': (params) => {
              this.value[params.row.initRowIndex][params.column.key] = this.edittingText
              this.$emit('input', this.value)
              this.$emit('on-save-edit', Object.assign(params, {value: this.edittingText}))
              this.edittingCellId = ''
            }
          }
        })
      }
      return item
    },
    surportHandle (item) {
      let options = item.options || []
      let insideBtns = []
      options.forEach(item => {
        if (handleBtns[item]) insideBtns.push(handleBtns[item])
      })
      let btns = item.button ? [].concat(insideBtns, item.button) : insideBtns
      item.render = (h, params) => {
        params.tableData = this.value
        return h('div', btns.map(item => item(h, params, this)))
      }
      return item
    },
    handleColumns (columns) {
      this.insideColumns = columns.map((item, index) => {
        let res = item
        if (res.editable) res = this.suportEdit(res, index)//email
        if (res.key === 'handle') res = this.surportHandle(res)//handle
        return res
      })
    },
    //设置默认搜索值：
    setDefaultSearchKey () {
    //   this.searchKey = this.columns[0].key !== 'handle'&& this.columns[0].key !=='selection' && this.columns[1].key !=='avatar'? this.columns[0].key : (this.columns.length > 1 && this.columns[1].key !=='avatar'? this.columns[1].key : this.columns[2].key)
    //   // console.log(this.searchKey)
    //   // this.searchKey=this.columnsP
    },
    handleClear (e) {
      if (e.target.value === '') this.insideTableData = this.value
    },
    // //点击搜索：
    // handleSearch () {
    //   // console.log(this.value,'value');//页面的十条数据
    //   this.insideTableData = this.value.filter((item) => {
    //     // console.log(item[this.searchKey].toString())//searchKey：下拉框中选定的要过滤的值
    //     return item[this.searchKey].toString().indexOf(this.searchValue) > -1
    //   })    
    //   //this.searchValue:input框输入的值
    //   // console.log(this.searchKey)
    //   // console.log(this.columns)
    //   // console.log(111)
    // },
    handleTableData () {
      // console.log(this.value);//表格中渲染的数据
      this.insideTableData = this.value.map((item, index) => {
        let res = item
        res.initRowIndex = index//让每条数据多一个initRowIndex索引
        return res
      })
    },
    exportCsv (params) {
      this.$refs.tablesMain.exportCsv(params)
    },
    clearCurrentRow () {
      this.$refs.talbesMain.clearCurrentRow()
    },
    onCurrentChange (currentRow, oldCurrentRow) {
      this.$emit('on-current-change', currentRow, oldCurrentRow)
    },
    onSelect (selection, row) {
      this.$emit('on-select', selection, row)
    },
    onSelectCancel (selection, row) {
      this.$emit('on-select-cancel', selection, row)
    },
    onSelectAll (selection) {
      this.$emit('on-select-all', selection)
    },
    onSelectionChange (selection) {
      this.$emit('on-selection-change', selection)
    },
    onSortChange (column, key, order) {
      this.$emit('on-sort-change', column, key, order)
    },
    onFilterChange (row) {
      this.$emit('on-filter-change', row)
    },
    onRowClick (row, index) {
      this.$emit('on-row-click', row, index)
    },
    onRowDblclick (row, index) {
      this.$emit('on-row-dblclick', row, index)
    },
    onExpand (row, status) {
      this.$emit('on-expand', row, status)
    }
  },
  watch: {
    columns (columns) {
      this.handleColumns(columns)
      this.setDefaultSearchKey()
    },
    value (val) {
      this.handleTableData()
      // if (this.searchable) this.handleSearch()
    }
  },
  mounted () {
    this.handleColumns(this.columns)
    this.setDefaultSearchKey()
    this.handleTableData() 
    // this.city_name()    
  }
}
</script>
