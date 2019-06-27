<template>
    <div>
        <img :src="imgSrc" alt="" :onerror="errorImg01">
    </div>
</template>
<script>
import { checkImgExists } from '@/libs/tools.js'
export default {
    data() {
        return {
            imgSrc: 'http://img2.xgo-img.com.cn/product_small/2_300x225/94/ceVVd1vxqEFQ.jpg',
            errSrc: 'https://img.lgh81.com/timg20190605144929.jpg',
            errorImg01: "javascript:this.src='https://img.lgh81.com/timg20190605144929.jpg'"
        }
    },
    methods:{
        onErrSrc(){
            console.log('err')
        }
    },
    created() {
        // if(checkImgExists(this.imgSrc)){
        //     console.log('可以显示')
        // }else{
        //     console.log('不能显示')
        // }
    }
}
</script>

