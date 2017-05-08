<style>
.rd-console-action-tap {
    line-height: 30px;
    padding: 0 10px;
    color: #6b6b6b;
    -webkit-font-smoothing: antialiased;
}
.rd-console-action-tap.active {
    border-bottom: 2px solid #3ae9ff;
    color: #09e0fb;
}
</style>

<template>
    <div class="rd-console-action-tap" @click="touch" :class="{ 'active': tab.active }">
        {{ tab.text }}
    </div>
</template>

<script>
export default {
    props: {
        tab: Object
    },
    methods: {
        touch () {
            this.$emit('touch')
        }
    }
}
</script>
