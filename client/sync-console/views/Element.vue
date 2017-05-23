<style>
.rd-console-element {

}
</style>

<template>
    <div class="rd-console-view rd-console-element">
        <DOMViewer :data="element"></DOMViewer>
    </div>
</template>

<script>
import DOMViewer from '../components/DOMViewer.vue'

export default {
    data () {
        return {
            timer: null,
            element: this.$syncConsole.element
        }
    },
    components: {
        DOMViewer
    },
    mounted () {
        this.$syncConsole.$on('update-element', this.updateElement)
    },
    beforeDestroy () {
        this.$syncConsole.$off('update-element', this.updateElement)
    },
    methods: {
        updateElement (element) {
            this.element = element
        }
    }
}
</script>
