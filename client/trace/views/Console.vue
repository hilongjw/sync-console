<style>
.rd-console-console {
    position: relative;
    box-sizing: border-box;
    padding-bottom: 35px;
}
.rd-console-execcode {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 35px;
    width: 100%;
}
.rd-console-exec-text {
    width: 100%;
    height: 35px;
    line-height: 35px;
    font-size: 12px;
    outline: none;
    padding: 0 10px;
    box-sizing: border-box;
    border: 1px solid #e2e2e2;
}
</style>

<template>
    <div class="rd-console-view rd-console-console">
        <Log :key="log.id" :log="log" v-for="log in logQueue"></Log>
        <div class="rd-console-execcode">
            <textarea @keyup.enter="fire" placeholder="run code here..." class="rd-console-exec-text" v-model="command" rows="1"></textarea>
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
            logQueue: this.$syncConsole.logQueue.slice()
        }
    },
    components: {
        Log
    },
    mounted () {
        this.$syncConsole.$on('clear', log => {
            this.logQueue = []
        })
        this.$syncConsole.$on('update-log', log => {
            this.logQueue.push(log)
        })
        this.$syncConsole.$on('init-log', list => {
            this.logQueue = list
        })
    },
    beforeDestroy () {
        this.$syncConsole.$off('update-log')
        this.$syncConsole.$off('clear')
        this.$syncConsole.$off('init-log')
    },
    methods: {
        fire () {
            this.$syncConsole.execCommand(this.command)
            this.command = ''
        },
        clear () {
            this.$syncConsole.clear()
        }
    }
}
</script>
