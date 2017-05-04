import Vue from 'vue'
import App from './App.vue'

const app = new Vue({
    el: '#app',
    serverCacheKey: () => 'Dash',
    ...App
})

export default app
