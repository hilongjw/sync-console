<style>
.rd-console-header-actions {
    display: flex;
    overflow-x: auto;
}
</style>

<template>
    <div class="rd-console-header-actions">
        <Tab 
            :key="tab.text" 
            v-for="(tab, index) in tabs" 
            :tab="tab"
            @touch="touch(tab, index)"
        ></Tab>
    </div>
</template>

<script>
import Tab from './Tab.vue'

export default {
    props: {
        tabs: Array
    },
    components: {
        Tab
    },
    methods: {
        touch (tab, index) {
            this.tabs.map(item => item.active = false)
            tab.active = true
            this.$emit('touch', tab)
            this.$router.push(tab.router)
        }
    }
}
</script>