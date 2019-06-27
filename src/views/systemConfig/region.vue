<template>
  <div>
    <h2 style="margin-bottom: 15px;">省市区表</h2>
    <Card shadow style="box-shadow:0px 0px 8px rgba(23,0,255,0.1);">
      <tree-table expand-key="name" :expand-type="false" :selectable="false" :columns="columns" :data="data" :load-data="loadData">
        <template slot="likes" slot-scope="scope" >
          <i-switch @on-change="handle(scope)">
            <span slot="open">开</span>
            <span slot="close">关</span>
          </i-switch>
        </template>
      </tree-table>
    </Card>
  </div>
</template>
<script>
  // import region from './region'
  import {getTbRegion} from '@/api/systemConfig'
  export default {
    data () {
      return {
        columns: [
          {
            title: '名称',
            key: 'name',
          },
          {
            title: '城市编号',
            key: 'sex',
          },
          {
            title: '邮政编码',
            key: 'score',
          },
          {
            title: '等级',
            key: 'sex',
          },
          {
            title: '是否开放',
            key: 'likes',
            type: 'template',
            template: 'likes'
          }
        ],
        data: [
           {
            name: 'Jack',
            sex: 'male',
            likes: ['football', 'basketball'],
            score: 10,
            children: [
              {
                name: 'Ashley',
                sex: 'female',
                likes: ['football', 'basketball'],
                score: 20,
                children: [
                  {
                    name: 'Ashley',
                    sex: 'female',
                    likes: ['football', 'basketball'],
                    score: 20,
                  },
                  {
                    name: 'Taki',
                    sex: 'male',
                    likes: ['football', 'basketball'],
                    score: 10,
                    children: [
                      {
                        name: 'Ashley',
                        sex: 'female',
                        likes: ['football', 'basketball'],
                        score: 20,
                      },
                      {
                        name: 'Taki',
                        sex: 'male',
                        likes: ['football', 'basketball'],
                        score: 10,
                        children: [
                          {
                            name: 'Ashley',
                            sex: 'female',
                            likes: ['football', 'basketball'],
                            score: 20,
                          },
                          {
                            name: 'Taki',
                            sex: 'male',
                            likes: ['football', 'basketball'],
                            score: 10,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                name: 'Taki',
                sex: 'male',
                likes: ['football', 'basketball'],
                score: 10,
              },
            ],
          },
        ],
      }
    },
    // created(){
    //   this.data = region
    // },
    methods: {
      loadData (item, callback) {
        console.log(item);
        // callback(data);
      },
      handle (scope) {
        console.log(scope)
      }
    }

  }
</script>

<style>
  .zk-table {
    font-size: 14px !important;
  }
  .zk-icon {
    font-size:16px !important;
  }
</style>

