<style>
.rd-console {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 40%;
    width: 100%;
}
.rd-console-header {
    background: #673AB7;
    font-size: 13px;
    color: #fff;
    padding-right: 30px;
    cursor: pointer;
}
.rd-console-header-close {
    position: absolute;
    right: 0px;
    top: 0;
    font-size: 16px;
    line-height: 26px;
    width: 20px;
}
.rd-console-header-actions {
    display: flex;
}
.rd-console-body {
    position: absolute;
    background: #fff;
    width: 100%;
    left: 0;
    top: 32px;
    bottom: 0;
    font-size: 13px;
    overflow-y: auto;
}
.rd-console-item {
    border-bottom: 1px solid #f1f1f1;
}

/* global */
.rd-console .hover-black:hover {
    background: rgba(0, 0, 0, 0.15);
    cursor: pointer;
}
.rd-console .hover-shadow:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,.2);
    cursor: pointer;
}
.rd-console-btn {
    background: #dadada;
    color: #151515;
    border: none;
    line-height: 35px;
    height: 35px;
    font-size: 13px;
    padding: 0 20px;
    outline: none;
}
.rd-console-btn.highlight {
    background: #673ab7;
    color: #fff;
}
.rd-console-execcode-action-right {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
}
</style>

<template>
    <div v-if="state.show" class="rd-console" :style="{ height: size.height + 'px' }">
        <div class="rd-console-header" @mousedown="resizeStart" @touchstart="resizeStart">
            <ActionTab :tabs="tabs"></ActionTab>
            <div class="rd-console-header-close" @click="hide">
                ×
            </div>
        </div>
        <div class="rd-console-body">
            <router-view></router-view>
        </div>
        <div class="rd-console-footer">
            
        </div>
    </div>
</template>

<script>
import Log from './components/LogViewer.vue'
import ActionTab from './components/ActionTabs.vue'

function getPointerPosition (e) {
    let pointer

    if (e.clientY || e.clientX || e.pageX || e.pageY) {
        pointer = {
            x: e.clientX || e.pageX,
            y: e.clientY || e.pageY
        }
    } else if (e.touches && e.touches.length){
        pointer = {
            x: e.touches[0].clientX || e.touches[0].pageX,
            y: e.touches[0].clientY || e.touches[0].pageY
        }
    }

    return pointer
}

export default {
    data () {
        return {
            size: {
                scale: false,
                clientY: 0,
                height: 300 
            },
            state: {
                show: true
            },
            tabs: [{
                text: 'Console',
                router: { name: 'console' },
                active: true
            }, {
                text: 'History',
                router: { name: 'history' },
                active: false
            }, {
                text: 'System',
                router: { name: 'system' },
                active: false
            }, {
                text: 'Application',
                router: { name: 'application' },
                active: false
            }, {
                text: 'Report',
                router: { name: 'report' },
                active: false
            }, {
                text: 'Remote',
                router: { name: 'remote' },
                active: false
            }]
        }
    },
    components: {
        Log,
        ActionTab
    },
    mounted () {
        this.$router.push({ name: 'console' })

        window.addEventListener('mouseup', this.resizeEnd)
        window.addEventListener('mousemove', this.resizing)
        window.addEventListener('touchmove', this.resizing)
        window.addEventListener('touchend', this.resizeEnd)

        console.log({ a: [1,2,3], b: { a: { b: { a: 1, b: [], v: {} } } } })
    },
    beforeDestroy () {
        window.removeEventListener('mouseup', this.resizeEnd)
        window.removeEventListener('mousemove', this.resizing)
        window.removeEventListener('touchmove', this.resizing)
        window.removeEventListener('touchend', this.resizeEnd)
    },
    methods: {
        show () {
            this.state.show = true
        },
        hide () {
            this.state.show = false
        },
        resizeStart (e) {
            this.size.scacle = true
            const pointer = getPointerPosition(e)

            if (!pointer) return
            this.size.y = pointer.y
        },
        resizeEnd (e) {
             this.size.scacle = false
        },
        resizing (e) {
            if (!this.size.scacle) return
            const pointer = getPointerPosition(e)
            if (!pointer) return
            e.stopPropagation()

            const delta = this.size.y - pointer.y

            this.size.height += delta
            this.size.y = pointer.y

            if (this.size.height < 30) this.size.height = 30
            if (this.size.height > window.innerHeight) this.size.height = window.innerHeight
        }
    }
}
</script>