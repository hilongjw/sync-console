import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    
}

const getters = {
    logManager: state => {
      return state.logManager
    }
}

const mutations = {
    // UPDATE_APP_COLOR (state, color) {
    //     state.AppConfig.color = color
    // }
}

const store = new Vuex.Store({
    state,
    mutations,
    getters
})

export default store