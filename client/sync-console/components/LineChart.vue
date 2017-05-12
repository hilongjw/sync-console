<style>
.rd-line-chart {
    background: white;
    width: 100%;
    height: 10px;
    padding: 10px 10px 10px 0;
}
</style>

<template>
    <div>
        <svg :viewBox="viewBox" class="rd-line-chart ">
            <g :transform="transform">
                <polyline
                 fill="none"
                 x="0" 
                 y="0"
                 stroke="#0074d9"
                 stroke-width="3"
                 :points="points"
                />
            </g>
        </svg>
    </div>
    
</template>

<script>
export default {
    props: {
        data: Array
    },
    data () {
        return {
            transform: 'translate(-500 0)',
            viewBox: '0 0 1000 50'
        }
    },
    computed: {
        points () {
            return this.data.map((item, i) => {
                return i * 20 + ',' + item.size
            }).join(' ')
        }
    },
    mounted () {
        this.$nextTick(() => {
            const width = this.$el.offsetWidth
            this.viewBox = '0 0 ' + width + ' 50'
            this.transform = 'translate(-' + 2 * width + ' 0)'
        })
    }
}
</script>
