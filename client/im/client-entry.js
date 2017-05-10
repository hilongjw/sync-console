import Vue from 'vue'

const el = document.createElement('div')
el.id = 'ddd'
el.setAttribute('style', 'height: 20px; width: 20px; background: red;')
document.body.appendChild(el)

const syncConsoleManager = new window.SyncConsoleManager({
    clickCount: 6, // in 3s

    // for sync console
    project: 'sync test',
    maxLogCount: 50,
    cdn: 'http://sync.bood.in/',
    server: 'http://127.0.0.1:9999/', // 'http://sync.bood.in/',
    Vue: Vue
})

syncConsoleManager.mount('#ddd')

 // eslint-disable-next-line
const app = new Vue({
    el: '#app',
    render (h) {
        return <div>1</div>
    },
    mounted () {
        console.log('app mounted', window.vue = this)
        // this.show()
    },
    methods: {
        show () {
            console.log(this.a.b)
        }
    }
})
