<style>
.rd-console-item {
    line-height: 2.6;
    font-size: 13px;
    padding: 0 10px;
    border-bottom: 1px solid #f1f1f1;
    box-sizing: border-box;
}
.rd-console-item.rd-log-type-error {
    background: #fff0f0;
}
.rd-console-item.rd-log-type-info::before {
    content: 'i';
    background: #2196F3;
    border-radius: 50%;
    display: inline-block;
    width: 12px;
    height: 12px;
    line-height: 12px;
    color: #fff;
    font-size: 10px;
    text-align: center;
}
.rd-console-item.rd-log-type-warn {
    background: #fffbe5;
}
.rd-console-item.rd-log-type-warn::before {
    content: '!';
    background: #FFC107;
    border-radius: 50%;
    display: inline-block;
    width: 12px;
    height: 12px;
    line-height: 12px;
    color: #fff;
    font-size: 10px;
    text-align: center;
}
.rd-console-item.rd-log-type-error .json-view {
    color: red;
}
.rd-console-item.rd-log-type-warn .json-view {
    color: #624100;
}
.rd-console-item.rd-log-type-error::before {
    content: 'x';
    background: #F44336;
    border-radius: 50%;
    display: inline-block;
    width: 12px;
    height: 12px;
    line-height: 12px;
    color: #fff;
    font-size: 10px;
    text-align: center;
}
</style>

<template>
    <div class="rd-console-item" :class="logClass">
        <JSONViewer v-for="arg in log.args" :data="arg" :key="arg"></JSONViewer>
    </div>
</template>

<script>
import JSONViewer from './JSONViewer.vue'

const logClassMap = {
    info: 'rd-log-type-info',
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
        JSONViewer
    }
}
</script>
