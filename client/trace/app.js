import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import LogManager from './lib/log-manager.js'
const logManager = new LogManager()

window.logManager = logManager

const app = new Vue({
    serverCacheKey: () => 'Console',
    router,
    store,
    ...App
})

export { app }