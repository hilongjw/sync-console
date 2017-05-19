import Vue from 'vue'

const syncConsoleManager = new window.SyncConsoleManager({
    project: 'sync_test', // default is location.host
    Vue: Vue
})

syncConsoleManager.mount('body')

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
