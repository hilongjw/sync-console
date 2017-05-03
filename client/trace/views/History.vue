<template>
    <div class="rd-console-view">
        <Log :key="log.id" :log="log" v-for="log in logManager.historyQueue"></Log>
    </div>
</template>

<script>
import Log from '../components/LogViewer.vue'

export default {
    data () {
        return {
            logManager: this.$root.$logManager
        }
    },
    components: {
        Log
    }
}
</script>
