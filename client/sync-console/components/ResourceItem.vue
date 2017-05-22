<style>
.rd-console-resource-item-response {
    background: #f3f3f3;
    padding: 10px;
    color: #484848;
}
.rd-console-resource-body-size {
    color: #a9a9a9;
}
</style>

<template>
    <div class="rd-console-resource-item">
       <dl 
            class="rd-console-resource-row hover-black"
            @click="toggle"
        >   
            <dd class="rd-console-resource-row-url">
                {{ data.name }}
            </dd>
            <dd class="rd-console-resource-row-url">
                {{ data.initiatorType }}
            </dd>
            <dd class="rd-console-resource-row-meta-item">
                <div class="rd-console-resource-transfer-size ">
                    {{ data.transferSize  | size }}
                </div>
                <div class="rd-console-resource-body-size">
                    {{ data.decodedBodySize  | size }}
                </div>
            </dd>
            <dd class="rd-console-resource-row-meta-item">
                {{ data.duration | ms }}
            </dd>
        </dl> 
        <div class="rd-console-resource-item-detail" v-if="show">
            <div class="rd-console-resource-item-title">
                detail
            </div>
            <div class="rd-console-net-detail-row" v-for="(val, key) in data.toJSON()">
                <div class="rd-console-net-detail-row-col rd-console-net-detail-row-col-key">
                    {{ key }}:
                </div>
                 <div class="rd-console-net-detail-row-col">
                    {{ val }}
                </div>
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
    filters: {
        size (size) {
            let result = (size / 1024)
            if (result < 1024) {
                return result.toFixed(2) + ' KB'
            } else {
                return (result / 1024).toFixed(2) + ' MB'
            }
        },
        ms (time) {
            return (time / 1000).toFixed(2) + ' ms'
        }
    },
    mounted () {
        window.bb = this
    },
    methods: {
        toggle () {
            this.show = !this.show
        }
    }
}
</script>
