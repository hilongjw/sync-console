<style>
.rd-console-item {
    display: flex;
    line-height: 1.7;
    font-size: 13px;
    padding: 0 10px;
    border-bottom: 1px solid #f1f1f1;
}
.rd-console-item.rd-log-type-error {
    background: #fff0f0;
}
.rd-console-item.rd-log-type-warn {
    background: #fffbe5;
}
.rd-console-item.rd-log-type-error .json-view {
    color: red;
}
.rd-console-item.rd-log-type-warn .json-view {
    color: #624100;
}
</style>

<template>
    <div class="rd-console-item" :class="logClass">
        <JSONViewer v-for="arg in log.args" :data="arg" :key="arg"></JSONViewer>
    </div>
</template>

<script>
import TypeViewer from './TypeViewer.vue'
import JSONViewer from './JSONViewer.vue'

const logClassMap = {
    error: 'rd-log-type-error',
    warn: 'rd-log-type-warn'
}

export default {
    props: {
        log: Object
    },
    computed: {
        logClass () {
            let classData = {}

            if (logClassMap[this.log.type]) {
                classData[logClassMap[this.log.type]] = true
            }

            return classData
        }
    },
    components: {
        TypeViewer,
        JSONViewer
    }
}
</script>