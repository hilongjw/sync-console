import Vue from 'vue'

const el = document.createElement('div')
el.id = 'ddd'
el.setAttribute('style', 'height: 20px; width: 20px; background: red;')
document.body.appendChild(el)

const syncConsoleManager = new window.SyncConsoleManager({
    clickCount: 6, // in 3s

    // for sync console
    project: 'sync_test',
    maxLogCount: 50,
    cdn: 'http://sync.bood.in/',
    server: 'http://127.0.0.1:9999/', // 'http://sync.bood.in/',
    Vue: Vue
})

syncConsoleManager.mount('#ddd')

 // eslint-disable-next-line
const app = new Vue({
    el: '#app',
    data () {
        return {
            testData: {
                a: 6666
            },
            lock: false,
            value: '666'
        }
    },
    render (h) {
        return <div>
            { this.value }
            <input
                value={this.value}
                onInput={this.inputAction}
                onCompositionEnd={ this.handleComposition }
                onCompositionStart={ this.handleComposition }
                onCompositionUpdate={ this.handleComposition }
            >
            </input>
        </div>
    },
    mounted () {
        console.log('app mounted')
    },
    methods: {
        inputAction (e) {
            if (this.lock) return
            this.value = e.target.value
        },
        handleComposition (e) {
            if (e.type === 'compositionend') {
                this.lock = false
            }
            this.lock = true
        },
        show () {
            console.log(this.a.b)
        }
    }
})
