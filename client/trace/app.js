import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import snackbar from './lib/snack'
import LogManager from './lib/log-manager'

const logManager = new LogManager()

window.logManager = logManager

Vue.use(snackbar)

const app = new Vue({
    serverCacheKey: () => 'Console',
    router,
    store,
    ...App
})

export { app }