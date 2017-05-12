<style>
.rd-console-app {
    display: flex;
    height: 100%;
    width: 100vw;
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
    flex: 1;
    overflow: auto;
}
.rd-console-app-table-val,
.rd-console-app-table-hd-val {
    flex: 2;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
</style>
<template>
    <div class="rd-console-view rd-console-app">
        <div class="rd-console-app-navs ">
            <div class="rd-console-app-nav hover-black" 
                @click="touchNav(nav)" 
                v-for="nav in navs"
            >{{ nav.text }}</div>
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
                            {{ row.val }}
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import clipboard from 'clipboard-js'

export default {
    data () {
        return {
            navs: [{
                text: 'LocalStorage',
                type: 'localStorage'
            }, {
                text: 'cookie',
                type: 'cookie'
            }, {
                text: 'sessionStorage',
                type: 'sessionStorage'
            }],
            list: []
        }
    },
    mounted () {
        this.initStorage('localStorage')
    },
    methods: {
        initStorage (storage) {
            if (!window && !window[storage]) return
            this.list = Object.keys(window[storage]).map(key => {
                return {
                    key: key,
                    val: window[storage][key]
                }
            })
        },
        initCookie () {
            this.list = [{
                key: 'cookie',
                value: window.document.cookie
            }]
        },
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
        touchNav (nav) {
            switch (nav.type) {
            case 'localStorage':
                this.initStorage('localStorage')
                break
            case 'cookie':
                this.initCookie()
                break
            case 'sessionStorage':
                this.initStorage('sessionStorage')
                break
            }
        }
    }
}
</script>
