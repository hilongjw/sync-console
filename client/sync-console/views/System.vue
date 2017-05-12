<style>
.rd-console-app {
    display: flex;
    height: 100%;
    width: calc(100vw - 150px);
}
.rd-console-app-navs {
    width: 150px;
    flex-shrink: 0;
}
.rd-console-app-nav {
    padding: 10px;
    text-align: center;
}
.rd-console-app-container {
    width: 100%;
}
.rd-console-app-table {
    width: 100%;
}
.rd-console-app-table-header {
    display: flex;
    padding: 5px 10px;
}
.rd-console-app-table-row {
     display: flex;
     line-height: 1.7;
     padding: 5px 10px;
     border-bottom: 1px solid #f2f2f2;
}
.rd-console-app-table-key,
.rd-console-app-table-hd-key {
    width: 100px;
    flex-shrink: 0;
    color: #8a8a8a;
    font-size: 12px;
}
.rd-console-app-table-val,
.rd-console-app-table-hd-val {
    width: 100%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
</style>
<template>
    <div class="rd-console-view rd-console-system">
        <div class="rd-console-app-container">
            <div class="rd-console-app-table">
                <div class="rd-console-app-table-header">
                    <div class="rd-console-app-table-hd-key">
                        Key
                    </div>
                    <div class="rd-console-app-table-hd-val">
                        Value
                    </div>
                </div>
                <div class="rd-console-app-table-body">
                    <div 
                        class="rd-console-app-table-row" 
                        @click="copy(row.val)" 
                        :key="row.key"
                        v-for="row in list"
                    >
                        <div class="rd-console-app-table-key">
                            {{ row.key }}
                        </div>
                        <div class="rd-console-app-table-val">
                            <span>{{ row.val }}</span>
                        </div>
                    </div>

                    <div 
                        class="rd-console-app-table-row" 
                        @click="copy(systemMemory)"
                    >
                        <div class="rd-console-app-table-key">
                            memory
                        </div>
                        <div class="rd-console-app-table-val">
                            <LineChart :data="systemMemory"></LineChart>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import LineChart from '../components/LineChart.vue'
import clipboard from 'clipboard-js'
import { getObjAllKeys } from '../utils'

export default {
    data () {
        return {
            systemMemory: this.$syncConsole.systemInfo.systemMemory,
            list: []
        }
    },
    components: {
        LineChart
    },
    mounted () {
        this.init(this.$syncConsole.system)
    },
    methods: {
        copy (val) {
            const str = JSON.stringify(val)
            clipboard.copy(str)
            .then(() => {
                this.$snack('copy success')
            })
            .catch(err => {
                this.$snack('copy failed')
                console.error(err)
            })
        },
        init (data) {
            this.list = getObjAllKeys(data).map(key => {
                return {
                    key: key,
                    val: data[key]
                }
            })
        }
    }
}
</script>
