<style>
.rd-console-resource {
    display: flex;
    height: 100%;
    padding-bottom: 35px;
}
.rd-console-resource-list {
    width: 100%;
}
.rd-console-resource-row-url {
    text-align: left;
    flex: 3;
    overflow: hidden;
    -webkit-margin-start: 0;
}
.rd-console-resource-row-meta-item {
    font-size: 12px;
    flex: 1;
    -webkit-margin-start: 0;
}

.rd-console-resource-row {
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
.rd-console-resource-item-title {
    font-size: 14px;
    padding: 10px 0;
    font-weight: 600;
}
.rd-console-resource-item-detail {
    padding: 10px;
    box-sizing: border-box;
}
</style>
<template>
    <div class="rd-console-view rd-console-resource">
        <div class="rd-console-resource-list">
            <dl class="rd-console-resource-row">
                <dd class="rd-console-resource-row-url">
                    name
                </dd>
                <dd class="rd-console-resource-row-meta-item">
                    type
                </dd>
                <div class="rd-console-resource-row-meta-item">
                    size
                </div>
                <div class="rd-console-resource-row-meta-item">
                    time
                </div>
            </dl> 
            <ResourceItem v-for="(row, index) in list" :key="index" :data="row"></ResourceItem>
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
import ResourceItem from '../components/ResourceItem.vue'

export default {
    data () {
        return {
            list: [],
            timer: null
        }
    },
    components: {
        ResourceItem
    },
    mounted () {
        this.getEntries()
        this.timer = setInterval(() => {
            this.getEntries()
        }, 1000)
    },
    beforeDestroy () {
        clearInterval(this.timer)
    },
    methods: {
        getEntries () {
            if (!window.performance && !window.performance.getEntries) return []
            this.list = window.performance.getEntries()
        }
    }
}
</script>
