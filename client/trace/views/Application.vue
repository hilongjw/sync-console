<style>
.rd-console-app {
    display: flex;
    height: 100%;
}
.rd-console-app-navs {
    background: #f7f7f7;
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
    background: #f7f7f7;
    display: flex;
    padding: 5px 10px;
}
.rd-console-app-table-row {
     display: flex;
     line-height: 1.7;
     padding: 5px 10px;
     border-bottom: 1px solid #ccc;
}
.rd-console-app-table-key,
.rd-console-app-table-hd-key {
    width: 100px;
    flex-shrink: 0;
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
    <div class="rd-console-view rd-console-app">
        <div class="rd-console-app-navs ">
            <div class="rd-console-app-nav hover-black">Local Storage</div>
        </div>
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
                    <div class="rd-console-app-table-row" v-for="row in list">
                        <div class="rd-console-app-table-key">
                            {{ row.key }}
                        </div>
                        <div class="rd-console-app-table-val">
                            {{ row.val }}
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            list: [{
                key: 'asdasd',
                val: 'asdasdasdasd'
            }, {
                key: 'asdasd',
                val: 'asdasdasdasd'
            }, {
                key: 'asdasd',
                val: 'asdasdasdasd'
            }, {
                key: 'asdasd',
                val: 'asdasdasdasd'
            }, {
                key: 'asdasd',
                val: 'asdasdasdasd'
            }, {
                key: 'asdasd',
                val: 'asdasdasdasd'
            }]
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        init () {
            if (!window && !window.localStorage) return
            this.list = Object.keys(window.localStorage).map(key => {
                return {
                    key: key,
                    val: window.localStorage[key]
                }
            })
        }
    }
}
</script>
