import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    test: 'test'
  },
  mutations: {
    updateIsReload(state, status){
      state.isReload = status
    },
  },
  actions: {

  },
  getters:{
   
  }
})
