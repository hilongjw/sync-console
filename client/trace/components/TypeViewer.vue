<style>
.rd-log-val {
    margin-right: 5px;
}
.rd-log-val-number {
    color: #3F51B5;
}
.rd-log-val-grey {
    color: #9E9E9E;
}
</style>

<script>
import getType from '../lib/get-type'
import JSONViewer from './JSONViewer.vue'

const classMap = {
    number: 'rd-log-val-number',
    undefined: 'rd-log-val-gray',
    null: 'rd-log-val-gray'
}

const typeViewerClass = 'rd-log-val'

export default {
    props: ['data'],
    render (h) {
        const typeClass = typeViewerClass + ' ' + classMap[getType(this.data)]
        // console.debug(this.data)
        return h(JSONViewer, {
            attrs: {
                class: typeClass
            },
            props: {
                data: this.data
            }
        })
    },
    components: {
        JSONViewer
    }
}
</script>