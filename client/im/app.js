import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Lazyload from 'vue-lazyload'

Vue.use(Lazyload)

const app = new Vue({
    serverCacheKey: () => 'App',
    router,
    store,
    ...App
})

export { app }
