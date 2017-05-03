<template>
    <div class="rd-console-view">
        <Log :key="log.id" :log="log" v-for="log in logQueue"></Log>
    </div>
</template>

<script>
import Log from '../components/LogViewer.vue'
export default {
    data () {
        return {
            logQueue: window.logManager.logQueue
        }
    },
    components: {
        Log
    },
    mounted () {

    }
}
</script>