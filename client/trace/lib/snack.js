import Vue from 'vue'
import SnackBar from '../components/SnackBar.vue'

const vm = new Vue({
    render (h) {
        return h(SnackBar)
    }
})

export default {
    install () {
        const el = document.createElement('div')
        document.body.appendChild(el)
        vm.$mount(el)
        const snack = vm.$children[0]
        Vue.prototype.$snack = function (content, time) {
            snack.create(content, time)
        }
    }
}
