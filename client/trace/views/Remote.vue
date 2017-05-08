<style>
.rd-console-console {
    position: relative;
    box-sizing: border-box;
    padding-bottom: 30px;
}
.rd-console-execcode-remote {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 35px;
    width: 100%;
    padding-left: 75px;
    box-sizing: border-box;
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
.rd-console-remote-client-list {
    background: #fff;
    /*box-shadow: 1px 4px 9px 2px #ccc;*/
    padding: 10px;
    border-radius: 4px;
}
.rd-console-remote-client {
    line-height: 30px;
    border-bottom: 1px solid #ccc;
}
</style>

<template>
    <div class="rd-console-view rd-console-console">
        <div class="rd-console-remote-client-list">
            <div class="rd-console-remote-client" v-for="client in clientList" @click="choose(client)" >
                {{ 'system: ' + client.system.system  }}
            </div>
        </div>
    </div>
</template>

<script>
import Log from '../components/LogViewer.vue'

export default {
    data () {
        return {
            target: '',
            command: '',
            clientList: this.$syncConsole.clientQueue
        }
    },
    components: {
        Log
    },
    mounted () {
        this.$syncConsole.scoketClient.loadClients()
        this.$syncConsole.$on('init-clients', list => { this.clientList = list })
    },
    methods: {
        choose (client) {
            this.target = client.id
            this.$syncConsole.scoketClient.remoteMode(client.id)
            this.$snack('choosed ' + client.system.system + ' ' + client.id)
        }
    }
}
</script>
