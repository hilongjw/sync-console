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
    padding: 10px;
    border-radius: 4px;
}
.rd-console-remote-client {
    line-height: 30px;
    padding: 5px 10px;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.17);
    margin-bottom: 5px;
    background: #fff;
    word-break: break-all;
    cursor: pointer;
}
.rd-console-remote-client:hover {
    background: #f7f7f7;
}
.rd-console-remote-client-key {
    color: #696969;
}
</style>

<template>
    <div class="rd-console-view rd-console-console">
        <div class="rd-console-remote-client-list">
            <div class="rd-console-remote-client" v-for="client in clientList" @click="choose(client)" >
                <div class="rd-console-remote-client-row">
                    <span class="rd-console-remote-client-key">
                        Project: 
                    </span>
                    <span>{{ client.project  }}</span>
                </div>
                <div class="rd-console-remote-client-row">
                    <span class="rd-console-remote-client-key">
                        System: 
                    </span>
                    <span>{{ client.system.system }}</span>
                </div>
                 <div class="rd-console-remote-client-row">
                    <span class="rd-console-remote-client-key">
                        Browser: 
                    </span>
                    <span>{{ client.system.browser }}</span>
                </div>
                <div class="rd-console-remote-client-row">
                    <span class="rd-console-remote-client-key">
                        UA: 
                    </span>
                    <span>{{ client.system.UA }}</span>
                </div>
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
            clientList: this.$syncConsole.clientQueue
        }
    },
    components: {
        Log
    },
    mounted () {
        this.$syncConsole.initClient()
            .then(() => {
                this.$syncConsole.scoketClient.loadClients()
            })
        this.$syncConsole.$on('init-clients', list => { this.clientList = list })
    },
    methods: {
        choose (client) {
            this.$syncConsole.scoketClient.remoteMode(client.id)
            this.$snack('choosed ' + client.system.system + ' ' + client.id)
        }
    }
}
</script>
