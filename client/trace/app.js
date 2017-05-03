import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import snackbar from './lib/snack'

Vue.use(snackbar)


function install (logManager) {
    const el = document.createElement('div')
    document.body.appendChild(el)

    const app = new Vue({
        serverCacheKey: () => 'Console',
        router,
        store,
        ...App
    })

    app.$logManager = logManager
    app.$mount(el)
    return app
}


export { install }