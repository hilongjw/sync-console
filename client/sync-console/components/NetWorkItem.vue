<style>
.rd-console-network-item-response {
    background: #f3f3f3;
    padding: 10px;
    color: #484848;
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
                Request Header
            </div>
            <div class="rd-console-net-detail-row" v-for="(val, key) in data.requestHeader">
                <div class="rd-console-net-detail-row-col rd-console-net-detail-row-col-key">
                    {{ key }}:
                </div>
                 <div class="rd-console-net-detail-row-col">
                    {{ val }}
                </div>
            </div>
            <div class="rd-console-network-item-title">
                Responce Header
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
            <div class="rd-console-network-item-response">
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
