<template>
    <div class="rd-console-view">
        <button @click="report">Report</button>
    </div>
</template>

<script>
import axios from 'axios'

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
            axios({
                url: '/'
            })
            .then(() => {
                console.info('reported')
            })
            this.$snack('report success')
        }
    }
}
</script>
