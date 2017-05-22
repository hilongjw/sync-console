<style>
.rd-console-element {

}
</style>

<template>
    <div class="rd-console-view rd-console-element">
        <DOMViewer :data="elementNode"></DOMViewer>
    </div>
</template>

<script>
import { getType } from '../utils'
import DOMViewer from '../components/DOMViewer.vue'

const isDom = /HTML([a-zA-Z]*)Element/i

function getAttributes (dom) {
    const attrs = []
    if (!dom || !dom.attributes) return attrs
    const attributes = dom.attributes
    for (let i = 0; i < attributes.length; i++) {
        attrs.push({
            key: attributes[i].nodeName,
            val: attributes[i].nodeValue
        })
    }
    return attrs
}

function parseNode (dom) {
    const type = getType(dom)
    if (type === 'text') return dom.data
    if (type === 'comment') {
        return {
            type: type,
            attrs: [],
            children: [dom.data]
        }
    }
    if (!dom || !isDom.test(type)) {
        return { type: type }
    }
    const children = []

    for (let i = 0, len = dom.childNodes.length; i < len; i++) {
        children.push(parseNode(dom.childNodes[i]))
    }

    return {
        tag: dom.tagName.toLowerCase(),
        attrs: getAttributes(dom),
        children: children // [ /*<String>*/ /* <Node> */ ]
    }
}

export default {
    data () {
        return {
            elementNode: {
                tag: '',
                attrs: [],
                children: []
            }
        }
    },
    components: {
        DOMViewer
    },
    mounted () {
        this.elementNode = parseNode(document.querySelector('html'))
    },
    beforeDestroy () {

    },
    methods: {
        parseNode () {

        }
    }
}
</script>
