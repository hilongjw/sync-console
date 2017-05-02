<template>
    <div class="rd-console-view">
        <button @click="report">Report</button>
    </div>
</template>

<script>
export default {
    data () {
        return {
            data: []
        }
    },
    mounted () {
        console.log('66666')
    },
    methods: {
        report () {
            console.log('report sucesss')
        }
    }
}
</script>