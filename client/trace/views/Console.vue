<style>
.rd-console-console {
    position: relative;
    box-sizing: border-box;
    padding-bottom: 30px;
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
.rd-console-exec-btn {
    position: absolute;
    right: 0;
    top: 0;
    background: #673ab7;
    border: none;
    color: #fff;
    line-height: 35px;
    height: 35px;
    font-size: 13px;
    padding: 0 20px;
}
</style>

<template>
    <div class="rd-console-view rd-console-console">
        <Log :key="log.id" :log="log" v-for="log in logQueue"></Log>
        <div class="rd-console-execcode">
            <textarea @keyup.enter="fire" placeholder="run code here..." class="rd-console-exec-text" v-model="command" rows="1"></textarea>
            <button class="rd-console-exec-btn"  @click="fire">OK</button>
        </div>
    </div>
</template>

<script>
import Log from '../components/LogViewer.vue'
export default {
    data () {
        return {
            command: '',
            logQueue: this.$root.$logManager.logQueue
        }
    },
    components: {
        Log
    },
    methods: {
        fire () {
            this.$root.$logManager.execCommand(this.command)
            this.command = ''
        }
    }
}
</script>