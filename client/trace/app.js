import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import snackbar from './lib/snack'

Vue.use(snackbar)

const el = document.createElement('div')

document.body.appendChild(el)

const app = new Vue({
    serverCacheKey: () => 'Console',
    router,
    store,
    ...App
})

app.$mount(el)

export { app }