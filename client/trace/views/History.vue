<template>
    <div class="rd-console-view">
        <Log :key="log.id" :log="log" v-for="log in historyQueue"></Log>
        <div class="rd-console-execcode">
            <div class="rd-console-execcode-action-right">
                <button class="rd-console-btn highlight"  @click="fire">OK</button>
                <button class="rd-console-btn"  @click="clear">Clear</button>
            </div>
        </div>
    </div>
</template>

<script>
import Log from '../components/LogViewer.vue'

export default {
    data () {
        return {
            command: '',
            historyQueue: this.$root.$logManager.historyQueue.slice()
        }
    },
    components: {
        Log
    },
    mounted () {
        this.$root.$logManager.$on('clearHistory', log => {
            this.historyQueue = []
        })
        this.$root.$logManager.$on('newLog', log => {
            this.historyQueue.push(log)
        })
    },
    beforeDestroy () {
        this.$root.$logManager.$off('newLog')
        this.$root.$logManager.$off('clear')
    },
    methods: {
        fire () {
            this.$root.$logManager.execCommand(this.command)
            this.command = ''
        },
        clear () {
            this.$root.$logManager.clearHistory()
        }
    }
}
</script>
