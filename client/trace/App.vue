<style>
.rd-console {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 40%;
    width: 100%;
}
.rd-console-header {
    background: #8BC34A;
    font-size: 13px;
    color: #fff;
    cursor: pointer;
}
.rd-console-header-actions {
    display: flex;
}
.rd-console-body {
    position: absolute;
    width: 100%;
    left: 0;
    top: 30px;
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
</style>

<template>
    <div class="rd-console" :style="{ height: state.height + 'px' }">
        <div class="rd-console-header" @mousedown="mousedown" @touchstart="mousedown">
            <ActionTab :tabs="tabs"></ActionTab>
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
            state: {
                scale: false,
                clientY: 0,
                height: 300
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
                text: 'Application',
                router: { name: 'application' },
                active: false
            }, {
                text: 'Report',
                router: { name: 'report' },
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
        window.addEventListener('mouseup', this.mouseup)
        window.addEventListener('mousemove', this.mousemove)

        window.addEventListener('touchmove', this.mousemove)
        window.addEventListener('touchend', this.mouseup)
    },
    methods: {
        mousedown (e) {
            this.state.scacle = true
            const pointer = getPointerPosition(e)

            if (!pointer) return
            this.state.y = pointer.y
        },
        mouseup (e) {
             this.state.scacle = false
        },
        mousemove (e) {
            if (!this.state.scacle) return
            const pointer = getPointerPosition(e)
            if (!pointer) return

            const delta = this.state.y - pointer.y

            this.state.height += delta
            this.state.y = pointer.y

            if (this.state.height < 30) this.state.height = 30
            if (this.state.height > window.innerHeight) this.state.height = window.innerHeight
        }
    }
}
</script>