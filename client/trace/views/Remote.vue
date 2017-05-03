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
.rd-console-execcode-remote-right {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
}
.rd-console-btn-client {
    position: absolute;
    left: 0;
    top: 0;
}
.rd-console-remote-client-list {
    position: absolute;
    bottom: 40px;
    left: 5px;
    background: #fff;
    box-shadow: 1px 4px 9px 2px #ccc;
    padding: 10px;
    border-radius: 4px;
}
.rd-console-remote-client {
    line-height: 30px;
}
</style>

<template>
    <div class="rd-console-view rd-console-console">
        <Log :key="log.id" :log="log" v-for="log in logQueue"></Log>
        <div class="rd-console-execcode-remote">
            <div class="rd-console-remote-client-list" v-show="state.showClient">
                <div class="rd-console-remote-client" v-for="client in clientList" @click="choose(client)" >
                    {{ 'system: ' + client.system.system  }}
                </div>
            </div>
            <button class="rd-console-btn rd-console-btn-client"  @click="toggleClient">Client</button>
            <textarea @keyup.enter="fire" placeholder="run code here..." class="rd-console-exec-text" v-model="command" rows="1"></textarea>
            <div class="rd-console-execcode-remote-right">
                <button class="rd-console-btn rd-console-btn-exec highlight"  @click="fire">OK</button>
                <button class="rd-console-btn rd-console-btn-clear"  @click="clear">Clear</button>
            </div>
            
        </div>
    </div>
</template>

<script>
import Log from '../components/LogViewer.vue'
import axios from 'axios'
import io from 'socket.io-client'



export default {
    data () {
        return {
            client: io.connect(this.$root.$logManager.options.socket),
            state: {
                showClient: false
            },
            target: '',
            command: '',
            clientList: [],
            logQueue: []
        }
    },
    components: {
        Log
    },
    mounted () {
        this.queryClient()

        this.client.on('run-code-callback', log => {
            this.logQueue.push(log)
        })

        this.client.on('add-client', client => {
            this.clientList.push(client)
        })

        this.client.on('remove-client', client => {
            this.clientList.map((c, i) => {
                if (client.id === c.id) {
                    this.clientList.splice(i, 1)
                }
            })
        })
    },
    methods: {
        queryClient () {
            axios({
                url: '/clients'
            })
            .then(res => {
                this.clientList = res.data
            })
        },
        toggleClient () {
            this.state.showClient = !this.state.showClient
        },
        choose (client) {
            this.target = client.id
            this.toggleClient()
        },
        clear () {
            this.logQueue = []
        },
        fire () {
            this.client.emit('run-code', {
                target: this.target,
                code: this.command
            })
            this.command = ''
        }
    }
}
</script>