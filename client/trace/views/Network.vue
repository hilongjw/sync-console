<style>
.rd-console-network {
    display: flex;
    height: 100%;
}
.rd-console-network-list {
    width: 100%;
}
.rd-console-network-row-url {
    text-align: left;
    flex: 3;
    overflow: hidden;
    -webkit-margin-start: 0;
}
.rd-console-network-row-meta-item {
    flex: 1;
    -webkit-margin-start: 0;
}
</style>
<template>
    <div class="rd-console-view rd-console-network">
        <div class="rd-console-network-list">
            <dl class="rd-console-network-row">
                <dd class="rd-console-network-row-url">
                    url
                </dd>
                <dd class="rd-console-network-row-meta-item">
                    status
                </dd>
                <div class="rd-console-network-row-meta-item">
                    time
                </div>
            </dl> 
            <NetworkItem v-for="row in list" :key="row._requestId" :data="row"></NetworkItem>
            <div class="rd-console-execcode">
                <div class="rd-console-execcode-action-right">
                    <button class="rd-console-btn highlight"  @click="fire">Fire</button>
                    <button class="rd-console-btn"  @click="clear">Clear</button>
                </div>
            </div> 
        </div>
    </div>
</template>

<script>
import NetworkItem from '../components/NetWorkItem.vue'
import axios from 'axios'

export default {
    data () {
        return {
            list: window.logManager.netWorkQueue
        }
    },
    components: {
        NetworkItem
    },
    mounted () {

    },
    methods: {
        fire () {
            axios({
                url: '/clients'
            })
            .then(res => {
                this.clientList = res.data
            })
        },
        clear () {
             window.logManager.netWorkQueue = []
        }
    }
}
</script>
