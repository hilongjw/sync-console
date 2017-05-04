<style>
.rd-console-network-row {
     display: flex;
     line-height: 1.7;
     padding: 5px 10px;
     border-bottom: 1px solid #f2f2f2;
     justify-content: space-between;
}
.rd-console-net-detail-row {
    display: flex;
    font-size: 12px;
}
.rd-console-net-detail-row-col-key {
    font-weight: 600;
    margin-right: 10px;
}
.rd-console-network-item-title {
    font-size: 14px;
    padding: 10px 0;
    font-weight: 600;
}
.rd-console-network-item-detail {
    padding: 10px;
    box-sizing: border-box;
}
</style>

<template>
    <div class="rd-console-network-item">
       <dl 
            class="rd-console-network-row hover-black"
            :key="data._requestID"
            @click="toggle"
        >   
            <dd class="rd-console-network-row-url">
                {{ data.url }}
            </dd>
            <dd class="rd-console-network-row-meta-item">
                {{ data.status }}
            </dd>
            <dd class="rd-console-network-row-meta-item">
                {{ data.costTime }} ms
            </dd>
        </dl> 
        <div class="rd-console-network-item-detail" v-if="show">
            <div class="rd-console-network-item-title">
                Header
            </div>
            <div class="rd-console-net-detail-row" v-for="(val, key) in data.headers">
                <div class="rd-console-net-detail-row-col rd-console-net-detail-row-col-key">
                    {{ key }}:
                </div>
                 <div class="rd-console-net-detail-row-col">
                    {{ val }}
                </div>
            </div>
            <div class="rd-console-network-item-title">
                    Response
            </div>
            <div>
                {{ data.response }}
            </div>
        </div>
    </div>
    
</template>

<script>
export default {
    props: {
        data: Object
    },
    data () {
        return {
            show: false
        }
    },
    methods: {
        toggle () {
            this.show = !this.show
        }
    }
}
</script>
