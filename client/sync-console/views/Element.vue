<style>
.rd-console-element {

}
</style>

<template>
    <div class="rd-console-view rd-console-element">
        <DOMViewer :data="data"></DOMViewer>
    </div>
</template>

<script>
import DOMViewer from '../components/DOMViewer.vue'

export default {
    data () {
        return {
            timer: null,
            data: null,
            elementNode: {
                tag: '',
                attrs: [],
                children: []
            }
        }
    },
    components: {
        DOMViewer
    },
    mounted () {
        this.timer = setInterval(() => {
            this.parseNode()
        }, 50)
    },
    beforeDestroy () {
        clearInterval(this.timer)
    },
    methods: {
        parseNode () {
            this.data = document.querySelector('html')
        }
    }
}
</script>
