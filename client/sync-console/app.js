import Vue from 'vue'
import App from './App.vue'
import router from './router'

import snackbar from './lib/snack'

Vue.use(snackbar)

function install (logManager) {
    const el = document.createElement('div')
    document.body.appendChild(el)

    Vue.prototype.$syncConsole = logManager

    const app = new Vue({
        serverCacheKey: () => 'Console',
        router,
        ...App
    })

    app.$mount(el)

    return app
}

export { install }
