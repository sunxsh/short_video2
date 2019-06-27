<template>
    <Page 
    :total="totalPage" 
    size="small" 
    show-elevator 
    show-sizer 
    class="-_-" 
    show-total 
    :page-size-opts="[10,20,50,100,200]"
    @on-page-size-change="getCurrentPageSize"
    @on-change="changePages"
    />
</template>
<script>
export default {
    props:['totalPage'],
    data(){
        return{
            pageSize:10,
            offset:0,
            sort:'id',
            order:'asc',
            pageNum:''      
        }
    },
    methods:{
        //10,20，50,100...
        getCurrentPageSize(value){
            this.pageSize = parseInt(value)                   
            console.log(this.pageSize,this.offset)
            this.$emit('getPages',this.pageSize)
        },
        changePages(page){
            this.offset = (page-1)*this.pageSize
            console.log(this.offset,'woshioffset')
            this.$emit('changes',this.offset)
        }
    }
}
</script>
<style lang="less" scoped>
.-_-{
    margin:30px 0;
    float: right;
}
</style>
