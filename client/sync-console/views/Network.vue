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

.rd-console-network-row {
    display: flex;
    line-height: 1.7;
    padding: 5px 10px;
    border-bottom: 1px solid #f2f2f2;
    justify-content: space-between;
    margin: 0;
}
.rd-console-net-detail-row {
    display: flex;
    font-size: 12px;
}
.rd-console-net-detail-row-col-key {
    font-weight: 600;
    margin-right: 10px;
}
.rd-console-network-item-title {
    font-size: 14px;
    padding: 10px 0;
    font-weight: 600;
}
.rd-console-network-item-detail {
    padding: 10px;
    box-sizing: border-box;
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
                    <button class="rd-console-btn highlight" @click="fire">Fire</button>
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
            list: [] // this.$syncConsole.netWorkQueue.slice()
        }
    },
    components: {
        NetworkItem
    },
    mounted () {
        this.$syncConsole.$on('update-net', () => {
            this.list = this.$syncConsole.netWorkQueue.slice()
        })
    },
    methods: {
        fire () {
            axios({
                url: '/'
            })
            .then(() => {
                console.info('reported')
            })
            this.$snack('report success')
        },
        clear () {
            this.$syncConsole.netWorkQueue = []
        }
    }
}
</script>
