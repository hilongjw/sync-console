import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    AppConfig: {
        color: '#1F8CEB' 
    }
}

const getters = {
    AppConfig: state => {
      return state.AppConfig
    }
}

const mutations = {
    UPDATE_APP_COLOR (state, color) {
        state.AppConfig.color = color
    }
}

const store = new Vuex.Store({
    state,
    mutations,
    getters
})

export default store